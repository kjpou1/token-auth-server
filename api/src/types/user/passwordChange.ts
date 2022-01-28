/** Request body to change user password */
export type PasswordChange = {
  /** current password */
  passwordCurrent: string;
  /** user password */
  passwordNew: string;
  /** confirm password */
  passwordConfirm: string;
};
