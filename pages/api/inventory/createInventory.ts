import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { InventoryType } from "@/app/types/inventory"; // Import the InventoryType interface

async function createInventory(req: NextApiRequest, res: NextApiResponse) {
  const inventoryData: InventoryType = req.body;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  try {
    // Set the lastUpdated field
    inventoryData.lastUpdated = dayjs().format("DD MMM, YYYY HH:mm");

    // Ensure organizationId is treated as a string
    const inventoryWithOrgIdAsString = {
      ...inventoryData,
      organizationId: inventoryData.organizationId.toString(),
    };

    const response = await db
      .collection("inventory")
      .insertOne(inventoryWithOrgIdAsString);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
}

export default createInventory;
