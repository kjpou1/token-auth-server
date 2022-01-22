import { ResponseUser } from "./userTypes.ts";

export type LoginUserResponse = {
  expiresIn: number;
  user?: ResponseUser | undefined;
  tokenType: string;
  [key: string]: unknown;
};
