import { ResponseUser } from "./userTypes.ts";

export type LoginUserResponse = {
  expiresIn: number;
  user: ResponseUser;
  tokenType: string;
  [key: string]: unknown;
};
