import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Nfads from "@/models/Nfads";

export async function GET() {
  try {
    await connectDB();
    
    // Get the most recent entry
    const latestData = await Nfads.findOne()
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
      compressor: { 
        currentState: isActive ? latestData.compressor : false,
        lastActiveTime: null
      },
      oled: { 
        currentState: isActive ? latestData.oled : false,
        lastActiveTime: null
      },
      peltier: { 
        currentState: isActive ? latestData.peltier : false,
        lastActiveTime: null
      },
      peristalticPumpA: { 
        currentState: isActive ? latestData.peristalticPumpA : false,
        lastActiveTime: null
      },
      peristalticPumpB: { 
        currentState: isActive ? latestData.peristalticPumpB : false,
        lastActiveTime: null
      },
      // peristalticPumpPhdown: { 
      //   currentState: isActive ? latestData.peristalticPumpPhdown : false,
      //   lastActiveTime: null
      // },
      peristalticPumpPhup: { 
        currentState: isActive ? latestData.peristalticPumpPhup : false,
        lastActiveTime: null
      },
      solenoidValve: { 
        currentState: isActive ? latestData.solenoidValve : false,
        lastActiveTime: null
      },
      waterPump: { 
        currentState: isActive ? latestData.waterPump : false,
        lastActiveTime: null
      }
    };

    // Find last active time for each device
    // const devices = [
    //   'compressor', 'oled', 'peltier', 'peristalticPumpA', 'peristalticPumpB',
    //   'peristalticPumpPhdown', 'peristalticPumpPhup', 'solenoidValve', 'waterPump'
    // ];
    const devices = [
      'compressor', 'oled', 'peltier', 'peristalticPumpA', 'peristalticPumpB',
      'peristalticPumpPhup', 'solenoidValve', 'waterPump'
    ];
    
    for (const device of devices) {
      const lastActiveRecord = await Nfads.findOne({ [device]: true })
        .sort({ createdAt: -1 })
        .lean();
        
      if (lastActiveRecord) {
        deviceStates[device].lastActiveTime = toIST(lastActiveRecord.createdAt);
      }
    }

    // Format the response
    const formattedData = {
      sensorData: {
        ec: latestData.ec,
        ph: latestData.ph,
        tds: latestData.tds,
        waterFlow: latestData.waterFlow,
        waterTemp: latestData.waterTemp
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
