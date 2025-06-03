import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import {
  registerUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../../src/controllers/userController";
import * as racfidUtils from "../../src/utils/user";
import User from "../../src/models/user";

// ==== DEPENDENCY MOCKS ====

jest.mock("../../src/models/user");
jest.mock("jsonwebtoken");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("User Controller", () => {
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
    };
    mockResponse = responseObject;
    mockRequest = {};
  });

  // ==== TESTS ====

  describe("registerUser", () => {
    it("should return 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid" }],
      });
      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: [{ msg: "Invalid" }],
      });
    });

    it("should return 409 if user already exists", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (User.find as jest.Mock).mockResolvedValue([
        { email: "test@example.com" },
      ]);
      mockRequest.body = { email: "test@example.com" };
      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("should create user, generate tokens, and return 201", async () => {
      const newUser = {
        _id: "user123",
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        confirmPassword: "testpassword",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (User.find as jest.Mock).mockResolvedValue([]);

      // Mock User.findOne to return null (user not found)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => newUser);

      // Simulate checkDatabaseForRacfid to return false
      jest
        .spyOn(racfidUtils, "checkDatabaseForRacfid")
        .mockResolvedValue(false);

      // Simulate accessToken and refreshToken generation
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("access")
        .mockReturnValueOnce("refresh");

      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(newUser.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "refresh",
        expect.objectContaining({ httpOnly: true })
      );
      expect(responseObject.json).toHaveBeenCalledWith({
        accessToken: "access",
        user: newUser,
      });
    });

    it("should regenerate racfid if duplicate is found", async () => {
      const newUser = {
        _id: "user123",
        racfid: "J000002",
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        confirmPassword: "testpassword",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (User.find as jest.Mock).mockResolvedValue([]);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => newUser);

      // Simulate checkDatabaseForRacfid: first call returns true (duplicate), second returns false (unique)
      jest
        .spyOn(racfidUtils, "checkDatabaseForRacfid")
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      // Simulate accessToken and refreshToken generation
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("access")
        .mockReturnValueOnce("refresh");

      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(newUser.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject.cookie).toHaveBeenCalledWith(
        "refresh_token",
        "refresh",
        expect.objectContaining({ httpOnly: true })
      );
      expect(responseObject.json).toHaveBeenCalledWith({
        accessToken: "access",
        user: newUser,
      });
      // The racfid should have been regenerated (checkDatabaseForRacfid called twice)
      expect(racfidUtils.checkDatabaseForRacfid).toHaveBeenCalledTimes(2);
    });

    it("should return 500 if error occurs", async () => {
      mockRequest.body = {
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        confirmPassword: "testpassword",
      };

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
      (User.find as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [{ _id: "user1" }, { _id: "user2" }];
      (User.find as jest.Mock).mockResolvedValue(users);

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(users);
    });
    it("should return 500 if error occurs", async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error("Database error"));
      jest.spyOn(console, "log").mockImplementation(() => {});

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("getUser", () => {
    it("should return user if found", async () => {
      const user = { _id: "user123" };
      mockRequest.userId = "user123";
      (User.findById as jest.Mock).mockResolvedValue(user);

      await getUser(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if user not found", async () => {
      mockRequest.userId = "nonexistent";
      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUser(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith("nonexistent");
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("should return 500 if error occurs", async () => {
      mockRequest.userId = "user123";
      (User.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      jest.spyOn(console, "log").mockImplementation(() => {});

      await getUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("updateUser", () => {
    it("should update and return user if found", async () => {
      const user = {
        _id: "user123",
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "John Doe",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.userId = "user123";
      mockRequest.body = {
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "New Name",
        confirmPassword: "testpassword",
      };

      (User.findById as jest.Mock).mockResolvedValue(user);

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(user.racfid).toBe("J000001");
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("New Name");
      expect(user.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if user not found", async () => {
      mockRequest.userId = "nonexistent";
      mockRequest.body = {
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "New Name",
        confirmPassword: "testpassword",
      };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith("nonexistent");
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("should return 500 if error occurs", async () => {
      mockRequest.userId = "user123";
      mockRequest.body = {
        racfid: "J000001",
        password: "testpassword",
        email: "test@example.com",
        name: "New Name",
        confirmPassword: "testpassword",
      };

      (User.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      jest.spyOn(console, "log").mockImplementation(() => {});

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
});
