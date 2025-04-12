import { EMAIL_REGEX, PASSWORD_REGEX } from "./regex";

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);
export const emailErrorMessage = "Please enter a valid email.";

export const isValidPassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

export const passwordErrorMessage =
  "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
