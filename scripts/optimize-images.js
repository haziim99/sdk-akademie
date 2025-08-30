const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_DIR = 'src/assets/images';
const OUTPUT_DIR = 'src/assets/images/optimized';

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Get all image files
    const files = await fs.readdir(IMAGE_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file) && 
      !file.includes('optimized') &&
      !file.includes('webp')
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(IMAGE_DIR, file);
      const fileName = path.parse(file).name;
      
      try {
        // Convert to WebP with quality 80
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(path.join(OUTPUT_DIR, `${fileName}.webp`));
        
        // Create responsive sizes
        const sizes = [300, 600, 1200];
        for (const size of sizes) {
          await sharp(inputPath)
            .resize(size, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(OUTPUT_DIR, `${fileName}-${size}.webp`));
        }
        
        console.log(`✅ Optimized: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error.message);
      }
    }
    
    console.log('\n🎉 Image optimization complete!');
    console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

optimizeImages();
