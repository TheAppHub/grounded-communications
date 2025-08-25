import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Contact page intro animation
function initContactAnimation() {
	const tl = gsap.timeline();

	// Get elements
	const heroSection = document.querySelector(".contact .hero-section");
	const heroImages = document.querySelectorAll(
		".contact .hero-image-wrapper img",
	);
	const heroSubtitle = document.querySelector(".contact .hero-subtitle");
	const heroTitle = document.querySelector(".contact .hero-title span");
	const heroAction = document.querySelector(".contact .hero-action");

	if (!heroSection) return;

	// Set initial states
	gsap.set(heroImages, {
		opacity: 0,
		scale: 1.2,
	});

	gsap.set([heroSubtitle, heroTitle, heroAction], {
		opacity: 0,
		y: 30,
	});

	gsap.set(heroTitle, {
		y: 50,
	});

	// Create the animation timeline
	tl.to(heroImages, {
		opacity: 1,
		scale: 1,
		duration: 2,
		ease: "power2.out",
		stagger: 0.2,
	})
		.to(
			heroSubtitle,
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "power2.out",
			},
			"-=1",
		)
		.to(
			heroTitle,
			{
				opacity: 1,
				y: 0,
				duration: 1.5,
				ease: "power2.out",
			},
			"-=0.5",
		)
		.to(
			heroAction,
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "power2.out",
			},
			"-=0.5",
		);

	// Scroll to form section when clicking the arrow
	heroAction.addEventListener("click", () => {
		const formSection = document.querySelector(".contact-form-section");
		if (formSection) {
			formSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	});
}

// Contact form handling with enhanced feedback
function initContactForm() {
	const form = document.querySelector(".contact-form");
	if (!form) return;

	const submitBtn = form.querySelector(".submit-btn");
	const originalBtnText = submitBtn.textContent;

	// Real-time validation feedback
	const inputs = form.querySelectorAll("input, textarea, select");
	inputs.forEach((input) => {
		input.addEventListener("blur", () => validateField(input));
		input.addEventListener("input", () => clearFieldError(input));
	});

	// Form submission handler
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Clear previous messages
		clearAllMessages();

		// Validate all fields
		if (!validateAllFields()) {
			showMessage("Please fix the errors above before submitting.", "error");
			return;
		}

		// Get form data
		const formData = new FormData(form);
		const data = {
			name: formData.get("name").trim(),
			email: formData.get("email").trim(),
			phone: formData.get("phone").trim(),
			company: formData.get("company").trim(),
			service: formData.get("service"),
			message: formData.get("message").trim(),
		};

		// Show loading state
		setSubmitButtonState(submitBtn, true, "Sending...");

		try {
			// API Gateway URL for contact form
			const API_URL =
				"https://0n7iawd5zh.execute-api.ap-southeast-2.amazonaws.com/default/contact";

			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok) {
				// Success
				showMessage(
					"🎉 Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
					"success",
				);
				form.reset();
				clearAllFieldErrors();

				// Scroll to success message
				setTimeout(() => {
					const message = document.querySelector(".form-message");
					if (message) {
						message.scrollIntoView({ behavior: "smooth", block: "center" });
					}
				}, 100);
			} else {
				// Error from API
				showMessage(
					`❌ ${
						result.error ||
						"An error occurred while sending your message. Please try again."
					}`,
					"error",
				);
			}
		} catch (error) {
			console.error("Network error:", error);
			showMessage(
				"❌ Network error. Please check your connection and try again.",
				"error",
			);
		} finally {
			// Reset button state
			setSubmitButtonState(submitBtn, false, originalBtnText);
		}
	});
}

// Field validation
function validateField(field) {
	const value = field.value.trim();
	const fieldName = field.name;
	let isValid = true;
	let errorMessage = "";

	// Remove existing error styling
	clearFieldError(field);

	// Required field validation
	if (field.hasAttribute("required") && !value) {
		isValid = false;
		errorMessage = `${getFieldLabel(field)} is required`;
	}

	// Email validation
	if (fieldName === "email" && value) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			isValid = false;
			errorMessage = "Please enter a valid email address";
		}
	}

	// Phone validation (if provided)
	if (fieldName === "phone" && value) {
		const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
		if (!phoneRegex.test(value)) {
			isValid = false;
			errorMessage = "Please enter a valid phone number";
		}
	}

	// Message length validation
	if (fieldName === "message" && value) {
		if (value.length < 10) {
			isValid = false;
			errorMessage = "Message must be at least 10 characters long";
		}
	}

	if (!isValid) {
		showFieldError(field, errorMessage);
	}

	return isValid;
}

// Validate all fields
function validateAllFields() {
	const inputs = document.querySelectorAll(
		".contact-form input, .contact-form textarea, .contact-form select",
	);
	let allValid = true;

	inputs.forEach((input) => {
		if (!validateField(input)) {
			allValid = false;
		}
	});

	return allValid;
}

// Show field error
function showFieldError(field, message) {
	// Add error class to field
	field.classList.add("field-error");

	// Create error message element
	const errorEl = document.createElement("div");
	errorEl.className = "field-error-message";
	errorEl.textContent = message;
	errorEl.style.color = "#dc3545";
	errorEl.style.fontSize = "0.8rem";
	errorEl.style.marginTop = "0.25rem";

	// Insert after the field
	field.parentNode.appendChild(errorEl);
}

// Clear field error
function clearFieldError(field) {
	field.classList.remove("field-error");
	const errorEl = field.parentNode.querySelector(".field-error-message");
	if (errorEl) {
		errorEl.remove();
	}
}

// Clear all field errors
function clearAllFieldErrors() {
	const inputs = document.querySelectorAll(
		".contact-form input, .contact-form textarea, .contact-form select",
	);
	inputs.forEach((input) => {
		clearFieldError(input);
	});
}

// Get field label
function getFieldLabel(field) {
	const label = field.parentNode.querySelector("label");
	return label ? label.textContent.replace(":", "") : field.name;
}

// Set submit button state
function setSubmitButtonState(button, isLoading, text) {
	button.disabled = isLoading;
	button.textContent = text;

	if (isLoading) {
		button.classList.add("loading");
	} else {
		button.classList.remove("loading");
	}
}

// Show success/error messages
function showMessage(message, type) {
	// Remove existing messages
	clearAllMessages();

	// Create message element
	const messageEl = document.createElement("div");
	messageEl.className = `form-message form-message--${type}`;
	messageEl.innerHTML = message;

	// Insert after the form
	const form = document.querySelector(".contact-form");
	form.parentNode.insertBefore(messageEl, form.nextSibling);

	// Auto-remove after 8 seconds for success, 10 seconds for error
	const timeout = type === "success" ? 8000 : 10000;
	setTimeout(() => {
		if (messageEl.parentNode) {
			messageEl.remove();
		}
	}, timeout);
}

// Clear all messages
function clearAllMessages() {
	const messages = document.querySelectorAll(".form-message");
	messages.forEach((msg) => msg.remove());
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	initContactAnimation();
	initContactForm();
});

export { initContactAnimation, initContactForm };
