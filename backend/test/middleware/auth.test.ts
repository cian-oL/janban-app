import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { verifyAccessToken } from "../../src/middleware/auth";

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

    // Mock environment variables
    process.env.JWT_ACCESS_TOKEN_KEY = "access_secret";
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

    it("should return 403 if token is expired", async () => {
      mockRequest.headers = { authorization: "Bearer expired_token" };

      // Mock jwt.verify to simulate expired token
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((_token, _secret, callback: any) => {
          callback({ message: "jwt expired" }, null);
          return {} as any;
        });

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Token expired",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.headers = { authorization: "Bearer invalid_token" };

      // Mock jwt.verify to simulate invalid token
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((_token, _secret, callback: any) => {
          callback({ message: "invalid signature" }, null);
          return {} as any;
        });

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid token",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should set userId and call next() if token is valid", async () => {
      mockRequest.headers = { authorization: "Bearer valid_token" };

      // Mock jwt.verify to simulate valid token
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((_token, _secret, callback: any) => {
          callback(null, { userId: "user123" });
          return {} as any;
        });

      await verifyAccessToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockRequest.userId).toBe("user123");
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.headers = { authorization: "Bearer valid_token" };

      // Mock jwt.verify to throw an error
      jest.spyOn(jwt, "verify").mockImplementation(() => {
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
