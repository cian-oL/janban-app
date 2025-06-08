import mongoose from "mongoose";

export const issueCategoryEnum: string[] = ["Story", "Bug", "Task", "Spike"];
export const issueColumnIdEnum: string[] = [
  "blocked",
  "playReady",
  "inDevelopment",
  "testReady",
  "testInProgress",
  "demoReady",
  "complete",
];

const IssueSchema = new mongoose.Schema({
  issueCategory: { type: String, required: true, enum: issueCategoryEnum },
  isBacklog: { type: Boolean, required: true },
  issueCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  storyPoints: { type: Number },
  assignee: { type: String },
  columnId: { type: String, required: true, enum: issueColumnIdEnum },
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
