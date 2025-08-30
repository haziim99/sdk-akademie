const fs = require('fs');
const path = require('path');

const STATS_FILE = 'dist/sdk-akademie/stats.json';

function analyzeBundle() {
  try {
    if (!fs.existsSync(STATS_FILE)) {
      console.log('❌ Stats file not found. Please run "ng build" first.');
      return;
    }

    const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    
    console.log('📊 Bundle Analysis Report\n');
    
    // Analyze chunks
    if (stats.chunks) {
      console.log('📦 Chunk Analysis:');
      stats.chunks.forEach((chunk, index) => {
        const size = (chunk.size / 1024 / 1024).toFixed(2);
        console.log(`  Chunk ${index}: ${size} MB`);
        
        if (chunk.modules) {
          chunk.modules.forEach(module => {
            const moduleSize = (module.size / 1024).toFixed(2);
            console.log(`    └─ ${module.name}: ${moduleSize} KB`);
          });
        }
      });
    }
    
    // Analyze assets
    if (stats.assets) {
      console.log('\n📁 Asset Analysis:');
      const largeAssets = stats.assets
        .filter(asset => asset.size > 100 * 1024) // > 100KB
        .sort((a, b) => b.size - a.size);
      
      largeAssets.forEach(asset => {
        const size = (asset.size / 1024 / 1024).toFixed(2);
        console.log(`  ${asset.name}: ${size} MB`);
      });
    }
    
    // Bundle size recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('  1. Use lazy loading for feature modules');
    console.log('  2. Convert large images to WebP format');
    console.log('  3. Remove unused dependencies');
    console.log('  4. Enable tree-shaking for libraries');
    console.log('  5. Use dynamic imports for heavy libraries');
    
  } catch (error) {
    console.error('Error analyzing bundle:', error);
  }
}

analyzeBundle();