const calculateGrade = (marksObtained, maxMarks) => {
  const percentage = (marksObtained / maxMarks) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

const PASS_PERCENTAGE = 40;

const calculatePassStatus = (marksObtained, maxMarks) => {
  const percentage = (marksObtained / maxMarks) * 100;
  return percentage >= PASS_PERCENTAGE ? 'pass' : 'fail';
};

module.exports = { calculateGrade, calculatePassStatus };