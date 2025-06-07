import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import {
  signInUser,
  signOutUser,
  generateAccessToken,
} from "../../src/controllers/authController";
import User from "../../src/models/user";

// ==== DEPENDENCY MOCKS ====

jest.mock("../../src/models/user");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    jest.clearAllMocks();
    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    mockRequest = {
      cookies: {},
    };

    // Mock environment variables
    process.env.JWT_ACCESS_TOKEN_KEY = "access_secret";
    process.env.JWT_REFRESH_TOKEN_KEY = "refresh_secret";
  });

  // ==== TESTS ====

  describe("signInUser", () => {
    it("should return 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid" }],
      });
      await signInUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: [{ msg: "Invalid" }],
      });
    });

    it("should return 400 if user not found", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockRequest.body = { racfid: "J000001", password: "testpassword" };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await signInUser(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ racfid: "J000001" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 400 if password does not match", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockRequest.body = { racfid: "J000001", password: "testpassword" };
      const user = {
        _id: "user123",
        racfid: "J000001",
        password: "hashedpassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await signInUser(mockRequest as Request, mockResponse as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith("testpassword", "hashedpassword");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return tokens and user if credentials are valid", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockRequest.body = { racfid: "J000001", password: "testpassword" };
      const user = {
        _id: "user123",
        racfid: "J000001",
        password: "hashedpassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("access_token")
        .mockReturnValueOnce("refresh_token");

      await signInUser(mockRequest as Request, mockResponse as Response);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "refresh_token",
        expect.objectContaining({ httpOnly: true })
      );
      expect(responseObject.json).toHaveBeenCalledWith({
        accessToken: "access_token",
        user,
      });
    });

    it("should return 500 if error occurs", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      mockRequest.body = { racfid: "J000001", password: "testpassword" };
      (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await signInUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("signOutUser", () => {
    it("should clear cookie and return 204", () => {
      signOutUser(mockRequest as Request, mockResponse as Response);

      expect(responseObject.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(responseObject.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe("generateAccessToken", () => {
    it("should return 401 if refresh token is missing", async () => {
      mockRequest.cookies = {};

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });

    it("should return 403 if token is expired", async () => {
      mockRequest.cookies = { refresh_token: "expired_token" };
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback({ message: "jwt expired" }, null);
      });

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(responseObject.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Token expired",
      });
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.cookies = { refresh_token: "invalid_token" };
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback({ message: "invalid signature" }, null);
      });

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(responseObject.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid token",
      });
    });

    it("should return 400 if user not found", async () => {
      mockRequest.cookies = { refresh_token: "valid_token" };
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(null, { userId: "nonexistent" });
      });
      (User.findById as jest.Mock).mockResolvedValue(null);

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith("nonexistent");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return new tokens and user if refresh token is valid", async () => {
      mockRequest.cookies = { refresh_token: "valid_token" };
      const user = {
        _id: "user123",
        racfid: "J000001",
      };
      
      (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
        callback(null, { userId: "user123" });
      });
      (User.findById as jest.Mock).mockResolvedValue(user);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("new_access_token")
        .mockReturnValueOnce("new_refresh_token");

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "new_refresh_token",
        expect.objectContaining({ httpOnly: true })
      );
      expect(responseObject.json).toHaveBeenCalledWith({
        accessToken: "new_access_token",
        user,
      });
    });

    it("should return 500 if error occurs", async () => {
      mockRequest.cookies = { refresh_token: "valid_token" };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Verification error");
      });
      jest.spyOn(console, "log").mockImplementation(() => {});

      await generateAccessToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
});
