/*
 * JWT §4.1: The following Claim Names are registered in the IANA
 * "JSON Web Token Claims" registry established by Section 10.1. None of the
 * claims defined below are intended to be mandatory to use or implement in all
 * cases, but rather they provide a starting point for a set of useful,
 * interoperable claims.
 * Applications using JWTs should define which specific claims they use and when
 * they are required or optional.
 */
export type AccessToken = {
  iss: string;
  sub: string;
  aud: string[] | string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
};
