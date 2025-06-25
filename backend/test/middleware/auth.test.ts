import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { verifyAccessToken } from "../../src/middleware/auth";
import User from "../../src/models/user";

// ==== DEPENDENCY MOCKS ====

jest.mock("jsonwebtoken");
jest.mock("../../src/models/user");

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    mockRequest = {
      headers: {},
    };
    mockNext = jest.fn();
  });

  // ==== TESTS ====

  describe("verifyAccessToken", () => {
    it("should return 401 if authorization header is missing", async () => {
      mockRequest.headers = {};

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if authorization header doesn't start with Bearer", async () => {
      mockRequest.headers = { authorization: "Token xyz123" };

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if no user is found with clerkId", async () => {
      mockRequest.headers = { authorization: "Bearer valid_token" };

      const decodedPayload = {
        sub: "clerk123",
      };

      // Mock jwt.decode and finding of no linked user
      jest.spyOn(jwt, "decode").mockReturnValue(decodedPayload);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should extract clerkId from the token and set userId if token is valid", async () => {
      mockRequest.headers = { authorization: "Bearer valid_token" };

      const decodedPayload = {
        sub: "clerk123",
      };

      const mockUser = {
        _id: { toString: () => "user123" },
        clerkId: "clerk123",
      };

      // Mock jwt.decode and finding of user
      jest.spyOn(jwt, "decode").mockReturnValue(decodedPayload);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(jwt.decode).toHaveBeenCalledWith("valid_token");
      expect(User.findOne).toHaveBeenCalledWith({ clerkId: "clerk123" });
      expect(mockRequest.userId).toBe("user123");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.headers = { authorization: "Bearer valid_token" };

      // Mock jwt.decode to throw an error
      jest.spyOn(jwt, "decode").mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      // Mock console.log to prevent test output pollution
      jest.spyOn(console, "log").mockImplementation(() => {});

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
