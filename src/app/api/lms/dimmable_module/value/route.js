import { connectDB } from "@/lib/db";
import LmsDimmableModule from "@/models/LmsDimmableModule";

export async function GET() {
  await connectDB();
  const data = await LmsDimmableModule.find().sort({ createdAt: -1 }).limit(50);
  return Response.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const newData = await LmsDimmableModule.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
