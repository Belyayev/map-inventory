import { ObjectId } from "mongodb";
import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { InventoryRelocateType } from "@/app/types/inventory";

async function relocateInventory(req: NextApiRequest, res: NextApiResponse) {
  const inventoryData: InventoryRelocateType = req.body;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    const response = await db.collection("inventory").updateOne(
      { _id: new ObjectId(inventoryData.id) }, // Convert string to ObjectId here
      {
        $set: {
          latitude: inventoryData.latitude,
          longitude: inventoryData.longitude,
          lastUpdated: dayjs().format("DD MMM, YYYY HH:mm"),
        },
      }
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error relocating inventory item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default relocateInventory;
