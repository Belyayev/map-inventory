import { ObjectId } from "mongodb";
import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { InventoryType } from "@/app/types/inventory";

async function updateInventory(req: NextApiRequest, res: NextApiResponse) {
  const inventoryData: InventoryType = req.body;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    const response = await db.collection("inventory").updateOne(
      { _id: new ObjectId(inventoryData._id) }, // Convert string to ObjectId here
      {
        $set: {
          organizationId: inventoryData.organizationId,
          inventoryName: inventoryData.inventoryName,
          latitude: inventoryData.latitude,
          longitude: inventoryData.longitude,
          description: inventoryData.description,
          lastUpdated: dayjs().format("DD MMM, YYYY HH:mm"),
        },
      }
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default updateInventory;
