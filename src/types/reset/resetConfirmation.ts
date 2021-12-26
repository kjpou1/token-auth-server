/** Request body to create reset password */
export type ResetConfirmation = {
  /** New Password */
  password: string;
  passwordConfirm: string;
};
