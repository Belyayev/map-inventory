import { MongoClient } from "mongodb";

export default async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URI ?? "", {});

  return client;
}
