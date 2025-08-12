import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: "index.html",
				services: "services.html",
				about: "about.html",
				contact: "contact.html",
			},
			output: {
				manualChunks: {
					vendor: ["gsap", "lenis"],
				},
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name.split(".");
					const ext = info[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
						return `assets/images/[name]-[hash][extname]`;
					}
					if (/css/i.test(ext)) {
						return `assets/css/[name]-[hash][extname]`;
					}
					if (/js/i.test(ext)) {
						return `assets/js/[name]-[hash][extname]`;
					}
					return `assets/[name]-[hash][extname]`;
				},
			},
			plugins: [
				{
					name: "copy-email-logo",
					generateBundle() {
						// This ensures email-logo.png is included in the build
						this.emitFile({
							type: "asset",
							fileName: "assets/images/email-logo.png",
							source: require("fs").readFileSync("img/email-logo.png"),
						});
					},
				},
			],
		},
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		cssMinify: true,
		sourcemap: false,
		// Copy email-logo.png to build output
		assetsInlineLimit: 0,
	},
	server: {
		port: 3000,
		open: true,
		host: true,
	},
	preview: {
		port: 4173,
		open: true,
	},
});
