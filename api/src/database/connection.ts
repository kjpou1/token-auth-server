import { MongoClient } from "../utils/deps.ts";
import { config } from "../config/config.ts";

const client = new MongoClient();

// Connecting to a Local Database
await client.connect(config.MONGODB_URI as string);
export const db = client.database(config.MONGODB_DATABASE_NAME);
