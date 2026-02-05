@echo off
echo ================================================
echo GIF Compression Script
echo ================================================
echo.
echo Current file: public\Mascot\Untitled-2.gif
echo Current size: ~24 MB
echo.
echo Since compression tools are not installed, here are your options:
echo.
echo OPTION 1 (Recommended - Fast):
echo   1. Visit https://ezgif.com/optimize
echo   2. Upload: public\Mascot\Untitled-2.gif
echo   3. Use "Lossy GIF" with compression level 100
echo   4. Download and save as: public\Mascot\Untitled-2-compressed.gif
echo   5. Expected result: 2-4 MB
echo.
echo OPTION 2 (Alternative):
echo   1. Visit https://www.iloveimg.com/compress-image/compress-gif
echo   2. Upload and compress
echo   3. Download result
echo.
echo OPTION 3 (Install FFmpeg):
echo   1. Download from: https://www.gyan.dev/ffmpeg/builds/
echo   2. Extract and add to PATH
echo   3. Run: ffmpeg -i public\Mascot\Untitled-2.gif -vf "scale=iw*0.6:ih*0.6,fps=15" -loop 0 public\Mascot\Untitled-2-compressed.gif
echo.
echo After compressing, update the code to use the compressed version.
echo.
pause
