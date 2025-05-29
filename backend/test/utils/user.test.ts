import { hashPassword, generateRacfid, checkDatabaseForRacfid } from "../../src/utils/user";
import bcrypt from "bcryptjs";

describe("hashPassword", () => {
  it("should hash a password and verify with bcrypt.compare", async () => {
    const plain = "mysecret";
    const hash = await hashPassword(plain, 10);
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe(plain);
    // bcrypt.compare should validate the hash
    const isMatch = await bcrypt.compare(plain, hash);
    expect(isMatch).toBe(true);
  });
});

describe("generateRacfid", () => {
  it("should return 'J000001' when count is 0", () => {
    expect(generateRacfid(0)).toBe("J000001");
  });

  it("should return correct format for positive counts", () => {
    expect(generateRacfid(1)).toBe("J000001");
    expect(generateRacfid(42)).toBe("J000042");
    expect(generateRacfid(123456)).toBe("J123456");
  });
});

describe("checkDatabaseForRacfid", () => {
  const mockModel = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false if no user with racfid exists", async () => {
    mockModel.findOne.mockResolvedValue(null);

    const result = await checkDatabaseForRacfid(mockModel, "J000001");

    expect(mockModel.findOne).toHaveBeenCalledWith({ racfid: "J000001" });
    expect(result).toBe(false);
  });

  it("should return true if user with racfid exists", async () => {
    mockModel.findOne.mockResolvedValue({ racfid: "J000001" });

    const result = await checkDatabaseForRacfid(mockModel, "J000001");

    expect(mockModel.findOne).toHaveBeenCalledWith({ racfid: "J000001" });
    expect(result).toBe(true);
  });
});
