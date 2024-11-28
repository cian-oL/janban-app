import { User } from "./userTypes";

export type AccessTokenResponse = {
  accessToken: string;
  user?: User;
};
