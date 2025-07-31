const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// Ensure img directory exists
if (!fs.existsSync("img")) {
	fs.mkdirSync("img");
}

const images = [
	"contact.jpg",
	"about.jpg",
	"marketing-strategy.jpg",
	"digital-marketing.jpg",
	"branding.jpg",
	"website-development.jpg",
	"step-1.jpg",
	"step-2.jpg",
	"step-3.jpg",
	"sky-copy.png",
	"mountain-copy.png",
	"tractor-copy.png",
];

const colors = [
	"#667eea",
	"#764ba2",
	"#b04e00",
	"#5e6282",
	"#8a3d00",
	"#e9ecef",
	"#212125",
	"#ffffff",
];

function generateImage(filename, width = 800, height = 600) {
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// Create gradient background
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
	gradient.addColorStop(1, colors[Math.floor(Math.random() * colors.length)]);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Add text
	ctx.fillStyle = "#ffffff";
	ctx.font = "bold 24px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	const text = filename
		.replace(".jpg", "")
		.replace(".png", "")
		.replace("-", " ")
		.toUpperCase();
	ctx.fillText(text, width / 2, height / 2);

	// Save image
	const buffer = canvas.toBuffer("image/jpeg");
	fs.writeFileSync(path.join("img", filename), buffer);
	console.log(`Generated: ${filename}`);
}

// Generate all images
images.forEach((filename) => {
	generateImage(filename);
});

console.log("All placeholder images generated successfully!");
