import express, { Request, Response } from "express";
import { validationResult } from "express-validator";

import Issue from "../models/issue";
import { checkDatabaseForIssueCode, generateIssueCode } from "../utils/issue";

// "/api/issues/create-issue"
export const createIssue = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const allIssues = await Issue.find({});
    let arrayLength = allIssues.length;

    const issue = new Issue(req.body);
    issue.issueCode = generateIssueCode(arrayLength);

    while (await checkDatabaseForIssueCode(Issue, issue.issueCode)) {
      arrayLength += 1;
      issue.issueCode = generateIssueCode(arrayLength);
    }

    issue.createdAt = new Date();
    issue.lastUpdated = new Date();
    await issue.save();

    return res.status(201).json(issue);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "/api/issues"
export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await Issue.find({});
    return res.status(200).json(issues);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// "/api/issues/:issueCode"
export const getIssue = async (req: Request, res: Response) => {
  try {
    const { issueCode } = req.params;

    const issue = await Issue.findOne({ issueCode });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json(issue);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const { issueCode } = req.params;
    const {
      issueCategory,
      isBacklog,
      name,
      description,
      storyPoints,
      assignee,
      columnId,
    } = req.body;

    const existingIssue = await Issue.findOne({ issueCode });

    if (!existingIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    existingIssue.issueCategory = issueCategory;
    existingIssue.isBacklog = isBacklog;
    existingIssue.name = name;
    existingIssue.description = description;
    existingIssue.storyPoints = storyPoints;
    existingIssue.assignee = assignee;
    existingIssue.columnId = columnId;
    existingIssue.lastUpdated = new Date();
    await existingIssue.save();

    return res.status(200).json(existingIssue);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { issueCode } = req.params;

    const result = await Issue.findOneAndDelete({ issueCode });

    if (!result) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
