export default function convertUTCtoIST(utcDate) {
  // IST is UTC + 5:30, so add 5.5 hours
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  return istDate;
}
