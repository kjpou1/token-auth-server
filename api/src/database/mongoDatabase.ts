import { log, MongoClient } from "../utils/deps.ts";
import { config } from "../config/config.ts";

/**
 * Manage mongo database connection implemented in singleton
 */
class MongoDatabase {
  public client: MongoClient;
  private static instance: MongoDatabase;
  private MONGO_URI: string;
  private DB_NAME: string;
  constructor() {
    // First check for environment override parameters
    this.MONGO_URI = config.MONGODB_URI;
    this.DB_NAME = config.MONGODB_DATABASE_NAME;
    this.client = {} as MongoClient;
  }

  connect() {
    log.info(
      `Connecting to mongodb at ${this.MONGO_URI} db: ${this.DB_NAME} --`,
    );
    try {
      const mongoClient = new MongoClient();
      mongoClient.connect(this.MONGO_URI as string);
      this.client = mongoClient;
    } catch (err) {
      console.log(err);
    }
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
