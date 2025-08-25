import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "ap-southeast-2" });

export const handler = async (event) => {
	console.log("Event received:", JSON.stringify(event, null, 2));

	// Get the origin from the request headers
	const origin = event.headers?.origin || event.headers?.Origin;

	// Define allowed origins for Grounded Communications
	const allowedOrigins = [
		"https://grounded360.com.au",
		"https://www.grounded360.com.au",
		"http://grounded360.com.au",
		"http://www.grounded360.com.au",
		"http://localhost:3000", // For local development
		"http://localhost:4000", // For local development
	];

	// Check if origin is allowed, default to first allowed origin if not
	const allowedOrigin = allowedOrigins.includes(origin)
		? origin
		: allowedOrigins[0];

	// Enable CORS - Allow multiple domains
	const headers = {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Headers":
			"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
		"Access-Control-Allow-Methods": "POST,OPTIONS",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Max-Age": "86400",
	};

	// Get HTTP method from HTTP API v2 event structure
	const httpMethod = event.requestContext?.http?.method || event.httpMethod;

	// Handle preflight requests
	if (httpMethod === "OPTIONS") {
		console.log("Handling OPTIONS preflight request from origin:", origin);
		return {
			statusCode: 200,
			headers,
			body: "",
		};
	}

	// Only allow POST
	if (httpMethod !== "POST") {
		console.log("Method not allowed:", httpMethod);
		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({ error: "Method Not Allowed" }),
		};
	}

	try {
		console.log("Processing POST request from origin:", origin);
		const data = JSON.parse(event.body);
		console.log("Parsed data:", data);

		// Required fields for Grounded contact form
		const requiredFields = ["name", "email", "message"];

		// Validate required fields
		for (const field of requiredFields) {
			if (!data[field]) {
				console.log("Missing required field:", field);
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({ error: `Missing required field: ${field}` }),
				};
			}
		}

		// Check if environment variables are set
		if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
			console.error("Missing environment variables:", {
				FROM_EMAIL: process.env.FROM_EMAIL,
				TO_EMAIL: process.env.TO_EMAIL,
				AWS_REGION: "ap-southeast-2",
			});
			return {
				statusCode: 500,
				headers,
				body: JSON.stringify({
					error: "Server configuration error - missing email settings",
				}),
			};
		}

		// Prepare email content
		const subject = "📧 New Contact Form Submission - Grounded Communications";
		const emailBody = `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${data.name}</p>
			<p><strong>Email:</strong> ${data.email}</p>
			${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
			${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
			${
				data.service
					? `<p><strong>Service Interest:</strong> ${data.service}</p>`
					: ""
			}
			<p><strong>Message:</strong></p>
			<p>${data.message.replace(/\n/g, "<br>")}</p>
			<hr>
			<p><em>This message was sent from your website contact form.</em></p>
		`;

		// Prepare email parameters
		const emailParams = {
			Source: process.env.FROM_EMAIL,
			Destination: {
				ToAddresses: [process.env.TO_EMAIL],
			},
			Message: {
				Subject: {
					Data: subject,
				},
				Body: {
					Html: {
						Data: emailBody,
					},
				},
			},
		};

		console.log("Sending email with params:", emailParams);

		// Send email using AWS SDK v3
		const command = new SendEmailCommand(emailParams);
		await sesClient.send(command);
		console.log("Email sent successfully");

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({ message: "Email sent successfully" }),
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error: "Failed to send email",
				details: error.message,
			}),
		};
	}
};
