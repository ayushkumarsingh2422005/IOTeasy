import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Lms from "@/models/Lms";

export async function GET() {
  try {
    await connectDB();
    
    // Get the most recent entry
    const data = await Lms.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!data) {
      return Response.json({ error: "No data found" }, { status: 404 });
    }

    // Format the timestamps
    const formattedData = {
      ...data,
      createdAtIST: toIST(data.createdAt),
      updatedAtIST: toIST(data.updatedAt),
    };

    return Response.json(formattedData);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
} 