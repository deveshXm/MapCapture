import Joi from "joi";
import ApiError from "../utils/ApiError";

const annotationSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90).messages({
    "number.base": "Latitude must be a number.",
    "any.required": "Latitude is required.",
    "number.min": "Latitude must be between -90 and 90 degrees.",
    "number.max": "Latitude must be between -90 and 90 degrees.",
  }),
  longitude: Joi.number().required().min(-180).max(180).messages({
    "number.base": "Longitude must be a number.",
    "any.required": "Longitude is required.",
    "number.min": "Longitude must be between -180 and 180 degrees.",
    "number.max": "Longitude must be between -180 and 180 degrees.",
  }),
  note: Joi.string().required().messages({
    "string.base": "Note must be a string.",
    "any.required": "Note is required.",
  }),
}).allow(null);

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
      const [lng, lat] = value;
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
  annotation: annotationSchema.optional().allow(null).messages({
    "object.base": "Annotation must be an object.",
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
