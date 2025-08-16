import { Issue } from "./kanbanTypes";
import { User } from "./userTypes";

export type Project = {
  _id: string;
  name: string;
  description: string;
  users: User[] | null;
  issues: Issue[] | null;
  createdAt: string;
  lastUpdated: string;
};
