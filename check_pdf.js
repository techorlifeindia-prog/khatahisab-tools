const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function check() {
  const fileBytes = fs.readFileSync('C:\\Users\\victus\\Downloads\\invoice_labels_1781412069130.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pages = pdfDoc.getPages();
  console.log(`Total Pages: ${pages.length}`);
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    console.log(`Page ${index + 1}: width = ${width}, height = ${height}`);
  });
}

check().catch(console.error);
