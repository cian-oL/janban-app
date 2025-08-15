export type User = {
  clerkId: string;
  racfid: string;
  email: string;
  name: string;
  passwordEnabled: boolean;
  createdAt: string;
  lastUpdated: string;
};

export type SignInFormData = {
  racfid: string;
  password: string;
};
