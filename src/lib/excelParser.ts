import ExcelJS from 'exceljs';

export async function parseExcelPreview(excelUrl: string) {
  try {
    const response = await fetch(excelUrl);
    const buffer = await response.arrayBuffer();
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    
    const worksheet = workbook.worksheets[0];
    const headers = worksheet.getRow(1).values as string[];
    const rows: any[][] = [];
    
    // Get first 5 rows of data
    for(let i = 2; i <= 6; i++) {
      const rowValues = worksheet.getRow(i).values;
      if(rowValues && Array.isArray(rowValues)) rows.push(Array.from(rowValues));
    }
    
    return {
      headers: headers.slice(1), // Remove the first empty cell
      rows
    };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return null;
  }
} 