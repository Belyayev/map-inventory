// pages/api/locations/[locationId].ts
import { NextApiRequest, NextApiResponse } from "next";

interface Asset {
  id: string;
  name: string;
}

const assets: { [key: string]: Asset[] } = {
  "1": [
    { id: "1", name: "Asset One" },
    { id: "2", name: "Asset Two" },
  ],
  "2": [
    { id: "3", name: "Asset Three" },
    { id: "4", name: "Asset Four" },
  ],
  // Add more assets as needed
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locationId } = req.query;
  const locationAssets = assets[locationId as string] || [];
  res.status(200).json(locationAssets);
}
