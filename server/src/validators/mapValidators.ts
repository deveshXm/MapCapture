import Joi from "joi";
import ApiError from "../utils/ApiError";

const mapDataSchema = Joi.object({
  center: Joi.array()
    .items(
      Joi.number().required().messages({
        "number.base": "Center coordinates must be numbers.",
        "any.required": "Center coordinates are required.",
      })
    )
    .length(2)
    .required()
    .custom((value, helpers) => {
      const [lat, lng] = value;
      if (lat < -90 || lat > 90) {
        return helpers.error("any.invalid", { message: "Latitude must be between -90 and 90 degrees." });
      }
      if (lng < -180 || lng > 180) {
        return helpers.error("any.invalid", { message: "Longitude must be between -180 and 180 degrees." });
      }
      return value;
    })
    .messages({
      "array.length": "Center must be an array of two numbers.",
      "any.required": "Center is required.",
      "any.invalid": "{{#message}}",
    }),
  zoom: Joi.number().required().messages({
    "number.base": "Zoom must be a number.",
    "any.required": "Zoom is required.",
  }),
  capturedImage: Joi.string().required().messages({
    "string.base": "Captured image must be a string.",
    "any.required": "Captured image is required.",
  }),
  annotation: Joi.string().optional().allow(null, "").messages({
    "string.base": "Annotation must be a string.",
  }),
  geohash: Joi.string().optional().allow(null, "").messages({
    "string.base": "Geohash must be a string.",
  }),
});

export const validateMapData = (data: any) => {
  const { error } = mapDataSchema.validate(data);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
};
