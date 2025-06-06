import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import LmsTsl2591Sensor from "@/models/LmsTsl2591Sensor";

export async function GET() {
  await connectDB();
  const data = await LmsTsl2591Sensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const formattedData = data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  return Response.json(formattedData);
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const newData = await LmsTsl2591Sensor.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
