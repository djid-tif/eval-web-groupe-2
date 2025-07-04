const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src', 'proto');
const dest = path.join(__dirname, 'dist', 'proto');

function copyRecursive(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyRecursive(src, dest);
console.log('✅ Proto files copied to dist/proto');
