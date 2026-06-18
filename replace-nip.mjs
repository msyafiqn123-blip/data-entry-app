import fs from 'fs';
import path from 'path';

function replaceInDir(dir, searchStr, replaceStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath, searchStr, replaceStr);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We will replace variations:
      // "NIP Pendata" -> "Petugas Pendata"
      // "NIP PENDATA" -> "PETUGAS PENDATA"
      // "nip pendata" -> "petugas pendata"
      
      const before = content;
      content = content.replace(/NIP Pendata/g, replaceStr);
      content = content.replace(/NIP PENDATA/g, replaceStr.toUpperCase());
      content = content.replace(/nip pendata/g, replaceStr.toLowerCase());
      
      // Let's also check for just "NIP" if it's related to Pendata...
      // Usually it's written as "NIP Pendata". Let's stick to that first.
      
      if (content !== before) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in: ${fullPath}`);
      }
    }
  }
}

replaceInDir('./src', 'NIP Pendata', 'Petugas Pendata');
