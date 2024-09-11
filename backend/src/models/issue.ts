import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  issueCategory: { type: String, required: true },
  issueCode: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  storyPoints: { type: Number },
  assignee: { type: String },
  columnId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
