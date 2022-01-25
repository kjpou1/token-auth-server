import { config } from "../config/config.ts";
import { UserSchema } from "../schemas/schemas.ts";
import { UserRole } from "../types/user/userTypes.ts";
import {
  bcrypt,
  Collection,
  Database,
  isEmpty,
  log,
  MongoClient,
} from "./deps.ts";

const {
  MONGODB_URI,
  MONGODB_DATABASE_NAME,
  SEED_NAME,
  SEED_EMAIL,
  SEED_PASSWORD,
} = config;

export async function databaseSeed() {
  log.info("===============================");
  log.info("* Verifying databases ...      *");
  log.info("===============================");

  // First check for environment override parameters
  const MONGO_URI = MONGODB_URI;
  const DB_NAME = MONGODB_DATABASE_NAME;
  let authDB: Database = {} as Database;
  let userColl: Collection<UserSchema> = {} as Collection<UserSchema>;
  let needsSeeding = false;
  try {
    const mongoClient = new MongoClient();
    await mongoClient.connect(MONGO_URI as string);
    const dbs = await mongoClient.listDatabases(
      {
        filter: {
          name: DB_NAME,
        },
        nameOnly: true,
      },
    );
    if (dbs && dbs.length > 0) {
      authDB = mongoClient.database(DB_NAME);
      const colls = await authDB.listCollectionNames({
        filter: {
          name: "users",
        },
      });

      if (colls && colls.length > 0) {
        userColl = authDB.collection<UserSchema>(colls[0]);
        const userCount = await userColl.count();
        if (userCount == 0) {
          needsSeeding = true;
        }
      } else {
        needsSeeding = true;
      }
    } else {
      needsSeeding = true;
    }
    if (needsSeeding) {
      log.info("===============================");
      log.info("* Generating seed entries ... *");
      log.info("===============================");
      if (isEmpty(authDB)) {
        authDB = mongoClient.database(DB_NAME);
      }
      if (isEmpty(userColl)) {
        userColl = authDB.collection<UserSchema>("users");
      }
      const roles: UserRole[] = [UserRole.SUPER, UserRole.ADMIN];
      const adminUser = {
        name: SEED_NAME ?? Deno.env.get("SEED_NAME"),
        email: SEED_EMAIL ?? Deno.env.get("SEED_EMAIL"),
        password: await bcrypt.hash(
          SEED_PASSWORD ?? Deno.env.get("SEED_PASSWORD"),
        ),
        emailVerified: true,
        active: true,
        createdOn: new Date(),
        roles,
      } as UserSchema;

      await userColl.insertOne(adminUser);
      log.info("===============================");
      log.info("* Seed Entries generated ...  *");
      log.info("===============================");
    }
  } catch (err) {
    console.log(err);
  }

  //const db = client.database(DB_NAME);
}
