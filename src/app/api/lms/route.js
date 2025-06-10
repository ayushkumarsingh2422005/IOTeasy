import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Lms from "@/models/Lms";

export async function GET() {
  await connectDB();
  const data = await Lms.find().sort({ createdAt: -1 }).limit(50).lean();
  
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
      'as7265x',
      'bh1750',
      'growLights',
      'ldr',
      'tsl2591',
      'dimmable', 
      'oled'
    ];

    validFields.forEach(field => {
      if (body[field] !== undefined) {
        newData[field] = body[field];
      }
    });

    const doc = await Lms.create(newData);
    const result = await Lms.findById(doc._id);

    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
