import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import LmsAs7265x from "@/models/LmsAs7265x";
import LmsBh1750Sensor from "@/models/LmsBh1750Sensor";
import LmsDimmableModule from "@/models/LmsDimmableModule";
import LmsGrowLightsA from "@/models/LmsGrowLightsA";
import LmsGrowLightsB from "@/models/LmsGrowLightsB";
import LmsGrowLightsC from "@/models/LmsGrowLightsC";
import LmsLdrSensor from "@/models/LmsLdrSensor";
import LmsOledModuleLms from "@/models/LmsOledModuleLms";
import LmsTsl2591Sensor from "@/models/LmsTsl2591Sensor";

export async function GET() {
  await connectDB();

  const as7265xData = await LmsAs7265x.find().sort({ createdAt: -1 }).limit(50).lean();
  const bh1750Data = await LmsBh1750Sensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const dimmableData = await LmsDimmableModule.find().sort({ createdAt: -1 }).limit(50).lean();
  const growLightsAData = await LmsGrowLightsA.find().sort({ createdAt: -1 }).limit(50).lean();
  const growLightsBData = await LmsGrowLightsB.find().sort({ createdAt: -1 }).limit(50).lean();
  const growLightsCData = await LmsGrowLightsC.find().sort({ createdAt: -1 }).limit(50).lean();
  const ldrData = await LmsLdrSensor.find().sort({ createdAt: -1 }).limit(50).lean();
  const oledData = await LmsOledModuleLms.find().sort({ createdAt: -1 }).limit(50).lean();
  const tsl2591Data = await LmsTsl2591Sensor.find().sort({ createdAt: -1 }).limit(50).lean();

  const formatData = (data) => data.map(doc => ({
    ...doc,
    createdAtIST: toIST(doc.createdAt),
    updatedAtIST: toIST(doc.updatedAt),
  }));

  const formattedData = {
    as7265x: formatData(as7265xData),
    bh1750: formatData(bh1750Data),
    dimmable: formatData(dimmableData),
    growLightsA: formatData(growLightsAData),
    growLightsB: formatData(growLightsBData),
    growLightsC: formatData(growLightsCData),
    ldr: formatData(ldrData),
    oled: formatData(oledData),
    tsl2591: formatData(tsl2591Data)
  };

  return Response.json(formattedData);
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    await connectDB();

    const results = {};

    if (body.as7265x) {
      const as7265xDoc = await LmsAs7265x.create({ "Value": body.as7265x });
      results.as7265x = await LmsAs7265x.findById(as7265xDoc._id);
    }
    if (body.bh1750) {
      const bh1750Doc = await LmsBh1750Sensor.create({ "Value": body.bh1750 });
      results.bh1750 = await LmsBh1750Sensor.findById(bh1750Doc._id);
    }
    if (body.dimmable) {
      const dimmableDoc = await LmsDimmableModule.create({ "Value": body.dimmable });
      results.dimmable = await LmsDimmableModule.findById(dimmableDoc._id);
    }
    if (body.growLightsA) {
      const growLightsADoc = await LmsGrowLightsA.create({ "Value": body.growLightsA });
      results.growLightsA = await LmsGrowLightsA.findById(growLightsADoc._id);
    }
    if (body.growLightsB) {
      const growLightsBDoc = await LmsGrowLightsB.create({ "Value": body.growLightsB });
      results.growLightsB = await LmsGrowLightsB.findById(growLightsBDoc._id);
    }
    if (body.growLightsC) {
      const growLightsCDoc = await LmsGrowLightsC.create({ "Value": body.growLightsC });
      results.growLightsC = await LmsGrowLightsC.findById(growLightsCDoc._id);
    }
    if (body.ldr) {
      const ldrDoc = await LmsLdrSensor.create({ "Value": body.ldr });
      results.ldr = await LmsLdrSensor.findById(ldrDoc._id);
    }
    if (body.oled) {
      const oledDoc = await LmsOledModuleLms.create({ "Value": body.oled });
      results.oled = await LmsOledModuleLms.findById(oledDoc._id);
    }
    if (body.tsl2591) {
      const tsl2591Doc = await LmsTsl2591Sensor.create({ "Value": body.tsl2591 });
      results.tsl2591 = await LmsTsl2591Sensor.findById(tsl2591Doc._id);
    }

    return Response.json(results, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
