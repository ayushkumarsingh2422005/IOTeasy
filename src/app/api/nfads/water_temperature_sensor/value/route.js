import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import NfadsWaterTemperatureSensor from "@/models/NfadsWaterTemperatureSensor";

export async function GET() {
  await connectDB();
  const data = await NfadsWaterTemperatureSensor.find().sort({ createdAt: -1 }).limit(50).lean();
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
    console.log(body)
    await connectDB();
    const newData = await NfadsWaterTemperatureSensor.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
