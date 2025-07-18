import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Lms from "@/models/Lms";

export async function GET() {
  try {
    await connectDB();
    
    // Get the most recent entry
    const latestData = await Lms.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!latestData) {
      return Response.json({ error: "No data found" }, { status: 404 });
    }

    // Check if the latest data is within 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const isActive = latestData.createdAt > fifteenMinutesAgo;
    
    // Get last active times for each device
    const deviceStates = {
      growLights: { 
        currentState: isActive ? latestData.growLights : false,
        lastActiveTime: null
      },
      oled: { 
        currentState: isActive ? latestData.oled : false,
        lastActiveTime: null
      }
    };

    // Find last active time for each device
    const devices = ['growLights', 'oled'];
    
    for (const device of devices) {
      const lastActiveRecord = await Lms.findOne({ [device]: true })
        .sort({ createdAt: -1 })
        .lean();
        
      if (lastActiveRecord) {
        deviceStates[device].lastActiveTime = toIST(lastActiveRecord.createdAt);
      }
    }

    // Format the response
    const formattedData = {
      sensorData: {
        as7265x: latestData.as7265x,
        bh1750: latestData.bh1750,
        ldr: latestData.ldr,
        tsl2591: latestData.tsl2591,
        dimmable: latestData.dimmable
      },
      deviceStatus: deviceStates,
      lastUpdated: toIST(latestData.createdAt),
      isDataCurrent: isActive
    };

    return Response.json(formattedData);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
} 