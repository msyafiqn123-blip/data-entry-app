const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\msyaf\\Downloads\\DHKP 17-6-26.xlsx';
const outputDir = path.join(__dirname, '..', 'data', 'dhkp');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Reading Excel file (this might take a few seconds)...");
try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  console.log("Converting to JSON...");
  // Read data as array of objects
  const data = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`Total rows read: ${data.length}`);
  
  const groupedData = {};
  
  // Group by nm_kelurahan
  data.forEach((row) => {
    let kelurahan = row['nm_kelurahan'];
    if (!kelurahan) return;
    kelurahan = String(kelurahan).trim().toUpperCase();
    
    if (!groupedData[kelurahan]) {
      groupedData[kelurahan] = [];
    }
    groupedData[kelurahan].push({
      nop: row['nop'] || "",
      nm_wp: row['nm_wp'] || "",
      alamat_op: row['alamat_op'] || "",
      luas_bumi: row['luas_bumi_sppt'] || 0,
      luas_bng: row['luas_bng_sppt'] || 0,
      pbb_harus_dibayar: row['pbb_yg_harus_dibayar_sppt'] || 0,
      status_pembayaran: row['status_pembayaran_sppt'] || ""
    });
  });

  // Save to JSON files
  console.log(`Found ${Object.keys(groupedData).length} unique kelurahans. Writing files...`);
  for (const kelurahan in groupedData) {
    // Sanitize filename
    const safeFilename = kelurahan.replace(/[^a-z0-9]/gi, '_').toUpperCase() + '.json';
    const outPath = path.join(outputDir, safeFilename);
    fs.writeFileSync(outPath, JSON.stringify(groupedData[kelurahan]));
  }
  
  // Create a summary file
  const summaryList = Object.keys(groupedData).map(k => ({
    nama: k,
    count: groupedData[k].length,
    filename: k.replace(/[^a-z0-9]/gi, '_').toUpperCase() + '.json'
  })).sort((a,b) => a.nama.localeCompare(b.nama));
  
  fs.writeFileSync(path.join(outputDir, '_summary.json'), JSON.stringify(summaryList, null, 2));

  console.log("Successfully split DHKP data by kelurahan!");
} catch (e) {
  console.error("Error splitting file:", e.message);
}
