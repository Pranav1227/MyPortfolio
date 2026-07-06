const { Jimp } = require('jimp');
const path = require('path');

async function processImage() {
  const imgPath = path.join(__dirname, '../img/pb-high-resolution-logo-transparent.png');
  const outPath = path.join(__dirname, '../img/pb-high-resolution-logo-transparent.png');

  try {
    const image = await Jimp.read(imgPath);
    
    // We want to turn "PB" (black) into white, but keep the red half circle (red).
    // Black pixels will have low R, G, B values.
    // Red pixels will have high R, low G, low B values.
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];

      if (a > 0) { // Only process non-transparent pixels
        // If it's a dark color (like black text), make it white
        // We use a threshold for "darkness"
        if (r < 100 && g < 100 && b < 100) {
          // It's part of the PB black text (or anti-aliased edge)
          // We can invert it to make it white (255)
          this.bitmap.data[idx + 0] = 255;
          this.bitmap.data[idx + 1] = 255;
          this.bitmap.data[idx + 2] = 255;
        } else if (r > 150 && g < 100 && b < 100) {
          // It's the red circle, do nothing to preserve it perfectly
        } else {
          // If it's some intermediate gray from anti-aliasing of the text,
          // We should lighten it to blend with white
          if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
            // It's a grayscale pixel (anti-aliasing of black text)
            // Make it white, but preserve alpha, or adjust alpha?
            // Actually, for a black pixel transitioning to transparent, the RGB is usually black and Alpha fades.
            // If the RGB is gray, we should make it white.
            this.bitmap.data[idx + 0] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
          }
        }
      }
    });

    await image.writeAsync(outPath);
    console.log('Image processed successfully!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
