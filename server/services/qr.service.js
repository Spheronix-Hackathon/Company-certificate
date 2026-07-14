const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQR = async (certificateId, verificationUrl) => {
  try {
    const qrcodeDir = path.join(__dirname, '..', 'qrcodes');
    if (!fs.existsSync(qrcodeDir)) {
      fs.mkdirSync(qrcodeDir, { recursive: true });
    }

    const fileName = `${certificateId}.png`;
    const filePath = path.join(qrcodeDir, fileName);

    await QRCode.toFile(filePath, verificationUrl, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 300,
      margin: 2
    });

    return `qrcodes/${fileName}`; // Path to store in DB
  } catch (error) {
    console.error('QR Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = { generateQR };
