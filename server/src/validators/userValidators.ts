import Joi from "joi";
import ApiError from "../utils/ApiError";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateRegister = (data: any) => {
  const { error } = registerSchema.validate(data);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
};

export const validateLogin = (data: any) => {
  const { error } = loginSchema.validate(data);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
};