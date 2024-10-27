import connectToDatabase from "@/app/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

async function getOrganizationByName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orgName } = req.query;

  // Ensure orgName is a string
  if (typeof orgName !== "string") {
    res.status(400).json({ message: "Invalid organization name" });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db("FreeMap");

  const organization = await db.collection("organizations").findOne({
    organizationName: { $regex: new RegExp(orgName, "i") },
  });

  if (!organization) {
    res.status(404).json({ message: "Organization not found" });
  } else {
    res.status(200).json(organization);
  }

  client.close();
}

export default getOrganizationByName;
