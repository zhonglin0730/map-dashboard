import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Correct paths relative to project root
const iconsDir = path.join(__dirname, 'public/icons');
const outputFile = path.join(__dirname, 'src/utils/icons.js');

const icons = [
    { name: 'treeIcon', file: 'tree.png' },
    { name: 'facilityIcon', file: 'facility.png' },
    { name: 'cameraIcon', file: 'camera.png' },
    { name: 'partyIcon', file: 'party.png' },
    { name: 'cultureIcon', file: 'culture.png' }
];

let content = '// Auto-generated Base64 Icons to avoid Mixed Content issues in IFrame\n\n';

if (!fs.existsSync(iconsDir)) {
    console.error(`Icons directory not found: ${iconsDir}`);
    process.exit(1);
}

icons.forEach(({ name, file }) => {
    const filePath = path.join(iconsDir, file);
    try {
        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const base64 = buffer.toString('base64');
            content += `export const ${name} = 'data:image/png;base64,${base64}';\n\n`;
            console.log(`Converted ${file}`);
        } else {
            console.error(`File not found: ${filePath}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}:`, e);
    }
});

fs.writeFileSync(outputFile, content);
console.log(`Icons generated at ${outputFile}`);
