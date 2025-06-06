import { connectDB } from "@/lib/db";
import NfadsWaterTemperatureSensor from "@/models/NfadsWaterTemperatureSensor";

export async function GET() {
  await connectDB();
  const data = await NfadsWaterTemperatureSensor.find().sort({ createdAt: -1 }).limit(50);
  return Response.json(data);
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
