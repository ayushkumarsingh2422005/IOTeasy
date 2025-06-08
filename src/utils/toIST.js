export default function toIST(date) {
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}