const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INDEX_HTML = 'src/index.html';
const OUTPUT_HTML = 'dist/sdk-akademie/index.html';

function inlineCriticalCSS() {
  try {
    console.log('🎨 Inlining critical CSS...');
    
    // Check if critical package is installed
    try {
      execSync('npx critical --version', { stdio: 'ignore' });
    } catch {
      console.log('📦 Installing critical package...');
      execSync('npm install --save-dev critical', { stdio: 'inherit' });
    }
    
    // Inline critical CSS
    execSync(`npx critical ${INDEX_HTML} --base src --inline --target dist/sdk-akademie/index.html`, { 
      stdio: 'inherit' 
    });
    
    console.log('✅ Critical CSS inlined successfully!');
    
  } catch (error) {
    console.error('❌ Error inlining critical CSS:', error.message);
  }
}

inlineCriticalCSS();