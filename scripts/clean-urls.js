import fs from 'fs';
import path from 'path';

const distDir = 'dist';

// Files to rename (from .html to clean URLs)
const filesToRename = [
	{ from: 'services.html', to: 'services' },
	{ from: 'about.html', to: 'about' },
	{ from: 'contact.html', to: 'contact' }
];

console.log('Creating clean URLs...');

filesToRename.forEach(({ from, to }) => {
	const fromPath = path.join(distDir, from);
	const toPath = path.join(distDir, to);
	
	if (fs.existsSync(fromPath)) {
		// Copy the HTML file content
		const content = fs.readFileSync(fromPath, 'utf8');
		
		// Create the clean URL file
		fs.writeFileSync(toPath, content);
		
		// Remove the original .html file
		fs.unlinkSync(fromPath);
		
		console.log(`✓ Renamed ${from} to ${to}`);
	} else {
		console.log(`⚠ File ${from} not found`);
	}
});

console.log('Clean URLs created successfully!'); 