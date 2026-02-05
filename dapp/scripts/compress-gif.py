"""
GIF Compression Script
Compresses a GIF file by reducing colors, resizing, and optimizing frames
"""
from PIL import Image, ImageSequence
import os

def compress_gif(input_path, output_path, resize_factor=0.8, max_colors=128, quality=85):
    """
    Compress a GIF file
    
    Args:
        input_path: Path to input GIF
        output_path: Path to save compressed GIF
        resize_factor: Factor to resize (0.8 = 80% of original size)
        max_colors: Maximum number of colors (lower = smaller file)
        quality: Quality setting (1-100)
    """
    print(f"Opening {input_path}...")
    img = Image.open(input_path)
    
    # Get original info
    original_size = os.path.getsize(input_path)
    print(f"Original size: {original_size / (1024*1024):.2f} MB")
    
    frames = []
    durations = []
    
    # Process each frame
    for i, frame in enumerate(ImageSequence.Iterator(img)):
        print(f"Processing frame {i+1}...", end='\r')
        
        # Convert to RGB then back to P mode with reduced colors
        frame = frame.convert('RGB')
        
        # Resize frame
        new_size = (int(frame.width * resize_factor), int(frame.height * resize_factor))
        frame = frame.resize(new_size, Image.Resampling.LANCZOS)
        
        # Convert to palette mode with reduced colors
        frame = frame.convert('P', palette=Image.ADAPTIVE, colors=max_colors)
        
        frames.append(frame)
        
        # Get duration
        try:
            durations.append(img.info.get('duration', 100))
        except:
            durations.append(100)
    
    print(f"\nProcessed {len(frames)} frames")
    
    # Save compressed GIF
    print(f"Saving to {output_path}...")
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
        quality=quality
    )
    
    # Get new size
    new_size = os.path.getsize(output_path)
    print(f"Compressed size: {new_size / (1024*1024):.2f} MB")
    print(f"Reduction: {((original_size - new_size) / original_size * 100):.1f}%")
    
    return new_size

if __name__ == "__main__":
    input_file = r"d:\hackmoney\dapp\public\Mascot\Untitled-2.gif"
    output_file = r"d:\hackmoney\dapp\public\Mascot\Untitled-2-compressed.gif"
    
    # Try aggressive compression first
    print("=== Attempting aggressive compression ===")
    compress_gif(
        input_file, 
        output_file,
        resize_factor=0.7,  # 70% of original size
        max_colors=64,       # Reduced color palette
        quality=75
    )
    
    print("\n✅ Compression complete!")
    print(f"Compressed file saved to: {output_file}")
