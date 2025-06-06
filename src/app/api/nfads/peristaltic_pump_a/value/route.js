﻿import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import NfadsPeristalticPumpA from "@/models/NfadsPeristalticPumpA";

export async function GET() {
  await connectDB();
  const data = await NfadsPeristalticPumpA.find().sort({ createdAt: -1 }).limit(50).lean();
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
    const newData = await NfadsPeristalticPumpA.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
