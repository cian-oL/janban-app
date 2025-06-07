import express, { Application, NextFunction, Request, Response } from "express";
import request from "supertest";

import authRoute from "../../src/routes/authRoute";
import * as authController from "../../src/controllers/authController";
import * as authMiddleware from "../../src/middleware/auth";

// ==== MOCKS ====

jest.mock("../../src/controllers/authController");
jest.mock("../../src/middleware/auth");

// ==== TESTS ====

describe("Auth Routes", () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/auth", authRoute);

    (authMiddleware.verifyAccessToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        req.userId = "test-user-id";
        next();
      }
    );
  });

  it("should route POST /sign-in to signInUser controller with validation middleware", async () => {
    jest.mock("../../src/middleware/auth", () => ({
      validateSignIn: [
        (req: Request, res: Response, next: NextFunction) => {
          next();
        },
      ],
    }));

    (authController.signInUser as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ accessToken: "test-token", user: { id: "test-user-id" } });
      }
    );

    const response = await request(app).post("/api/auth/sign-in").send({
      racfid: "J123456",
      password: "Test@123"
    });

    expect(response.status).toBe(200);
    expect(authController.signInUser).toHaveBeenCalled();
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("user");
  });

  it("should route POST /sign-out to signOutUser controller with auth middleware", async () => {
    (authController.signOutUser as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(204).send();
      }
    );

    const response = await request(app).post("/api/auth/sign-out");

    expect(response.status).toBe(204);
    expect(authMiddleware.verifyAccessToken).toHaveBeenCalled();
    expect(authController.signOutUser).toHaveBeenCalled();
  });

  it("should route GET /access-token to generateAccessToken controller", async () => {
    (authController.generateAccessToken as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ accessToken: "new-test-token", user: { id: "test-user-id" } });
      }
    );

    const response = await request(app).get("/api/auth/access-token");

    expect(response.status).toBe(200);
    expect(authController.generateAccessToken).toHaveBeenCalled();
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("user");
  });
});
