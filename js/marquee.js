export function initMarquee(gsap, ScrollTrigger) {
	const marqueeItems = gsap.utils.toArray(".marquee");

	if (marqueeItems.length === 0) {
		return; // Exit if no marquee items found
	}

	marqueeItems.forEach((marquee) => {
		// Get all h2 elements inside this marquee
		const h2Elements = marquee.querySelectorAll("h2");

		if (h2Elements.length === 0) return;

		// Clear any existing clones first
		const existingClones = marquee.querySelectorAll("h2[data-clone]");
		existingClones.forEach((clone) => clone.remove());

		// Create a wrapper for the original content
		const originalContent = marquee.innerHTML;
		marquee.innerHTML = "";

		// Create multiple sets for seamless looping (3 sets total)
		const sets = [];
		for (let i = 0; i < 3; i++) {
			const set = document.createElement("div");
			set.className = "marquee-set";
			set.style.display = "flex";
			set.style.gap = "20px";
			set.style.alignItems = "center";
			set.style.whiteSpace = "nowrap";
			set.innerHTML = originalContent;

			// Mark cloned elements (except for the first set)
			if (i > 0) {
				set.querySelectorAll("h2").forEach((h2) => {
					h2.setAttribute("data-clone", "true");
				});
			}

			sets.push(set);
		}

		// Create a container for all sets
		const container = document.createElement("div");
		container.style.display = "flex";
		container.style.width = "fit-content";

		// Add all sets to container
		sets.forEach((set) => container.appendChild(set));

		// Add container to marquee
		marquee.appendChild(container);

		// Set marquee container styles
		marquee.style.overflow = "hidden";
		marquee.style.position = "relative";

		// Get the width of one complete set
		const firstSetWidth = sets[0].offsetWidth;

		// Create scroll-driven animation that loops
		gsap.to(container, {
			x: -firstSetWidth * 0.3, // Much slower movement - 10x the set width
			ease: "none",
			scrollTrigger: {
				trigger: marquee,
				start: "top bottom", // Start immediately when top of marquee enters viewport
				end: "bottom top", // End when bottom of marquee leaves viewport
				scrub: true,
			},
		});
	});
}
