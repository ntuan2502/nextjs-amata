import { EMAIL_REGEX, PASSWORD_REGEX } from "./regex";

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const isValidPassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);
