import connectToDatabase from "@/app/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

async function getInventoryByOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.query;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    const inventory = await db
      .collection("inventory")
      .find({ organizationId })
      .toArray();

    if (inventory.length === 0) {
      res.status(404).json({ message: "No inventory found" });
    } else {
      res.status(200).json(inventory);
    }
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default getInventoryByOrganization;
