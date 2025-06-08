import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import NfadsCompressorModule from "@/models/NfadsCompressorModule";
import NfadsEcSensor from "@/models/NfadsEcSensor";
import NfadsOledDisplayNfads from "@/models/NfadsOledDisplayNfads";
import NfadsPeltierModule from "@/models/NfadsPeltierModule";
import NfadsPeristalticPumpA from "@/models/NfadsPeristalticPumpA";
import NfadsPeristalticPumpB from "@/models/NfadsPeristalticPumpB";
import NfadsPeristalticPumpPhdown from "@/models/NfadsPeristalticPumpPhdown";
import NfadsPeristalticPumpPhup from "@/models/NfadsPeristalticPumpPhup";
import NfadsPhSensor from "@/models/NfadsPhSensor";
import NfadsSolenoidValve from "@/models/NfadsSolenoidValve";
import NfadsTdsSensor from "@/models/NfadsTdsSensor";
import NfadsWaterFlowMeter from "@/models/NfadsWaterFlowMeter";
import NfadsWaterPump from "@/models/NfadsWaterPump";
import NfadsWaterTemperatureSensor from "@/models/NfadsWaterTemperatureSensor";

export async function GET() {
  await connectDB();

  const compressorData = await NfadsCompressorModule.find().sort({ createdAt: -1 }).limit(50).lean();
  const ecData = await NfadsEcSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const oledData = await NfadsOledDisplayNfads.find().sort({ createdAt: -1 }).limit(50).lean();
  const peltierData = await NfadsPeltierModule.find().sort({ createdAt: -1 }).limit(50).lean();
  const peristalticPumpAData = await NfadsPeristalticPumpA.find().sort({ createdAt: -1 }).limit(50).lean();
  const peristalticPumpBData = await NfadsPeristalticPumpB.find().sort({ createdAt: -1 }).limit(50).lean();
  const peristalticPumpPhdownData = await NfadsPeristalticPumpPhdown.find().sort({ createdAt: -1 }).limit(50).lean();
  const peristalticPumpPhupData = await NfadsPeristalticPumpPhup.find().sort({ createdAt: -1 }).limit(50).lean();
  const phData = await NfadsPhSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const solenoidValveData = await NfadsSolenoidValve.find().sort({ createdAt: -1 }).limit(50).lean();
  const tdsData = await NfadsTdsSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const waterFlowData = await NfadsWaterFlowMeter.find().sort({ createdAt: -1 }).limit(50).lean();
  const waterPumpData = await NfadsWaterPump.find().sort({ createdAt: -1 }).limit(50).lean();
  const waterTempData = await NfadsWaterTemperatureSensor.find().sort({ createdAt: -1 }).limit(50).lean();

  const formatData = (data) => data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  const formattedData = {
    compressor: formatData(compressorData),
    ec: formatData(ecData),
    oled: formatData(oledData),
    peltier: formatData(peltierData),
    peristalticPumpA: formatData(peristalticPumpAData),
    peristalticPumpB: formatData(peristalticPumpBData),
    peristalticPumpPhdown: formatData(peristalticPumpPhdownData),
    peristalticPumpPhup: formatData(peristalticPumpPhupData),
    ph: formatData(phData),
    solenoidValve: formatData(solenoidValveData),
    tds: formatData(tdsData),
    waterFlow: formatData(waterFlowData),
    waterPump: formatData(waterPumpData),
    waterTemp: formatData(waterTempData)
  };

  return Response.json(formattedData);
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    await connectDB();

    const results = {};

    if (body.compressor) {
      const compressorDoc = await NfadsCompressorModule.create({ "Value": body.compressor });
      results.compressor = await NfadsCompressorModule.findById(compressorDoc._id);
    }
    if (body.ec) {
      const ecDoc = await NfadsEcSensor.create({ "Value": body.ec });
      results.ec = await NfadsEcSensor.findById(ecDoc._id);
    }
    if (body.oled) {
      const oledDoc = await NfadsOledDisplayNfads.create({ "Value": body.oled });
      results.oled = await NfadsOledDisplayNfads.findById(oledDoc._id);
    }
    if (body.peltier) {
      const peltierDoc = await NfadsPeltierModule.create({ "Value": body.peltier });
      results.peltier = await NfadsPeltierModule.findById(peltierDoc._id);
    }
    if (body.peristalticPumpA) {
      const peristalticPumpADoc = await NfadsPeristalticPumpA.create({ "Value": body.peristalticPumpA });
      results.peristalticPumpA = await NfadsPeristalticPumpA.findById(peristalticPumpADoc._id);
    }
    if (body.peristalticPumpB) {
      const peristalticPumpBDoc = await NfadsPeristalticPumpB.create({ "Value": body.peristalticPumpB });
      results.peristalticPumpB = await NfadsPeristalticPumpB.findById(peristalticPumpBDoc._id);
    }
    if (body.peristalticPumpPhdown) {
      const peristalticPumpPhdownDoc = await NfadsPeristalticPumpPhdown.create({ "Value": body.peristalticPumpPhdown });
      results.peristalticPumpPhdown = await NfadsPeristalticPumpPhdown.findById(peristalticPumpPhdownDoc._id);
    }
    if (body.peristalticPumpPhup) {
      const peristalticPumpPhupDoc = await NfadsPeristalticPumpPhup.create({ "Value": body.peristalticPumpPhup });
      results.peristalticPumpPhup = await NfadsPeristalticPumpPhup.findById(peristalticPumpPhupDoc._id);
    }
    if (body.ph) {
      const phDoc = await NfadsPhSensor.create({ "Value": body.ph });
      results.ph = await NfadsPhSensor.findById(phDoc._id);
    }
    if (body.solenoidValve) {
      const solenoidValveDoc = await NfadsSolenoidValve.create({ "Value": body.solenoidValve });
      results.solenoidValve = await NfadsSolenoidValve.findById(solenoidValveDoc._id);
    }
    if (body.tds) {
      const tdsDoc = await NfadsTdsSensor.create({ "Value": body.tds });
      results.tds = await NfadsTdsSensor.findById(tdsDoc._id);
    }
    if (body.waterFlow) {
      const waterFlowDoc = await NfadsWaterFlowMeter.create({ "Value": body.waterFlow });
      results.waterFlow = await NfadsWaterFlowMeter.findById(waterFlowDoc._id);
    }
    if (body.waterPump) {
      const waterPumpDoc = await NfadsWaterPump.create({ "Value": body.waterPump });
      results.waterPump = await NfadsWaterPump.findById(waterPumpDoc._id);
    }
    if (body.waterTemp) {
      const waterTempDoc = await NfadsWaterTemperatureSensor.create({ "Value": body.waterTemp });
      results.waterTemp = await NfadsWaterTemperatureSensor.findById(waterTempDoc._id);
    }

    return Response.json(results, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
