const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = [...walkDir('src'), ...walkDir('server')];
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove console.log(...) and console.error(...)
    content = content.replace(/console\.(log|error|warn)\([^)]*\);?/g, '');
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Consoles removed');
