// Placeholder for Email Service

const sendCertificateEmail = async (studentEmail, certificateData, pdfUrl) => {
  console.log(`Simulating sending email to ${studentEmail} with PDF ${pdfUrl}`);
  // In a real app, use Nodemailer + SendGrid/AWS SES
  return true;
};

module.exports = { sendCertificateEmail };
