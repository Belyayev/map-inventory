import connectToDatabase from "@/app/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

async function getOrganizationByName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orgName } = req.query;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");
  const organization = await db
    .collection("organizations")
    .findOne({ organizationName: orgName });

  if (!organization) {
    res.status(404).json({ message: "Organization not found" });
  } else {
    res.status(200).json(organization);
  }

  client.close();
}

export default getOrganizationByName;
