import { ObjectId } from "mongodb";

export interface InventoryType {
  _id?: ObjectId; // Only allow ObjectId type for MongoDB compatibility
  organizationId: string;
  inventoryName: string;
  latitude: number;
  longitude: number;
  description: string;
  lastUpdated?: string; // Optional if you set it server-side
}

export interface InventoryRelocateType {
  id: ObjectId;
  latitude: number;
  longitude: number;
}
