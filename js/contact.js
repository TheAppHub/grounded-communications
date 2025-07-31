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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initContactAnimation);

export { initContactAnimation };
