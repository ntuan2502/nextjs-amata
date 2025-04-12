// types/auth.ts

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  fullname?: string;
  confirmPassword?: string;
  [key: string]: string | undefined; // để hỗ trợ thêm trường tùy ý sau này
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};
