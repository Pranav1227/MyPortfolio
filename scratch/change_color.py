import sys
from PIL import Image

def process_image():
    input_path = r'c:\Projects\MERN\MyPortfolio\img\pb-high-resolution-logo-transparent.png'
    output_path = r'c:\Projects\MERN\MyPortfolio\img\pb-high-resolution-logo-transparent.png'
    
    img = Image.open(input_path).convert('RGBA')
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # If pixel is transparent, keep it as is
        if a == 0:
            new_data.append(item)
            continue
            
        # We want to change the dark/black text ("PB") to white
        # Black pixels have low RGB values.
        # Red pixels have high R, low G, low B.
        
        # If it's a dark color (R, G, and B are all < 100)
        if r < 100 and g < 100 and b < 100:
            # Change to white, preserve alpha
            new_data.append((255, 255, 255, a))
        # If it's grayish (difference between RGB is small), turn it white (handles anti-aliased black edges)
        elif abs(r - g) < 20 and abs(g - b) < 20 and r < 200:
            new_data.append((255, 255, 255, a))
        else:
            # Must be the red circle (or already white), preserve original
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path)
    print("Successfully processed the image!")

if __name__ == '__main__':
    process_image()
