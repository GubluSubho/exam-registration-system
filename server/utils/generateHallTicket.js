const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateHallTicketPDF = async (application, res) => {
  const { student, exam, _id } = application;

  const qrData = JSON.stringify({
    applicationId: _id,
    studentId: student._id,
    examId: exam._id,
  });
  const qrImageDataUrl = await QRCode.toDataURL(qrData);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=hall-ticket-${_id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('EXAM HALL TICKET', { align: 'center' });
  doc.moveDown(1.5);

  doc.fontSize(12);
  doc.text(`Application ID: ${_id}`);
  doc.text(`Student Name: ${student.name}`);
  doc.text(`Email: ${student.email}`);
  doc.moveDown();

  doc.text(`Exam: ${exam.title}`);
  doc.text(`Subject: ${exam.subject}`);
  doc.text(`Exam Date: ${new Date(exam.examDate).toLocaleDateString()}`);
  if (application.center) {
  doc.text(`Center: ${application.center.name}`);
  doc.text(`Address: ${application.center.address}`);
}
if (application.seatNumber) {
  doc.text(`Seat Number: ${application.seatNumber}`);
}
  doc.moveDown(1.5);

  const qrBuffer = Buffer.from(qrImageDataUrl.split(',')[1], 'base64');
  doc.image(qrBuffer, { fit: [120, 120], align: 'center' });
  doc.moveDown();

  doc.fontSize(10).text(
    'Present this hall ticket along with a valid photo ID at the exam center.',
    { align: 'center' }
  );

  doc.end();
};

module.exports = generateHallTicketPDF;