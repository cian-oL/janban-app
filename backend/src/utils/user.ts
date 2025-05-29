import bcrypt from "bcryptjs";

export const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};

export const generateRacfid = (count: number) => {
  if (count === 0) {
    return "J000001";
  }

  const prefix = "J";
  const suffix = count.toString().padStart(6, "0");
  return `${prefix}${suffix}`;
};

export const checkDatabaseForRacfid = async (model: any, racfid: string) => {
  const user = await model.findOne({ racfid });
  return !!user;
};
