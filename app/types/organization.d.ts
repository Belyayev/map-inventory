import { ObjectId } from "mongodb";
export interface OrganizationType {
  _id?: ObjectId; // Only allow ObjectId type for MongoDB compatibility
  organizationName: string;
  owner: string; // who created the organization
  latitude: number;
  longitude: number;
  description: string;
  admins: string[]; // array of email addresses of users to admin
  lastUpdated?: string; // Optional if you set it server-side
}
