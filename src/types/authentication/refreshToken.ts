// Defining schema interface
export type RefreshToken = {
  sub: string;
  exp: number;
  jti: string;
};
