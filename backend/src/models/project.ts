import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
