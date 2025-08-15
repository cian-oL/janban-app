import express, { Application, NextFunction, Request, Response } from "express";
import request from "supertest";

import userRoute from "../../src/routes/userRoute";
import * as userController from "../../src/controllers/userController";
import * as authMiddleware from "../../src/middleware/auth";

// ==== MOCKS ====

jest.mock("../../src/controllers/userController");
jest.mock("../../src/middleware/auth");

// ==== TESTS ====

describe("User Routes", () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/user", userRoute);

    (authMiddleware.verifyAccessToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.userId = "test-user-id";
        next();
      }
    );
  });

  it("should route POST /register to registerUser controller with validation middleware", async () => {
    jest.mock("../../src/middleware/auth", () => ({
      validateRegistration: [
        (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      ],
    }));

    (userController.registerUser as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(201).json({ success: true });
      }
    );

    const response = await request(app).post("/api/user/register").send({
      clerkId: "clerk123",
      email: "test@example.com",
      name: "John Doe",
    });

    expect(response.status).toBe(201);
    expect(userController.registerUser).toHaveBeenCalled();
  });

  it("should route GET /users to getAllUsers controller with auth middleware", async () => {
    (userController.getAllUsers as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ id: req.userId });
      }
    );

    const response = await request(app).get("/api/user/users");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(userController.getAllUsers).toHaveBeenCalled();
    expect(response.body.id).toBe("test-user-id");
  });

  it("should route GET /profile to getUser controller with auth middleware", async () => {
    (userController.getUser as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ id: req.userId });
      }
    );

    const response = await request(app).get("/api/user/profile");

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(userController.getUser).toHaveBeenCalled();
    expect(response.body.id).toBe("test-user-id");
  });

  it("should route PATCH /profile to updateUser controller with auth middleware", async () => {
    (userController.updateUser as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ success: true });
      }
    );

    const response = await request(app)
      .patch("/api/user/profile")
      .send({ name: "Test User" });

    expect(response.status).toBe(200);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(userController.updateUser).toHaveBeenCalled();
  });
});
