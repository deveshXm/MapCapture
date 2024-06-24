import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { validateLogin, validateRegister } from "../validators/userValidators";

export const register = asyncHandler(async (req: Request, res: Response) => {
  validateRegister(req.body);
  const { username, email, password } = req.body;
  const { token, user } = await registerUser(username, email, password);
  res.status(201).json({ success: true, token, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  validateLogin(req.body);
  const { email, password } = req.body;
  const { token, user } = await loginUser(email, password);
  res.status(200).json({ success: true, token, user });
});
