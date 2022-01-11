import { config } from "../config/config.ts";
import { Database, isEmpty, log, MongoClient } from "../utils/deps.ts";

/**
 * Manage mongo database connection implemented in singleton
 */
class MongoDatabase {
  public client: MongoClient;
  private connectionPromise: Promise<Database> | null;
  private static instance: MongoDatabase;
  private MONGO_URI: string;
  private DB_NAME: string;
  constructor() {
    // First check for environment override parameters
    this.MONGO_URI = config.MONGODB_URI;
    this.DB_NAME = config.MONGODB_DATABASE_NAME;
    const mongoClient = new MongoClient();
    this.client = mongoClient;
    this.connectionPromise = null;
  }

  async connect() {
    if (!this.connectionPromise) {
      if (isEmpty(this.client)) {
        log.info(
          `Connecting to mongodb at ${this.MONGO_URI} db: ${this.DB_NAME} --`,
        );
        try {
          this.connectionPromise = this.client.connect(
            this.MONGO_URI as string,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
    return this.connectionPromise;
  }

  get getDatabase() {
    return this.client.database(this.DB_NAME);
  }

  static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }
}

export default MongoDatabase;
