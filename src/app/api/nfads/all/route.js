import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Nfads from "@/models/Nfads";

export async function GET() {
  await connectDB();
  const data = await Nfads.find().sort({ createdAt: -1 }).lean();
  
  const formattedData = data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  return Response.json(formattedData);
}