import { Request, Response } from "express";

import Project from "../models/project";
import { validationResult } from "express-validator";

// "/api/projects/create-project"
export const createProject = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const allProjects = await Project.find({});
    let count = allProjects.length;
    let isInDb = false;

    const project = new Project(req.body);

    do {
      project.projectId = generateProjectId(count);
      isInDb = await checkDatabaseForProjectId(project.projectId);
      count++;
    } while (isInDb);

    project.issues = [];

    await project.save();

    return res.status(201).json(project);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "/api/projects"
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({});
    return res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "api/projects/:projectId"
export const getProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({ projectId }).populate("issues");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const existingProject = await Project.findOne({ projectId });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    existingProject.name = name;
    existingProject.description = description;
    existingProject.lastUpdated = new Date();

    await existingProject.save();

    return res.status(200).json(existingProject);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const result = await Project.findOneAndDelete({ projectId });

    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const generateProjectId = (count: number) => {
  if (count === 0) {
    return "JP000001";
  }

  const prefix = "JP";
  const suffix = count.toString().padStart(6, "0");
  return `${prefix}${suffix}`;
};

const checkDatabaseForProjectId = async (projectId: string) => {
  const existingProject = await Project.findOne({ projectId });
  return !!existingProject;
};
