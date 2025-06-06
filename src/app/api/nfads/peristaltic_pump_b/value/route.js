import { connectDB } from "@/lib/db";
import NfadsPeristalticPumpB from "@/models/NfadsPeristalticPumpB";

export async function GET() {
  await connectDB();
  const data = await NfadsPeristalticPumpB.find().sort({ createdAt: -1 }).limit(50);
  return Response.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const newData = await NfadsPeristalticPumpB.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
