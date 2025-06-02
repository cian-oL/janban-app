import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  createdAt: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
});

// Middleware to validate at least one user
ProjectSchema.pre('save', function(next) {
  if (this.users.length < 1) {
    next(new Error('A project must have at least one user'));
  } else {
    next();
  }
});

// Also validate on update operations
ProjectSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  
  // Only validate if users array is being modified
  if (update.users && Array.isArray(update.users) && update.users.length < 1) {
    next(new Error('A project must have at least one user'));
  } else {
    next();
  }
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
