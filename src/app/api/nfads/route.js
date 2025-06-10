import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Nfads from "@/models/Nfads";

export async function GET() {
  await connectDB();
  const data = await Nfads.find().sort({ createdAt: -1 }).limit(50).lean();
  
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
    console.log(body);
    await connectDB();

    // Create a new document with only the fields that are present in the request
    const newData = {};
    const validFields = [
      'compressor',
      'ec',
      'oled',
      'peltier',
      'peristalticPumpA',
      'peristalticPumpB',
      'peristalticPumpPhdown',
      'peristalticPumpPhup',
      'ph',
      'solenoidValve',
      'tds',
      'waterFlow',
      'waterPump',
      'waterTemp'
    ];

    validFields.forEach(field => {
      if (body[field] !== undefined) {
        newData[field] = body[field];
      }
    });

    const doc = await Nfads.create(newData);
    const result = await Nfads.findById(doc._id);

    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
