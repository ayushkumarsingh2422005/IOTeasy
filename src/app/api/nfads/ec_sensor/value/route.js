import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import NfadsEcSensor from "@/models/NfadsEcSensor";

export async function GET() {
  await connectDB();
  const data = await NfadsEcSensor.find().sort({ createdAt: -1 }).limit(50).lean();
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
    const newData = await NfadsEcSensor.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
