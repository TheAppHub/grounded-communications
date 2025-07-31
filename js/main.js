// Import external libraries
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

// Import and initialize scripts with proper ES6 structure
import { initScripts } from "./script.js";
import { initCards } from "./cards.js";

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	initScripts(gsap, Lenis, ScrollTrigger);
	initCards(gsap, Lenis, ScrollTrigger, SplitText);
});
