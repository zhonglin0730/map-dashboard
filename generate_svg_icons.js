import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFile = path.join(__dirname, 'src/utils/icons.js');

// Helper to wrap SVG content in a standard premium container
const createSVG = (content, defs = '') => `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
        </filter>
        ${defs}
    </defs>
    <g filter="url(#shadow)">
        ${content}
    </g>
</svg>
`.trim();

// 1. Tree (Landscaping) - Emerald Green Gradient with Glassy look
const treeSVG = createSVG(`
    <path d="M32 4L12 36H24L16 52H48L40 36H52L32 4Z" fill="url(#treeGrad)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="28" y="52" width="8" height="8" rx="1" fill="#795548"/>
`, `
    <linearGradient id="treeGrad" x1="32" y1="4" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#2ecc71"/>
        <stop offset="100%" stop-color="#27ae60"/>
    </linearGradient>
`);

// 2. Facility (Municipal) - Cyan/Blue Gear with depth
const facilitySVG = createSVG(`
    <path d="M32 8C18.7 8 8 18.7 8 32C8 45.3 18.7 56 32 56C45.3 56 56 45.3 56 32C56 18.7 45.3 8 32 8ZM32 14C41.9 14 50 22.1 50 32C50 41.9 41.9 50 32 50C22.1 50 14 41.9 14 32C14 22.1 22.1 14 32 14Z" fill="url(#facGrad)" stroke="white" stroke-width="1.5"/>
    <path d="M32 20V44M20 32H44" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="6" fill="white" fill-opacity="0.9"/>
`, `
    <linearGradient id="facGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#2979ff"/>
    </linearGradient>
`);

// 3. Camera (Safe) - Tech Blue/White Lens
const cameraSVG = createSVG(`
    <circle cx="32" cy="32" r="24" fill="#2c3e50" stroke="white" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" fill="url(#camLens)" stroke="#4dd0e1" stroke-width="2"/>
    <circle cx="32" cy="32" r="6" fill="#00bcd4"/>
    <path d="M32 8V4M56 32H60M32 56V60M8 32H4" stroke="#4dd0e1" stroke-width="2" stroke-linecap="round"/>
`, `
    <radialGradient id="camLens" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(16)">
        <stop offset="0%" stop-color="#1a237e"/>
        <stop offset="100%" stop-color="#0d47a1"/>
    </radialGradient>
`);

// 4. Party (Party Branch) - Ruby Red Star Badge
const partySVG = createSVG(`
    <path d="M32 6L39.5 24H58L43 34.5L48.5 52L32 41L15.5 52L21 34.5L6 24H24.5L32 6Z" fill="url(#partyGrad)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
`, `
    <linearGradient id="partyGrad" x1="6" y1="6" x2="58" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ff5252"/>
        <stop offset="100%" stop-color="#d50000"/>
    </linearGradient>
`);

// 5. Culture (Livelihood) - Golden Temple/Museum
const cultureSVG = createSVG(`
    <path d="M8 48H56V54H8V48ZM32 10L52 22V44H12V22L32 10Z" fill="url(#goldGrad)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="24" y="30" width="16" height="14" rx="2" fill="#fff3e0" fill-opacity="0.8"/>
`, `
    <linearGradient id="goldGrad" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffd740"/>
        <stop offset="100%" stop-color="#ff6f00"/>
    </linearGradient>
`);

// 6. Repair (Curb Stone) - Traffic Cone
const repairSVG = createSVG(`
    <path d="M18 54H46M22 54L32 10L42 54" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 10L18 54H46L32 10Z" fill="url(#coneGrad)"/>
    <path d="M25 40H39M28 26H36" stroke="white" stroke-width="4"/>
`, `
    <linearGradient id="coneGrad" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ff9e80"/>
        <stop offset="100%" stop-color="#ff3d00"/>
    </linearGradient>
`);

// 7. Sewer (Drainage) - Manhole Cover
const sewerSVG = createSVG(`
    <circle cx="32" cy="32" r="22" fill="url(#metalGrad)" stroke="#546e7a" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" stroke="#455a64" stroke-width="1.5" stroke-dasharray="4 2"/>
    <path d="M32 14V50M14 32H50" stroke="#37474f" stroke-width="1.5"/>
    <circle cx="32" cy="32" r="4" fill="#263238"/>
`, `
    <linearGradient id="metalGrad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#cfd8dc"/>
        <stop offset="100%" stop-color="#90a4ae"/>
    </linearGradient>
`);

// 8. Bridge (Municipal) - Golden Arch/Suspension
// 8. Bridge (Municipal) - Golden Arch/Suspension
const bridgeSVG = createSVG(`
    <path d="M4 48H60M8 48C8 30 20 16 32 16C44 16 56 30 56 48" stroke="white" stroke-width="2" fill="none"/>
    <path d="M32 16V48M16 34V48M48 34V48" stroke="white" stroke-width="1.5"/>
    <path d="M6 52H58" stroke="#ffca28" stroke-width="3" stroke-linecap="round"/>
    <path d="M8 48C8 32 18 20 32 20C46 20 56 32 56 48" stroke="url(#bridgeGrad)" stroke-width="3" fill="none"/>
`, `
    <linearGradient id="bridgeGrad" x1="4" y1="48" x2="32" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffb300"/>
        <stop offset="100%" stop-color="#ffe57f"/>
    </linearGradient>
`);

// 9. Sport (Livelihood) - Basketball/Dumbbell
const sportSVG = createSVG(`
  <circle cx="32" cy="32" r="28" fill="url(#sportGrad)" filter="url(#shadow)" stroke="#fff" stroke-width="2"/>
  <path d="M10,32 Q32,10 54,32 Q32,54 10,32" fill="none" stroke="#d35400" stroke-width="2"/>
  <circle cx="32" cy="32" r="28" fill="none" stroke="#d35400" stroke-width="2"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" dy=".35em">🏀</text>
`, `
    <radialGradient id="sportGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#ff9f43;stop-opacity:1" />
      <stop offset="100%" stop-color="#e67e22;stop-opacity:1" />
    </radialGradient>
`);

// 10. Medical (Livelihood) - Cross
const medicalSVG = createSVG(`
  <circle cx="32" cy="32" r="28" fill="#fff" filter="url(#shadow)" stroke="#ff4757" stroke-width="3"/>
  <rect x="26" y="12" width="12" height="40" rx="2" fill="url(#medGrad)"/>
  <rect x="12" y="26" width="40" height="12" rx="2" fill="url(#medGrad)"/>
`, `
    <linearGradient id="medGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff6b81"/>
      <stop offset="100%" stop-color="#ff4757"/>
    </linearGradient>
`);

// 11. Education (Livelihood) - Graduation Cap / Book
const educationSVG = createSVG(`
  <circle cx="32" cy="32" r="28" fill="url(#eduGrad)" filter="url(#shadow)" stroke="#fff" stroke-width="2"/>
  <path d="M32 18L12 28L32 38L52 28L32 18Z" fill="white"/>
  <path d="M16 30V40C16 40 24 44 32 44C40 44 48 40 48 40V30" stroke="white" stroke-width="2" fill="none"/>
  <path d="M52 28V42" stroke="white" stroke-width="2"/>
`, `
    <linearGradient id="eduGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4facfe"/>
      <stop offset="100%" stop-color="#00f2fe"/>
    </linearGradient>
`);

// 12. Notice Icons (Reported Events) - Status Specific
const createNoticeSVG = (color1, color2) => createSVG(`
    <path d="M32 8L5 54H59L32 8Z" fill="url(#noticeGrad_${color1.replace('#', '')})" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <rect x="30" y="24" width="4" height="16" rx="2" fill="white"/>
    <circle cx="32" cy="46" r="3" fill="white"/>
`, `
    <linearGradient id="noticeGrad_${color1.replace('#', '')}" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
`);

const noticeRedSVG = createNoticeSVG('#ff4d4f', '#cf1322');
const noticeOrangeSVG = createNoticeSVG('#ffa940', '#d46b08');
const noticeGreenSVG = createNoticeSVG('#73d13d', '#389e0d');

const icons = {
    treeIcon: treeSVG,
    facilityIcon: facilitySVG,
    cameraIcon: cameraSVG,
    partyIcon: partySVG,
    cultureIcon: cultureSVG,
    repairIcon: repairSVG,
    sewerIcon: sewerSVG,
    bridgeIcon: bridgeSVG,
    sportIcon: sportSVG,
    medicalIcon: medicalSVG,
    educationIcon: educationSVG,
    noticePending: noticeRedSVG,
    noticeProcessing: noticeOrangeSVG,
    noticeCompleted: noticeGreenSVG
};

let content = '// Auto-generated SVG Base64 Icons\n\n';

Object.entries(icons).forEach(([name, svgString]) => {
    const base64 = Buffer.from(svgString).toString('base64');
    content += `export const ${name} = 'data:image/svg+xml;base64,${base64}';\n\n`;
});

fs.writeFileSync(outputFile, content);
console.log(`SVG Icons generated at ${outputFile}`);
