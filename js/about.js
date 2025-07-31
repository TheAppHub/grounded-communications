import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// About page intro animation
function initAboutAnimation() {
	const tl = gsap.timeline();

	// Get elements
	const heroSection = document.querySelector(".about .hero-section");
	const heroImages = document.querySelectorAll(
		".about .hero-image-wrapper img",
	);
	const heroSubtitle = document.querySelector(".about .hero-subtitle");
	const heroTitle = document.querySelector(".about .hero-title span");
	const heroAction = document.querySelector(".about .hero-action");

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

	// Scroll to content section when clicking the arrow
	heroAction.addEventListener("click", () => {
		const contentSection = document.querySelector(".about-content-section");
		if (contentSection) {
			contentSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	});

	// Animate objectives on scroll
	const objectiveItems = document.querySelectorAll(".objective-item");

	objectiveItems.forEach((item) => {
		ScrollTrigger.create({
			trigger: item,
			start: "top 80%",
			onEnter: () => {
				item.classList.add("animate");
			},
			onLeave: () => {
				item.classList.remove("animate");
			},
			onEnterBack: () => {
				item.classList.add("animate");
			},
			onLeaveBack: () => {
				item.classList.remove("animate");
			},
		});
	});
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initAboutAnimation);

export { initAboutAnimation };
