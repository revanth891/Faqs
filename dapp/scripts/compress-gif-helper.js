// GIF Compression using Node.js
// This script will help compress the GIF by reducing quality and size

const fs = require('fs');
const path = require('path');

console.log('GIF Compression Helper');
console.log('======================\n');

const inputFile = path.join(__dirname, '..', 'public', 'Mascot', 'Untitled-2.gif');
const stats = fs.statSync(inputFile);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`Current file: ${inputFile}`);
console.log(`Current size: ${sizeMB} MB\n`);

console.log('To compress this GIF, you have several options:\n');

console.log('Option 1: Use an online tool (Recommended for quick results)');
console.log('  - Visit: https://ezgif.com/optimize');
console.log('  - Upload your GIF');
console.log('  - Use "Lossy GIF" compression with level 80-120');
console.log('  - Or use "Optimize GIF" with heavy optimization\n');

console.log('Option 2: Install FFmpeg and use it');
console.log('  1. Download FFmpeg from: https://ffmpeg.org/download.html');
console.log('  2. Add to PATH');
console.log('  3. Run: ffmpeg -i Untitled-2.gif -vf "scale=iw*0.7:ih*0.7" -r 15 Untitled-2-compressed.gif\n');

console.log('Option 3: Use ImageMagick');
console.log('  1. Install ImageMagick: https://imagemagick.org/');
console.log('  2. Run: magick Untitled-2.gif -fuzz 10% -layers Optimize Untitled-2-compressed.gif\n');

console.log('For now, I recommend using ezgif.com/optimize for the fastest result.');
console.log('Target size: < 3MB for good web performance');
