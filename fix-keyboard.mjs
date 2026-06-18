import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find <input type="text" ... where it binds to specific numeric states
  // We can just look for onChange={e=>set...(e.target.value.replace(/\D/g, ''))} 
  // and for RT/RW fields and NOP fields.
  
  // It's safer to just replace specific patterns.
  // Let's add inputMode="numeric" pattern="[0-9]*" after type="text"
  
  const targetStates = [
    'nopTetKec', 'nopTetKel', 'nopTetBlok', 'nopTetUrut', 'nopTetJenis',
    'nopAsalKec', 'nopAsalKel', 'nopAsalBlok', 'nopAsalUrut', 'nopAsalJenis',
    'nopKec', 'nopKel', 'nopBlok', 'nopUrut', 'nopJenis',
    'nopDoubleKec', 'nopDoubleKel', 'nopDoubleBlok', 'nopDoubleUrut', 'nopDoubleJenis',
    'noKtp', 'npwp', 'noHp', 'telepon',
    'rtRwWp', 'rtRwOp', 'tahunDibangun', 'luasBangunan', 'jumlahLantai'
  ];

  // A simple way is to replace `<input type="text"` with `<input type="text" inputMode="numeric" pattern="[0-9]*"`
  // BUT only on the lines that contain the target states.
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('<input') && line.includes('type="text"')) {
      const hasTarget = targetStates.some(state => line.includes(`set${state.charAt(0).toUpperCase() + state.slice(1)}`) || line.includes(`value={${state}`) || (state.startsWith('rtRw') && line.includes(state)));
      if (hasTarget && !line.includes('inputMode="numeric"')) {
        return line.replace('type="text"', 'type="text" inputMode="numeric" pattern="[0-9]*"');
      }
    }
    return line;
  });
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`Fixed ${filePath}`);
}

const basePath = 'C:/Users/msyaf/.gemini/antigravity/scratch/data-entry-app/src/app/dashboard';
fixFile(path.join(basePath, 'spop/page.tsx'));
fixFile(path.join(basePath, 'lspop/page.tsx'));
