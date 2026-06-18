const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\msyaf\\Downloads\\DHKP 17-6-26.xlsx';
try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log("Sheet Name:", sheetName);
  console.log("Total rows:", data.length);
} catch (e) {
  console.error("Error reading file:", e.message);
}
