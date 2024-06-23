import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await User.create({ username, email, password });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  res.status(201).json({ success: true, token, user: { id: user._id, username, email } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
});
