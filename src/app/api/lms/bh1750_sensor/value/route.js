import { connectDB } from "@/lib/db";
import LmsBh1750Sensor from "@/models/LmsBh1750Sensor";

export async function GET() {
  await connectDB();
  const data = await LmsBh1750Sensor.find().sort({ createdAt: -1 }).limit(50);
  return Response.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const newData = await LmsBh1750Sensor.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
