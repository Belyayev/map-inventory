// pages/api/organizations/[orgId].ts
import { NextApiRequest, NextApiResponse } from "next";

interface Location {
  id: string;
  description: string;
}

const locations: { [key: string]: Location[] } = {
  "1": [
    { id: "1", description: "Location One" },
    { id: "2", description: "Location Two" },
  ],
  "2": [
    { id: "3", description: "Location Three" },
    { id: "4", description: "Location Four" },
  ],
  // Add more locations as needed
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orgId } = req.query;
  const orgLocations = locations[orgId as string] || [];
  res.status(200).json(orgLocations);
}
