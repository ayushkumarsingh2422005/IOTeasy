export default function convertISTtoUTC(istDate) {
  // IST is UTC + 5:30, so subtract 5.5 hours
  const utcDate = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000));
  return utcDate;
}
