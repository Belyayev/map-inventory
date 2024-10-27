import { ObjectId } from "mongodb";

export interface LocationType {
  _id?: ObjectId; // Only allow ObjectId type for MongoDB compatibility
  organizationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description: string;
  lastUpdated?: string; // Optional if you set it server-side
}
