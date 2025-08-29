import { body, param } from "express-validator";

export const validateFeedEstimate = [
  body("recipe").notEmpty().withMessage("recipe is required"),
  body("batchSizeKg").isNumeric().withMessage("batchSizeKg must be a number"),
  body("ingredientPrices").isObject().optional(),
];
