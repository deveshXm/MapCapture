import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import multer from "multer";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // if (err instanceof multer.MulterError) {
  //   if (err.code === "LIMIT_FILE_SIZE") {
  //     next(new ApiError(400, "File size limit exceeded. Maximum file size is 5MB."));
  //   } else {
  //     next(new ApiError(400, err.message));
  //   }
  // } else if (err instanceof ApiError) {
  //   next(err);
  // } else {
  //   next(new ApiError(500, "An error occurred during file upload."));
  // }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
