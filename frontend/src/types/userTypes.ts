export type User = {
  racfid: string;
  password: string;
  email: string;
  name: string;
};

export type UserFormData = {
  racfid?: string;
  password: string;
  email: string;
  name: string;
  confirmPassword: string;
};

export type SignInFormData = {
  racfid: string;
  password: string;
};
