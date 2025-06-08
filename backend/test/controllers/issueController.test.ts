import { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
  createIssue,
  getAllIssues,
  getIssue,
  updateIssue,
  deleteIssue,
} from "../../src/controllers/issueController";
import Issue from "../../src/models/issue";
import * as issueUtils from "../../src/utils/issue";

// ==== DEPENDENCY MOCKS ====

jest.mock("../../src/models/issue");
jest.mock("../../src/models/project");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Issue Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    jest.clearAllMocks();
    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    mockRequest = {
      body: {},
      params: {},
    };
  });

  // ==== TESTS ====

  describe("createIssue", () => {
    it("should return 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid" }],
      });

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: [{ msg: "Invalid" }],
      });
    });

    it("should create an issue and return 201 with issue data", async () => {
      const newIssue = {
        _id: "issue123",
        issueCategory: "Story",
        isBacklog: false,
        issueCode: "JI000001",
        name: "Test Issue",
        description: "Test description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
        createdAt: expect.any(Date),
        lastUpdated: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        issueCategory: "Story",
        isBacklog: false,
        name: "Test Issue",
        description: "Test description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (Issue.find as jest.Mock).mockResolvedValue([]);
      (Issue as unknown as jest.Mock).mockImplementation(() => newIssue);

      // Simulate checkDatabaseForIssueCode to return false
      jest
        .spyOn(issueUtils, "checkDatabaseForIssueCode")
        .mockResolvedValue(false);

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(newIssue.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(newIssue);
    });

    it("should regenerate issueCode if duplicate is found", async () => {
      const newIssue = {
        _id: "issue123",
        issueCategory: "Story",
        isBacklog: false,
        issueCode: "JI000002",
        name: "Test Issue",
        description: "Test description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
        createdAt: expect.any(Date),
        lastUpdated: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        issueCategory: "Story",
        isBacklog: false,
        name: "Test Issue",
        description: "Test description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (Issue.find as jest.Mock).mockResolvedValue([]);
      (Issue as unknown as jest.Mock).mockImplementation(() => newIssue);

      // Simulate checkDatabaseForIssueCode: first call returns true (duplicate), second returns false (unique)
      jest
        .spyOn(issueUtils, "checkDatabaseForIssueCode")
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(newIssue.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(newIssue);

      // The issueCode should have been regenerated (checkDatabaseForRacfid called twice)
      expect(issueUtils.checkDatabaseForIssueCode).toHaveBeenCalledTimes(2);
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.body = {
        issueCategory: "Story",
        isBacklog: false,
        name: "Test Issue",
        description: "Test description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (Issue.find as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("getAllIssues", () => {
    it("should return all issues with status 200", async () => {
      const issues = [
        { _id: "issue1", issueCode: "JI000001" },
        { _id: "issue2", issueCode: "JI000002" },
      ];

      (Issue.find as jest.Mock).mockResolvedValue(issues);

      await getAllIssues(mockRequest as Request, mockResponse as Response);

      expect(Issue.find).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(issues);
    });

    it("should return 500 if an error occurs", async () => {
      (Issue.find as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await getAllIssues(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("getIssue", () => {
    it("should return the issue if found", async () => {
      const issue = { _id: "issue1", issueCode: "JI000001" };
      mockRequest.params = { issueCode: "JI000001" };

      (Issue.findOne as jest.Mock).mockResolvedValue(issue);

      await getIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOne).toHaveBeenCalledWith({ issueCode: "JI000001" });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(issue);
    });

    it("should return 404 if issue not found", async () => {
      mockRequest.params = { issueCode: "nonexistent" };

      (Issue.findOne as jest.Mock).mockResolvedValue(null);

      await getIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOne).toHaveBeenCalledWith({ issueCode: "nonexistent" });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Issue not found",
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.params = { issueCode: "JI000001" };

      (Issue.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      jest.spyOn(console, "log").mockImplementation(() => {});

      await getIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("updateIssue", () => {
    it("should update and return issue if found", async () => {
      const issue = {
        _id: "issue1",
        issueCode: "JI000001",
        issueCategory: "Story",
        isBacklog: false,
        name: "Original Issue",
        description: "Original description",
        storyPoints: 3,
        assignee: "User123",
        columnId: "playReady",
        lastUpdated: new Date("2023-01-01"),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.params = { issueCode: "JI000001" };
      mockRequest.body = {
        issueCategory: "Bug",
        isBacklog: true,
        name: "Updated Issue",
        description: "Updated description",
        storyPoints: 5,
        assignee: "User456",
        columnId: "inProgress",
      };

      (Issue.findOne as jest.Mock).mockResolvedValue(issue);

      await updateIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOne).toHaveBeenCalledWith({ issueCode: "JI000001" });
      expect(issue.issueCategory).toBe("Bug");
      expect(issue.isBacklog).toBe(true);
      expect(issue.name).toBe("Updated Issue");
      expect(issue.description).toBe("Updated description");
      expect(issue.storyPoints).toBe(5);
      expect(issue.assignee).toBe("User456");
      expect(issue.columnId).toBe("inProgress");
      expect(issue.lastUpdated).toBeInstanceOf(Date);
      expect(issue.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(issue);
    });

    it("should return 404 if issue not found", async () => {
      mockRequest.params = { issueCode: "nonexistent" };
      mockRequest.body = {
        issueCategory: "Bug",
        isBacklog: true,
        name: "Updated Issue",
        description: "Updated description",
        storyPoints: 5,
        assignee: "User456",
        columnId: "inProgress",
      };

      (Issue.findOne as jest.Mock).mockResolvedValue(null);

      await updateIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOne).toHaveBeenCalledWith({ issueCode: "nonexistent" });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Issue not found",
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.params = { issueCode: "JI000001" };
      mockRequest.body = {
        issueCategory: "Bug",
        isBacklog: true,
        name: "Updated Issue",
        description: "Updated description",
        storyPoints: 5,
        assignee: "User456",
        columnId: "inProgress",
      };

      (Issue.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      jest.spyOn(console, "log").mockImplementation(() => {});

      await updateIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("deleteIssue", () => {
    it("should delete issue and return success message", async () => {
      mockRequest.params = { issueCode: "JI000001" };

      const deletedIssue = { _id: "issue1", issueCode: "JI000001" };
      (Issue.findOneAndDelete as jest.Mock).mockResolvedValue(deletedIssue);

      await deleteIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOneAndDelete).toHaveBeenCalledWith({
        issueCode: "JI000001",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Issue deleted successfully",
      });
    });

    it("should return 404 if issue not found", async () => {
      mockRequest.params = { issueCode: "nonexistent" };

      (Issue.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteIssue(mockRequest as Request, mockResponse as Response);

      expect(Issue.findOneAndDelete).toHaveBeenCalledWith({
        issueCode: "nonexistent",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Issue not found",
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.params = { issueCode: "JI000001" };

      (Issue.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      jest.spyOn(console, "log").mockImplementation(() => {});

      await deleteIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
});
