import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const before = content;
      content = content.replace(/<th>NIP<\/th>/g, '<th>Petugas Pendata</th>');
      content = content.replace(/>NIP</g, '>Petugas Pendata<');
      
      if (content !== before) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in: ${fullPath}`);
      }
    }
  }
}

replaceInDir('./src');
