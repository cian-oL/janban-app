export type User = {
  clerkId: string;
  racfid: string;
  email: string;
  name: string;
  passwordEnabled: boolean;
  createdAt: Date;
  lastUpdated: Date;
};

export type SignInFormData = {
  racfid: string;
  password: string;
};
