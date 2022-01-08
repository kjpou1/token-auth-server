/** Request body to create reset password */
export type ResetRequest = {
  /** user email */
  email: string;
  /** reset URL */
  resetURL: string;
};
