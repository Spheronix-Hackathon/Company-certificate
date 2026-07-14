const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const CompanySetting = require('../models/CompanySetting');

const generatePDF = async (certificate, qrImagePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfsDir = path.join(__dirname, '..', 'pdfs');
      if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
      }

      const fileName = `${certificate.certificateId}.pdf`;
      const filePath = path.join(pdfsDir, fileName);

      // Fetch company settings for branding
      const settings = await CompanySetting.findOne();
      const companyName = settings?.companyName || 'Our Company';

      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // 1. Background / Border
      if (settings && settings.certificateBackgroundPath && fs.existsSync(settings.certificateBackgroundPath)) {
        doc.image(settings.certificateBackgroundPath, 0, 0, { width: 841.89, height: 595.28 });
      } else {
        // Fallback border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .lineWidth(10)
           .stroke(settings?.themeColor || '#3b82f6');
      }

      // 2. Header
      doc.fontSize(40).fillColor('#0f172a')
         .text('INTERNSHIP CERTIFICATE', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(16).fillColor('#64748b')
         .text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' })
         .moveDown(2);

      // 3. Body
      doc.fontSize(20).fillColor('#0f172a')
         .text('This is to certify that', { align: 'center' })
         .moveDown(0.5);

      doc.fontSize(30).fillColor(settings?.themeColor || '#3b82f6')
         .text(certificate.studentName, { align: 'center' })
         .moveDown(0.5);

      doc.fontSize(18).fillColor('#0f172a')
         .text(`from ${certificate.college}`, { align: 'center' })
         .moveDown(1);

      doc.fontSize(18)
         .text(`has successfully completed their internship as a`, { align: 'center' })
         .moveDown(0.5);

      doc.fontSize(22).fillColor('#0f172a')
         .text(certificate.internshipRole, { align: 'center' })
         .moveDown(1);

      doc.fontSize(16).fillColor('#64748b')
         .text(`Duration: ${certificate.duration}`, { align: 'center' })
         .moveDown(2);

      // 4. Footer / Signatures
      const signatureY = doc.page.height - 150;
      
      doc.fontSize(14).fillColor('#0f172a')
         .text('Date of Issue:', 100, signatureY)
         .text(new Date(certificate.issuedDate).toLocaleDateString(), 100, signatureY + 20);

      doc.text('Authorized Signatory', doc.page.width - 250, signatureY)
         .text(companyName, doc.page.width - 250, signatureY + 20);

      // 5. QR Code
      const absoluteQrPath = path.join(__dirname, '..', qrImagePath);
      if (fs.existsSync(absoluteQrPath)) {
        doc.image(absoluteQrPath, (doc.page.width / 2) - 50, doc.page.height - 180, { width: 100 });
      }

      doc.end();

      writeStream.on('finish', () => {
        resolve(`pdfs/${fileName}`);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };
