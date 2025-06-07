import express, { Application, NextFunction, Request, Response } from "express";
import request from "supertest";

import projectRoute from "../../src/routes/projectRoute";
import * as projectController from "../../src/controllers/projectController";
import * as authMiddleware from "../../src/middleware/auth";

// ==== MOCKS ====

jest.mock("../../src/controllers/projectController");
jest.mock("../../src/middleware/auth");
jest.mock("../../src/middleware/project");

// ==== TESTS ====

describe("Project Routes", () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/projects", projectRoute);

    (authMiddleware.verifyAccessToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.userId = "test-user-id";
        next();
      }
    );
  });

  it("should route POST /create-project to createProject controller with auth and validation middleware", async () => {
    jest.mock("../../src/middleware/project", () => ({
      validateProjectCreation: [
        (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      ],
    }));

    (projectController.createProject as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(201).json({
          projectId: "JP000001",
          name: "Test Project",
          description: "Test Description",
          createdAt: new Date(),
          lastUpdated: new Date(),
          issues: [],
        });
      }
    );

    const response = await request(app)
      .post("/api/projects/create-project")
      .send({
        name: "Test Project",
        description: "Test Description",
      });

    expect(response.status).toBe(201);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(projectController.createProject).toHaveBeenCalled();
    expect(response.body).toHaveProperty("projectId");
  });

  it("should route GET / to getAllProjects controller with auth middleware", async () => {
    (projectController.getAllProjects as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json([
          {
            projectId: "JP000001",
            name: "Test Project",
            description: "Test Description",
          },
        ]);
      }
    );

    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(projectController.getAllProjects).toHaveBeenCalled();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should route GET /:projectId to getProject controller with auth middleware", async () => {
    (projectController.getProject as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({
          projectId: "JP000001",
          name: "Test Project",
          description: "Test Description",
          issues: [],
        });
      }
    );

    const response = await request(app).get("/api/projects/JP000001");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(projectController.getProject).toHaveBeenCalled();
    expect(response.body.projectId).toBe("JP000001");
  });

  it("should route PUT /:projectId to updateProject controller with auth middleware", async () => {
    (projectController.updateProject as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({
          projectId: "JP000001",
          name: "Updated Project",
          description: "Updated Description",
          lastUpdated: new Date(),
        });
      }
    );

    const response = await request(app).put("/api/projects/JP000001").send({
      name: "Updated Project",
      description: "Updated Description",
    });

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(projectController.updateProject).toHaveBeenCalled();
    expect(response.body.projectId).toBe("JP000001");
    expect(response.body.name).toBe("Updated Project");
  });

  it("should route DELETE /:projectId to deleteProject controller with auth middleware", async () => {
    (projectController.deleteProject as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ message: "Project deleted successfully" });
      }
    );

    const response = await request(app).delete("/api/projects/JP000001");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(projectController.deleteProject).toHaveBeenCalled();
    expect(response.body.message).toBe("Project deleted successfully");
  });
});
