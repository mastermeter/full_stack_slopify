import bcrypt from "bcrypt";

const comparePassword = ({ user, password }) => {
  if (!user?.password) return false;
  return bcrypt.compare(password, user.password);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const getCookieOptions = () => {
    return {
        httpOnly : true,
        secure: process.env.DEV_MODE ? false : true,
        sameSite: process.env.DEV_MODE ? "Lax" : "None",
    };
};

export { comparePassword, hashPassword, getCookieOptions };


