import {
  checkDatabaseForIssueCode,
  generateIssueCode,
} from "../../src/utils/issue";

describe("generateIssueCode", () => {
  it("should return 'JI000001 when the count is 0", () => {
    expect(generateIssueCode(0)).toBe("JI000001");
  });

  it("should return the correct format for positive counts", () => {
    expect(generateIssueCode(1)).toBe("JI000001");
    expect(generateIssueCode(42)).toBe("JI000042");
    expect(generateIssueCode(123456)).toBe("JI123456");
  });
});

describe("checkDatabaseForIssueCode", () => {
  const mockModel = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false if no issue with issueCode exists", async () => {
    mockModel.findOne.mockResolvedValue(null);

    const result = await checkDatabaseForIssueCode(mockModel, "JI000001");

    expect(mockModel.findOne).toHaveBeenCalledWith({ issueCode: "JI000001" });
    expect(result).toBe(false);
  });

  it("should return true if issue with issueCode exists", async () => {
    mockModel.findOne.mockResolvedValue({ issueCode: "JI000001" });

    const result = await checkDatabaseForIssueCode(mockModel, "JI000001");

    expect(mockModel.findOne).toHaveBeenCalledWith({ issueCode: "JI000001" });
    expect(result).toBe(true);
  });
});
