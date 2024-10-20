import connectToDatabase from "@/app/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

async function getOrganizations(req: NextApiRequest, res: NextApiResponse) {
  const { userEmail } = req.query;
  const client = await connectToDatabase();
  const db = client.db("FreeMap");
  const organizations = await db
    .collection("organizations")
    .find({ admins: userEmail })
    .toArray();

  res.status(200).json(organizations);
  client.close();
}

export default getOrganizations;
