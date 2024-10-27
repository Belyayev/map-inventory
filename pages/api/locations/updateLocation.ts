import { ObjectId } from "mongodb";
import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { LocationType } from "@/app/types/location";

async function updateLocation(req: NextApiRequest, res: NextApiResponse) {
  const locationData: LocationType = req.body;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    const response = await db.collection("loactions").updateOne(
      { _id: new ObjectId(locationData._id) }, // Convert string to ObjectId here
      {
        $set: {
          organizationId: locationData.organizationId,
          locationName: locationData.locationName,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          description: locationData.description,
          lastUpdated: dayjs().format("DD MMM, YYYY HH:mm"),
        },
      }
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating Location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default updateLocation;
