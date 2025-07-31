import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
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
