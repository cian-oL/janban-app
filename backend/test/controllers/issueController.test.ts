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
import Project from "../../src/models/project";

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
        array: () => [{ msg: "Invalid issue data" }],
      });

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: [{ msg: "Invalid issue data" }],
      });
    });

    it("should return 404 if project not found", async () => {
      mockRequest.body = {
        projectId: "JP000001",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      (Project.findOne as jest.Mock).mockResolvedValue(null);

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(Project.findOne).toHaveBeenCalledWith({ projectId: "JP000001" });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Project not found",
      });
    });

    it("should create an issue and return 201 with issue data", async () => {
      const mockProject = {
        projectId: "JP000001",
        name: "Test Project",
        issues: [],
        save: jest.fn().mockResolvedValue(true),
      };

      const mockIssue = {
        issueId: "JP000001-1",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
        createdAt: expect.any(Date),
        lastUpdated: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        projectId: "JP000001",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      (Project.findOne as jest.Mock).mockResolvedValue(mockProject);
      (Issue as unknown as jest.Mock).mockImplementation(() => mockIssue);
      (Issue.find as jest.Mock).mockResolvedValue([]);
      (Issue.findOne as jest.Mock).mockResolvedValue(null);

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockIssue.save).toHaveBeenCalled();
      expect(mockProject.issues).toContain(mockIssue._id);
      expect(mockProject.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(mockIssue);
    });

    it("should handle duplicate issueId and generate a new one", async () => {
      const mockProject = {
        projectId: "JP000001",
        name: "Test Project",
        issues: [],
        save: jest.fn().mockResolvedValue(true),
      };

      const mockIssue = {
        issueId: "JP000001-2",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
        createdAt: expect.any(Date),
        lastUpdated: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        projectId: "JP000001",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      (Project.findOne as jest.Mock).mockResolvedValue(mockProject);
      (Issue as unknown as jest.Mock).mockImplementation(() => mockIssue);
      (Issue.find as jest.Mock).mockResolvedValue([{ issueId: "JP000001-1" }]);
      
      // First check finds a duplicate, second check doesn't
      (Issue.findOne as jest.Mock)
        .mockResolvedValueOnce({ issueId: "JP000001-1" })
        .mockResolvedValueOnce(null);

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockIssue.save).toHaveBeenCalled();
      expect(mockProject.issues).toContain(mockIssue._id);
      expect(mockProject.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith(mockIssue);
      expect(mockIssue.issueId).toBe("JP000001-2");
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.body = {
        projectId: "JP000001",
        title: "Test Issue",
        description: "Test Description",
        type: "bug",
        priority: "high",
        status: "todo",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });

      (Project.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await createIssue(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
