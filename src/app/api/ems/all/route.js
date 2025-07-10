import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Ems from "@/models/Ems";

export async function GET() {
  await connectDB();
  const data = await Ems.find().sort({ createdAt: -1 }).lean();
  
  const formattedData = data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  return Response.json(formattedData);
}