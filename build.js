const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Building portfolio for production...');

// 1. Ensure dist exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// 2. Copy index.html
fs.copyFileSync('index.html', path.join('dist', 'index.html'));
console.log('✓ Copied index.html -> dist/index.html');

// 3. Copy css, JS, img folders
['css', 'JS', 'img'].forEach(folder => {
  if (fs.existsSync(folder)) {
    copyDirRecursive(folder, path.join('dist', folder));
    console.log(`✓ Copied ${folder}/ -> dist/${folder}/`);
  }
});

console.log('Build complete! All files synchronized to dist/.');
