import { log, MongoClient } from "../utils/deps.ts";
import { config } from "../config/config.ts";

/**
 * Manage mongo database connection implemented in singleton
 */
class MongoDatabase {
  public client: MongoClient;
  private static instance: MongoDatabase;
  private MONGO_URL: string;
  private DB_NAME: string;
  constructor() {
    // First check for environment override parameters
    this.MONGO_URL = Deno.env.get("MONGO_URL") || config.MONGODB_URI;
    this.DB_NAME = Deno.env.get("DB_NAME") || config.MONGODB_DATABASE_NAME;
    this.client = {} as MongoClient;
  }

  connect() {
    log.info(
      `Connecting to mongodb at ${this.MONGO_URL} db: ${this.DB_NAME} --`,
    );
    const mongoClient = new MongoClient();
    mongoClient.connect(this.MONGO_URL as string);
    this.client = mongoClient;
  }

  get getDatabase() {
    return this.client.database(this.DB_NAME);
  }

  static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    MongoDatabase.instance.connect();
    return MongoDatabase.instance;
  }
}

export default MongoDatabase;
