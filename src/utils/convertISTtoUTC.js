export default function convertISTtoUTC(istDate) {
  const utcDate = new Date(istDate);
  utcDate.setHours(utcDate.getHours() - 5.5);
  return utcDate.toISOString();
}
