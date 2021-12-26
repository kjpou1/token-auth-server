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
    log.debug("Connecting to mongo");
    this.MONGO_URL = config.MONGODB_URI || "mongodb://localhost:27017";
    this.DB_NAME = config.MONGODB_DATABASE_NAME || "token_auth_server";
    this.client = {} as MongoClient;
  }

  connect() {
    const mongoClient = new MongoClient();
    mongoClient.connect(config.MONGODB_URI as string);
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
