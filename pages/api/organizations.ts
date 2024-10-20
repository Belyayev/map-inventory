// pages/api/organizations.ts
import { NextApiRequest, NextApiResponse } from "next";

const organizations = [
  { id: "1", name: "Organization One" },
  { id: "2", name: "Organization Two" },
  // Add more organizations as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(organizations);
}
