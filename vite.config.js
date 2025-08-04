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
			name: 'folder-structure',
			writeBundle(options, bundle) {
				const outDir = options.dir || 'dist';
				
				// Files to create folders for
				const filesToProcess = [
					{ from: 'services.html', to: 'services' },
					{ from: 'about.html', to: 'about' },
					{ from: 'contact.html', to: 'contact' }
				];

				console.log('Creating folder structure for clean URLs...');

				filesToProcess.forEach(({ from, to }) => {
					const fromPath = path.join(outDir, from);
					const folderPath = path.join(outDir, to);
					const indexPath = path.join(folderPath, 'index.html');
					
					if (fs.existsSync(fromPath)) {
						// Create the folder
						if (!fs.existsSync(folderPath)) {
							fs.mkdirSync(folderPath, { recursive: true });
						}
						
						// Read the HTML content
						const content = fs.readFileSync(fromPath, 'utf8');
						
						// Create index.html inside the folder
						fs.writeFileSync(indexPath, content);
						
						// Remove the original file
						fs.unlinkSync(fromPath);
						
						console.log(`✓ Created ${to}/index.html`);
					} else {
						console.log(`⚠ File ${from} not found`);
					}
				});

				console.log('Folder structure created successfully!');
			}
		}
	],
});
