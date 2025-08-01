import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Nfads from "@/models/Nfads";
import convertISTtoUTC from "@/utils/convertISTtoUTC";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  let startDate = searchParams.get('startDate');
  let endDate = searchParams.get('endDate');

  if (startDate) startDate = convertISTtoUTC(startDate);
  if (endDate) endDate = convertISTtoUTC(endDate);
  console.log(startDate, endDate);

  // Build query based on date range
  let query = {};
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Get all data within the time range
  const allData = await Nfads.find(query).sort({ createdAt: 1 }).lean();
  
  let processedData = allData;

  // If we have more than 50 data points, aggregate them
  if (allData.length > 50) {
    const groupSize = Math.ceil(allData.length / 50);
    processedData = [];

    for (let i = 0; i < allData.length; i += groupSize) {
      const group = allData.slice(i, i + groupSize);
      const aggregatedPoint = {};

      // For each field, aggregate based on type
      Object.keys(group[0]).forEach(field => {
        if (field === '_id' || field === '__v') return;

        if (field === 'createdAt' || field === 'updatedAt') {
          // Take the first timestamp from the group
          aggregatedPoint[field] = group[0][field];
        } else if (typeof group[0][field] === 'boolean') {
          // For boolean fields, take the first value
          aggregatedPoint[field] = group[0][field];
        } else if (typeof group[0][field] === 'number') {
          // For numeric fields, calculate average
          const values = group.map(item => item[field]).filter(val => val !== null && val !== undefined);
          aggregatedPoint[field] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
        } else {
          // For other types, take the first value
          aggregatedPoint[field] = group[0][field];
        }
      });

      processedData.push(aggregatedPoint);
    }

    // Ensure we have exactly 50 points
    if (processedData.length > 50) {
      processedData = processedData.slice(0, 50);
    }
  } else if (allData.length === 0) {
    // Return empty array if no data found
    return Response.json([]);
  }

  // Format the data with IST timestamps
  const formattedData = processedData.map(doc => ({
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
