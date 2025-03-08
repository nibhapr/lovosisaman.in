import * as XLSX from 'xlsx';

export async function parseExcelPreview(excelUrl: string) {
  try {
    // Handle remote URLs only
    const response = await fetch(excelUrl);
    const buffer = await response.arrayBuffer();
    
    const workbook = XLSX.read(buffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    return {
      headers: data[0],
      rows: data.slice(1, 6) // Get first 5 rows for preview
    };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return null;
  }
} 