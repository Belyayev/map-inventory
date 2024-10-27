export interface Organization {
  _id: string;
  organizationName: string;
  owner: string; // who created the organization
  latitude: number;
  longitude: number;
  description: string;
  admins: string[]; // array of email addresses of users to admin
}
