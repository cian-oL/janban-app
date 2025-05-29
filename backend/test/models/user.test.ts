import User from "../../src/models/user";
import * as userUtils from "../../src/utils/user";

// Mock hashPassword to return a predictable string immediately
jest
  .spyOn(userUtils, "hashPassword")
  .mockImplementation(async (pw: string) => `hashed_${pw}`);

describe("User model", () => {
  it("should set the password to the mocked hash before saving", async () => {
    const plain = "supersecret";
    const user = new User({
      racfid: "J000001",
      password: plain,
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      lastUpdated: new Date(),
    });

    // Mock save (no DB needed)
    user.save = jest.fn().mockImplementation(async function (this: any) {
      if (this.isModified && this.isModified("password")) {
        this.password = await userUtils.hashPassword(this.password, 10);
      }
      return this;
    });

    await user.save();

    expect(user.password).toBe(`hashed_${plain}`);
  });
});
