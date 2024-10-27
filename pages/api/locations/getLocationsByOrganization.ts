import connectToDatabase from "@/app/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

async function getLocationsByOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.query;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    const location = await db
      .collection("locations")
      .find({ organizationId })
      .toArray();

    if (location.length === 0) {
      res.status(404).json({ message: "No locations found" });
    } else {
      res.status(200).json(location);
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default getLocationsByOrganization;
