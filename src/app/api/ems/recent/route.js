import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Ems from "@/models/Ems";

export async function GET() {
  try {
    await connectDB();
    
    // Get the most recent entry
    const latestData = await Ems.findOne()
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
      exhaustFan: { 
        currentState: isActive ? latestData.exhaustFan : false,
        lastActiveTime: null
      },
      indoorCooling: { 
        currentState: isActive ? latestData.indoorCooling : false,
        lastActiveTime: null
      },
      oled: { 
        currentState: isActive ? latestData.oled : false,
        lastActiveTime: null
      },
      diaphragmPump: { 
        currentState: isActive ? latestData.diaphragmPump : false,
        lastActiveTime: null
      }
    };

    // Find last active time for each device
    const devices = ['exhaustFan', 'indoorCooling', 'oled', 'diaphragmPump'];
    
    for (const device of devices) {
      const lastActiveRecord = await Ems.findOne({ [device]: true })
        .sort({ createdAt: -1 })
        .lean();
        
      if (lastActiveRecord) {
        deviceStates[device].lastActiveTime = toIST(lastActiveRecord.createdAt);
      }
    }

    // Format the response
    const formattedData = {
      sensorData: {
        carbonDioxide: latestData.carbonDioxide,
        dht22Moisture: latestData.dht22Moisture,
        dht22Temp: latestData.dht22Temp,
        oxygen: latestData.oxygen,
        pressure: latestData.pressure,
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