import jwt from "jsonwebtoken";
import User from "../models/User";
import ApiError from "../utils/ApiError";

export const registerUser = async (username: string, email: string, password: string) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({ username, email, password });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return { token, user: { id: user._id, username, email } };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return { token, user: { id: user._id, username: user.username, email: user.email } };
};
