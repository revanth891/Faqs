/**
 * GIF to WebP/MP4 Converter
 * Since GIF compression is difficult without specialized tools,
 * we can convert to more efficient formats
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const inputGif = path.join(__dirname, '..', 'public', 'Mascot', 'Untitled-2.gif');
const outputWebP = path.join(__dirname, '..', 'public', 'Mascot', 'Untitled-2.webp');

async function convertToWebP() {
    console.log('Attempting to convert GIF to WebP using FFmpeg...\n');

    try {
        // Check if ffmpeg is available
        await execPromise('ffmpeg -version');
        console.log('✓ FFmpeg found!\n');

        // Convert GIF to WebP (much smaller file size)
        const command = `ffmpeg -i "${inputGif}" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 75 -loop 0 -preset default -an -vsync 0 "${outputWebP}"`;

        console.log('Converting...');
        await execPromise(command);

        const stats = fs.statSync(outputWebP);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        console.log(`\n✅ Success! WebP created: ${sizeMB} MB`);
        console.log(`Saved to: ${outputWebP}`);
        console.log('\nUpdate your code to use .webp instead of .gif');

    } catch (error) {
        console.log('❌ FFmpeg not found or conversion failed\n');
        console.log('Please use one of these methods to compress your GIF:\n');
        console.log('1. Online Tool (Easiest):');
        console.log('   → https://ezgif.com/optimize');
        console.log('   → Upload your GIF, use "Lossy GIF" compression level 100-150');
        console.log('   → Should reduce to 2-4 MB\n');

        console.log('2. Install FFmpeg:');
        console.log('   → Download: https://www.gyan.dev/ffmpeg/builds/');
        console.log('   → Extract and add to PATH');
        console.log('   → Run this script again\n');

        console.log('3. Convert to MP4 (even smaller):');
        console.log('   → Use ezgif.com/gif-to-mp4');
        console.log('   → MP4 will be much smaller than GIF\n');
    }
}

// Check file size
const stats = fs.statSync(inputGif);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`Current GIF size: ${sizeMB} MB`);
console.log(`Target: < 3 MB\n`);

convertToWebP();
