import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    await connectDB();

    // Validate required fields
    const { module, title, description, timestamp, sensorType } = body;
    
    if (!module || !title || !description || !timestamp || !sensorType) {
      return Response.json({ 
        error: "Missing required fields: module, title, description, timestamp, sensorType" 
      }, { status: 400 });
    }

    // Validate module enum
    if (!['NFADS', 'LMS', 'EMS'].includes(module)) {
      return Response.json({ 
        error: "Module must be one of: NFADS, LMS, EMS" 
      }, { status: 400 });
    }

    // Create notification data
    const notificationData = {
      module,
      title,
      description,
      timestamp: new Date(timestamp),
      sensorType
    };

    const doc = await Notification.create(notificationData);
    const result = await Notification.findById(doc._id);

    return Response.json(result, { status: 201 });
  } catch (err) {
    console.error('Error creating notification:', err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    // Get query parameters for filtering
    const module = searchParams.get('module');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    // Build query
    let query = {};
    if (module && ['NFADS', 'LMS', 'EMS'].includes(module)) {
      query.module = module;
    }

    // Get notifications with optional filtering
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return Response.json({ error: err.message }, { status: 400 });
  }
} 