export type User = {
  clerkId: string;
  racfid: string;
  email: string;
  name: string;
  createdAt: Date;
  lastUpdated: Date;
};

export type SignInFormData = {
  racfid: string;
  password: string;
};
