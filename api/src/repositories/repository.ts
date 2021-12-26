import { Bson, Collection } from "../utils/deps.ts";
import MongoDatabase from "../database/mongoDatabase.ts";
import { Pagination } from "../types/filterandpagination/FilterAndPaginationTypes.ts";

export abstract class Repository {
  // What concrete classes should override and implement
  abstract get collectionName(): string;
  abstract repositoryCollection(): Collection<any>;

  // private static variables
  private static _dataBase = {} as MongoDatabase;

  constructor() {
    this.dataBase = MongoDatabase.getInstance();
  }

  // properties
  get dataBase(): MongoDatabase {
    return Repository._dataBase;
  }
  set dataBase(db: MongoDatabase) {
    Repository._dataBase = db;
  }

  /**
   * Find the entry in the repository that corresponds to the id passed.
   * @param id - Id of the entry to return
   * @returns Returns the repository entry correcsponding to passed id
   */
  async find(id: any) {
    const result = await this.findBy({ "_id": id });
    return result;
  }

  /**
   * Find the record specified by the query
   * @param query - Specifies query selection criteria using query operators.
   * @returns - One document that satisfies the criteria specified as the first argument to this method.
   */
  async findBy(query: any) {
    const db = await this.repositoryCollection();
    return await db.findOne(query);
  }

  /**
   * Create an entry in the repository
   * @param document - A document to insert into the collection.
   * @returns A field insertedId with the _id value of the inserted document.
   */
  async create(entry: any) {
    const db = await this.repositoryCollection();
    return await db.insertOne(entry);
  }

  /**
   * @param id - The id of the entry to update
   * @param data - data to be updated
   * @returns The new information after update
   */
  async update(id: any, data: any): Promise<any> {
    const db = await this.repositoryCollection();

    const writeResult = await db.updateOne({ _id: id }, {
      "$set": data,
    });
    if (writeResult.matchedCount > 0) {
      const user = await this.find(id);
      return user;
    }
    return null;
  }

  /**
   * @param query - The use in the update
   * @param data - data to be updated
   * @returns The new information after update
   */
  async updateAll(
    query: Record<string, unknown>,
    data: any,
  ): Promise<[number, number]> {
    const db = await this.repositoryCollection();

    const writeResult = await db.updateMany(query, {
      "$set": data,
    });
    return [writeResult.matchedCount, writeResult.modifiedCount];
  }

  /**
   * Delete one entry from the repository
   * @param id - The id of the entry to delete
   * @returns - Deleted count
   */
  async delete(id: Bson.ObjectId) {
    const db = await this.repositoryCollection();
    return await db.deleteOne({ _id: id });
  }

  /**
   * Selects documents in a collection or view.
   * @param pagination - Paginition parameters specify the limit and offset of the collection
   * @returns a cursor to the selected documents
   */
  async findAll(pagination: Pagination) {
    const db = await this.repositoryCollection();
    const offset = Number(pagination.offset ?? 0);
    const limit = Number(pagination.limit ?? 20);
    const reqUsers = await db.find().limit(limit).skip(offset).toArray();
    return reqUsers;
  }

  async drop(): Promise<void> {
    const db = await this.repositoryCollection();
    await db.drop();
  }
}
