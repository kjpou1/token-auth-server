import { Bson, httpErrors } from "../utils/deps.ts";
import { EncryptionService } from "../services/services.ts";
import { UserSchema } from "../schemas/schemas.ts";
import { CreateUser } from "../types/user/userTypes.ts";
import { Pagination } from "../types/filterandpagination/FilterAndPaginationTypes.ts";
import { createResponseUser } from "../utils/utils.ts";
import { UserRepository } from "../repositories/repositories.ts";

// users definition
const repository = new UserRepository();

export class UserService {
  /**
   * get user by user id
   */
  static async getUserById(_id: Bson.ObjectId) {
    const user = await repository.find(_id);
    return user;
  }

  /**
   * get user by email
   * return user info with password
   */
  static async getUserByEmail(email: string) {
    const user = await repository.findBy({ email });
    return user;
  }

  /**
   * Create user
   */
  static async createUser(
    user: CreateUser,
  ) {
    const { name, email, password, roles } = user;
    const lastInsertId = await repository.create({
      name,
      email,
      password: await EncryptionService.encrypt(password),
      roles,
    });
    return await this.getUserById(lastInsertId);
  }

  /**
   * get user by pagination
   * return user info without password
   */
  static async getUsers(pagination: Pagination) {
    const reqUsers = await repository.findAll(pagination);
    return reqUsers.map((user: UserSchema) => {
      const data = createResponseUser(user);
      return data;
    });
  }

  /**
   * update user
   */
  static async updateUserById(
    _id: Bson.ObjectId,
    userData: CreateUser,
  ) {
    const user = await repository.update(_id, userData);
    return user;
  }

  /**
   * delete user
   */
  static async deleteById(_id: Bson.ObjectId) {
    const deletedCount = await repository.delete(_id);
    if (deletedCount != 1) {
      throw new httpErrors.NotFound("User not found");
    }
  }

  /**
   * update user password
   */
  static async updateUserPasswordByEmail(
    email: string,
    password: string,
  ): Promise<boolean> {
    const userData = await this.getUserByEmail(email) as UserSchema;
    if (!userData) {
      return false;
    }
    const passwordData = {
      password: await EncryptionService.encrypt(password),
      active: true,
      blockedOn: null,
    };
    const user = await repository.update(
      userData._id,
      passwordData,
    ) as UserSchema;

    return user !== null;
  }

  /**
   * Mark user as blocked
   */
  static async blockUser(
    id: string | Bson.ObjectId,
  ): Promise<boolean> {
    let _id = id as Bson.ObjectId;
    if (typeof id === "string") {
      _id = new Bson.ObjectId(id);
    }

    const updData = {
      active: false,
      blockedOn: new Date(),
    };

    // This routine returns back the update record
    const blockedUser = await repository.update(_id, updData);
    return blockedUser !== null;
  }
}
