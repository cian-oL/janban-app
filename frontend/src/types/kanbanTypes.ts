export type Column = {
  columnId: string;
  title: string;
};

export type Issue = {
  _id: string;
  issueCategory: string;
  issueCode: string;
  name: string;
  description: string;
  storyPoints: number;
  assignee: string;
  columnId: string;
  createdAt: Date;
  lastUpdated: Date;
};

export type IssueFormData = {
  issueCategory: string;
  issueCode: string;
  name: string;
  description: string;
  storyPoints: number;
  assignee: string;
  columnId: string;
};
