import { connectDB } from "@/lib/db";
import toIST from "@/utils/toIST";
import Lms from "@/models/Lms";

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let start, end, queryFilter;
    
    // Handle date range or all-time data
    if (startDate && endDate) {
      // Parse dates for specific range
      start = new Date(startDate);
      end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return Response.json({ 
          error: "Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)" 
        }, { status: 400 });
      }
      
      if (start >= end) {
        return Response.json({ 
          error: "startDate must be before endDate" 
        }, { status: 400 });
      }
      
      queryFilter = { createdAt: { $gte: start, $lte: end } };
    } else {
      // Get all-time data - find the first and last records
      const firstRecord = await Lms.findOne().sort({ createdAt: 1 }).lean();
      const lastRecord = await Lms.findOne().sort({ createdAt: -1 }).lean();
      
      if (!firstRecord || !lastRecord) {
        return Response.json({
          startDate: null,
          endDate: null,
          activeTime: {
            growLights: 0,
            oled: 0
          },
          activeTimeHours: {
            growLights: 0,
            oled: 0
          },
          totalRecords: 0
        });
      }
      
      start = firstRecord.createdAt;
      end = lastRecord.createdAt;
      queryFilter = {}; // Get all records
    }
    
    // Get all records, sorted by timestamp
    const records = await Lms.find(queryFilter).sort({ createdAt: 1 }).lean();
    
    if (records.length === 0) {
      return Response.json({
        startDate: start ? toIST(start) : null,
        endDate: end ? toIST(end) : null,
        activeTime: {
          growLights: 0,
          oled: 0
        },
        activeTimeHours: {
          growLights: 0,
          oled: 0
        },
        totalRecords: 0
      });
    }
    
    // Calculate active time for each device
    const devices = ['growLights', 'oled'];
    const activeTime = {};
    
    for (const device of devices) {
      let totalActiveTime = 0;
      let lastState = false;
      let lastTimestamp = start;
      
      // Check if device was ON at the start (before first record)
      if (records.length > 0) {
        lastState = records[0][device];
        lastTimestamp = records[0].createdAt;
        
        // If device was ON from the beginning, add time from start to first record
        if (lastState) {
          totalActiveTime += (lastTimestamp - start);
        }
      }
      
      for (let i = 1; i < records.length; i++) {
        const record = records[i];
        const currentState = record[device];
        const currentTimestamp = record.createdAt;
        
        // If device was ON in previous state, add the time difference
        if (lastState) {
          totalActiveTime += (currentTimestamp - lastTimestamp);
        }
        
        lastState = currentState;
        lastTimestamp = currentTimestamp;
      }
      
      // If device was ON at the last record, add time until end date
      if (lastState) {
        totalActiveTime += (end - lastTimestamp);
      }
      
      // Convert to minutes and round to 2 decimal places
      activeTime[device] = Math.round((totalActiveTime / (1000 * 60)) * 100) / 100;
    }
    
    // Format response
    const response = {
      startDate: start ? toIST(start) : null,
      endDate: end ? toIST(end) : null,
      activeTime,
      totalRecords: records.length,
      // Also provide active time in hours for convenience
      activeTimeHours: {}
    };
    
    // Convert minutes to hours
    for (const device in activeTime) {
      response.activeTimeHours[device] = Math.round((activeTime[device] / 60) * 100) / 100;
    }
    
    return Response.json(response);
    
  } catch (err) {
    console.error('Error in LMS sensor route:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
