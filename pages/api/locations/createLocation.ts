import { LocationType } from "@/app/types/location";
import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

async function createLocation(req: NextApiRequest, res: NextApiResponse) {
  const locationData: LocationType = req.body;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    // Set the lastUpdated field
    locationData.lastUpdated = dayjs().format("DD MMM, YYYY HH:mm");

    // Ensure organizationId is treated as a string
    const locationWithOrgIdAsString = {
      ...locationData,
      organizationId: locationData.organizationId.toString(),
    };

    const response = await db
      .collection("locations")
      .insertOne(locationWithOrgIdAsString);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating Location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default createLocation;
