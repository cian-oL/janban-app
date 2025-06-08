export const generateIssueCode = (count: number) => {
  if (count === 0) {
    return "JI000001";
  }

  const prefix = "JI";
  const suffix = count.toString().padStart(6, "0");
  return `${prefix}${suffix}`;
};

export const checkDatabaseForIssueCode = async (
  model: any,
  issueCode: string
) => {
  const existingIssue = await model.findOne({ issueCode });
  return !!existingIssue;
};
