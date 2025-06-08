import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import EmsCarbonDioxideSensor from "@/models/EmsCarbonDioxideSensor";
import EmsDht22Moisture from "@/models/EmsDht22Moisture";
import EmsDht22Temp from "@/models/EmsDht22Temp";
import EmsDiaphragmPump from "@/models/EmsDiaphragmPump";
import EmsExhaustFan from "@/models/EmsExhaustFan";
import EmsIndoorCoolingSystem from "@/models/EmsIndoorCoolingSystem";
import EmsOledModuleEms from "@/models/EmsOledModuleEms";
import EmsOxygenSensor from "@/models/EmsOxygenSensor";
import EmsPressureSensor from "@/models/EmsPressureSensor";

export async function GET() {
  await connectDB();

  const carbonDioxideData = await EmsCarbonDioxideSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const dht22MoistureData = await EmsDht22Moisture.find().sort({ createdAt: -1 }).limit(50).lean();
  const dht22TempData = await EmsDht22Temp.find().sort({ createdAt: -1 }).limit(50).lean();
  const diaphragmPumpData = await EmsDiaphragmPump.find().sort({ createdAt: -1 }).limit(50).lean();
  const exhaustFanData = await EmsExhaustFan.find().sort({ createdAt: -1 }).limit(50).lean();
  const indoorCoolingData = await EmsIndoorCoolingSystem.find().sort({ createdAt: -1 }).limit(50).lean();
  const oledData = await EmsOledModuleEms.find().sort({ createdAt: -1 }).limit(50).lean();
  const oxygenData = await EmsOxygenSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const pressureData = await EmsPressureSensor.find().sort({ createdAt: -1 }).limit(50).lean();

  const formatData = (data) => data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  const formattedData = {
    carbonDioxide: formatData(carbonDioxideData),
    dht22Moisture: formatData(dht22MoistureData),
    dht22Temp: formatData(dht22TempData),
    diaphragmPump: formatData(diaphragmPumpData),
    exhaustFan: formatData(exhaustFanData),
    indoorCooling: formatData(indoorCoolingData),
    oled: formatData(oledData),
    oxygen: formatData(oxygenData),
    pressure: formatData(pressureData)
  };

  return Response.json(formattedData);
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    await connectDB();

    const results = {};

    if (body.carbonDioxide) {
      const carbonDioxideDoc = await EmsCarbonDioxideSensor.create({ "Value": body.carbonDioxide });
      results.carbonDioxide = await EmsCarbonDioxideSensor.findById(carbonDioxideDoc._id);
    }
    if (body.dht22Moisture) {
      const dht22MoistureDoc = await EmsDht22Moisture.create({ "Value": body.dht22Moisture });
      results.dht22Moisture = await EmsDht22Moisture.findById(dht22MoistureDoc._id);
    }
    if (body.dht22Temp) {
      const dht22TempDoc = await EmsDht22Temp.create({ "Value": body.dht22Temp });
      results.dht22Temp = await EmsDht22Temp.findById(dht22TempDoc._id);
    }
    if (body.diaphragmPump) {
      const diaphragmPumpDoc = await EmsDiaphragmPump.create({ "Value": body.diaphragmPump });
      results.diaphragmPump = await EmsDiaphragmPump.findById(diaphragmPumpDoc._id);
    }
    if (body.exhaustFan) {
      const exhaustFanDoc = await EmsExhaustFan.create({ "Value": body.exhaustFan });
      results.exhaustFan = await EmsExhaustFan.findById(exhaustFanDoc._id);
    }
    if (body.indoorCooling) {
      const indoorCoolingDoc = await EmsIndoorCoolingSystem.create({ "Value": body.indoorCooling });
      results.indoorCooling = await EmsIndoorCoolingSystem.findById(indoorCoolingDoc._id);
    }
    if (body.oled) {
      const oledDoc = await EmsOledModuleEms.create({ "Value": body.oled });
      results.oled = await EmsOledModuleEms.findById(oledDoc._id);
    }
    if (body.oxygen) {
      const oxygenDoc = await EmsOxygenSensor.create({ "Value": body.oxygen });
      results.oxygen = await EmsOxygenSensor.findById(oxygenDoc._id);
    }
    if (body.pressure) {
      const pressureDoc = await EmsPressureSensor.create({ "Value": body.pressure });
      results.pressure = await EmsPressureSensor.findById(pressureDoc._id);
    }

    return Response.json(results, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
