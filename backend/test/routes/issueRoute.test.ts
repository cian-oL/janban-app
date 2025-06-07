import express, { Application, NextFunction, Request, Response } from "express";
import request from "supertest";

import issueRoute from "../../src/routes/issueRoute";
import * as issueController from "../../src/controllers/issueController";
import * as authMiddleware from "../../src/middleware/auth";

// ==== MOCKS ====

jest.mock("../../src/controllers/issueController");
jest.mock("../../src/middleware/auth");
jest.mock("../../src/middleware/issue");

// ==== TESTS ====

describe("Issue Routes", () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/issues", issueRoute);

    (authMiddleware.verifyAccessToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.userId = "test-user-id";
        next();
      }
    );
  });

  it("should route POST /create-issue to createIssue controller with auth and validation middleware", async () => {
    jest.mock("../../src/middleware/issue", () => ({
      validateIssueCreation: [
        (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      ],
    }));

    (issueController.createIssue as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(201).json({
          issueCode: "JI000001",
          issueCategory: "bug",
          name: "Test Issue",
          description: "Test Description",
          storyPoints: 3,
          columnId: "column-1",
          isBacklog: false,
        });
      }
    );

    const response = await request(app).post("/api/issues/create-issue").send({
      issueCategory: "bug",
      name: "Test Issue",
      description: "Test Description",
      storyPoints: 3,
      columnId: "column-1",
      isBacklog: false,
    });

    expect(response.status).toBe(201);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(issueController.createIssue).toHaveBeenCalled();
    expect(response.body).toHaveProperty("issueCode");
  });

  it("should route GET / to getAllIssues controller with auth middleware", async () => {
    (issueController.getAllIssues as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json([
          {
            issueCode: "JI000001",
            issueCategory: "bug",
            name: "Test Issue",
            description: "Test Description",
          },
        ]);
      }
    );

    const response = await request(app).get("/api/issues");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(issueController.getAllIssues).toHaveBeenCalled();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should route GET /:issueCode to getIssue controller with auth middleware", async () => {
    (issueController.getIssue as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({
          issueCode: "JI000001",
          issueCategory: "bug",
          name: "Test Issue",
          description: "Test Description",
        });
      }
    );

    const response = await request(app).get("/api/issues/JI000001");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(issueController.getIssue).toHaveBeenCalled();
    expect(response.body.issueCode).toBe("JI000001");
  });

  it("should route PUT /:issueCode to updateIssue controller with auth middleware", async () => {
    (issueController.updateIssue as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({
          issueCode: "JI000001",
          issueCategory: "feature",
          name: "Updated Issue",
          description: "Updated Description",
          storyPoints: 5,
          columnId: "column-2",
          isBacklog: true,
        });
      }
    );

    const response = await request(app).put("/api/issues/JI000001").send({
      issueCategory: "feature",
      name: "Updated Issue",
      description: "Updated Description",
      storyPoints: 5,
      columnId: "column-2",
      isBacklog: true,
    });

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(issueController.updateIssue).toHaveBeenCalled();
    expect(response.body.issueCode).toBe("JI000001");
    expect(response.body.name).toBe("Updated Issue");
  });

  it("should route DELETE /:issueCode to deleteIssue controller with auth middleware", async () => {
    (issueController.deleteIssue as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ message: "Issue deleted successfully" });
      }
    );

    const response = await request(app).delete("/api/issues/JI000001");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(issueController.deleteIssue).toHaveBeenCalled();
    expect(response.body.message).toBe("Issue deleted successfully");
  });
});
