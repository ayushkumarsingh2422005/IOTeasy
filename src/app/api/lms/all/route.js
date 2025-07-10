import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Lms from "@/models/Lms";

export async function GET() {
  await connectDB();
  const data = await Lms.find().sort({ createdAt: -1 }).lean();
  
  const formattedData = data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  return Response.json(formattedData);
}