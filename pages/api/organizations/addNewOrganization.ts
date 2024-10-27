import { OrganizationType } from "@/app/types/organization";
import connectToDatabase from "@/app/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

async function addNewOrganization(req: NextApiRequest, res: NextApiResponse) {
  const organizationData: OrganizationType = req.body;

  const organizationName = organizationData.organizationName;

  const client = await connectToDatabase();

  const db = client.db("FreeMap");

  const existingOrganization = await db
    .collection("organizations")
    .findOne({ organizationName: organizationName });

  if (existingOrganization !== null) {
    const response = await db.collection("organizations").updateOne(
      { organizationName: organizationName },
      {
        $set: {
          organizationName: organizationData.organizationName,
          owner: organizationData.owner,
          latitude: organizationData.latitude,
          longitude: organizationData.longitude,
          description: organizationData.description,
          admins: organizationData.admins,
          lastUdated: dayjs().format("DD MMM, YYYY HH:mm"),
        },
      }
    );
    res.status(201).json(response);
    client.close();
    return;
  }

  organizationData.lastUpdated = dayjs().format("DD MMM, YYYY HH:mm");
  const response = await db
    .collection("organizations")
    .insertOne(organizationData);

  res.status(201).json(response);

  client.close();
}

export default addNewOrganization;
