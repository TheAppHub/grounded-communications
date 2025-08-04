import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

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
	plugins: [
		{
			name: 'clean-urls',
			writeBundle(options, bundle) {
				const outDir = options.dir || 'dist';
				
				// Files to create clean URLs for
				const filesToProcess = [
					{ from: 'services.html', to: 'services' },
					{ from: 'about.html', to: 'about' },
					{ from: 'contact.html', to: 'contact' }
				];

				console.log('Creating clean URLs...');

				filesToProcess.forEach(({ from, to }) => {
					const fromPath = path.join(outDir, from);
					const toPath = path.join(outDir, to);
					
					if (fs.existsSync(fromPath)) {
						// Read the HTML content
						const content = fs.readFileSync(fromPath, 'utf8');
						
						// Create a file with .html extension that S3 can serve
						const htmlPath = path.join(outDir, `${to}.html`);
						fs.writeFileSync(htmlPath, content);
						
						// Also create a copy without extension for clean URLs
						// This will be served by CloudFront with proper MIME type configuration
						fs.writeFileSync(toPath, content);
						
						console.log(`✓ Created ${to}.html and ${to}`);
					} else {
						console.log(`⚠ File ${from} not found`);
					}
				});

				console.log('Clean URLs created successfully!');
				console.log('Note: Configure S3/CloudFront to serve files without extensions with text/html MIME type');
			}
		}
	],
});
