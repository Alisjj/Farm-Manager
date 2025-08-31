import { body, query, param } from "express-validator";
import { validationResult } from "express-validator";
import DailyLog from "../models/DailyLog.js";
import { BadRequestError } from "../utils/exceptions.js";

export const validateCreateDailyLog = [
  body("logDate")
    .isISO8601()
    .withMessage("logDate must be a valid date (YYYY-MM-DD)"),
  body("houseId")
    .isInt({ min: 1 })
    .withMessage("houseId must be a positive integer"),
  body("logDate").custom(async (value, { req }) => {
    const { houseId } = req.body;
    if (houseId && value) {
      const existingLog = await DailyLog.findOne({
        where: {
          logDate: value,
          houseId: houseId,
        },
      });
      if (existingLog) {
        throw new Error("A daily log for this date and house already exists");
      }
    }
    return true;
  }),
  body("eggsGradeA")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeA must be a non-negative integer"),
  body("eggsGradeB")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeB must be a non-negative integer"),
  body("eggsGradeC")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeC must be a non-negative integer"),
  body("feedGivenKg")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("feedGivenKg must be a non-negative number"),
  body("mortalityCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("mortalityCount must be a non-negative integer"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("notes must be a string with max 1000 characters"),
];

export const validateUpdateDailyLog = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("logDate")
    .optional()
    .isISO8601()
    .withMessage("logDate must be a valid date (YYYY-MM-DD)"),
  body("houseId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("houseId must be a positive integer"),
  body("eggsGradeA")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeA must be a non-negative integer"),
  body("eggsGradeB")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeB must be a non-negative integer"),
  body("eggsGradeC")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeC must be a non-negative integer"),
  body("feedGivenKg")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("feedGivenKg must be a non-negative number"),
  body("mortalityCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("mortalityCount must be a non-negative integer"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("notes must be a string with max 1000 characters"),
];

export const validateDailyLogQueries = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("date must be a valid date (YYYY-MM-DD)"),
  query("houseId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("houseId must be a positive integer"),
];

export const validateCreateCustomer = [
  body("customerName")
    .notEmpty()
    .withMessage("customerName is required")
    .isLength({ max: 200 })
    .withMessage("customerName max 200 chars"),
  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone max 20 chars"),
  body("email").optional().isEmail().withMessage("email must be valid"),
  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("address max 500 chars"),
];

export const validateUpdateCustomer = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("customerName")
    .optional()
    .notEmpty()
    .withMessage("customerName cannot be empty"),
  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone max 20 chars"),
  body("email").optional().isEmail().withMessage("email must be valid"),
  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("address max 500 chars"),
];

export const validateCreateSale = [
  body("saleDate")
    .isISO8601()
    .withMessage("saleDate must be a valid date (YYYY-MM-DD)"),
  body("customerId")
    .isInt({ min: 1 })
    .withMessage("customerId must be a positive integer"),
  body("eggsGradeA")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeA must be a non-negative integer"),
  body("eggsGradeB")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeB must be a non-negative integer"),
  body("eggsGradeC")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeC must be a non-negative integer"),
  body("priceGradeA")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeA must be a non-negative number"),
  body("priceGradeB")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeB must be a non-negative number"),
  body("priceGradeC")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeC must be a non-negative number"),
  body("totalAmount")
    .isFloat({ min: 0 })
    .withMessage("totalAmount must be a positive number"),
  body("paymentMethod")
    .optional()
    .isIn(["Cash", "Transfer", "Check"])
    .withMessage("paymentMethod must be Cash, Transfer, or Check"),
  body("paymentStatus")
    .optional()
    .isIn(["Paid", "Pending", "Partial"])
    .withMessage("paymentStatus must be Paid, Pending, or Partial"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("notes must be a string with max 1000 characters"),
];

export const validateUpdateSale = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("saleDate")
    .optional()
    .isISO8601()
    .withMessage("saleDate must be a valid date (YYYY-MM-DD)"),
  body("customerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("customerId must be a positive integer"),
  body("eggsGradeA")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeA must be a non-negative integer"),
  body("eggsGradeB")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeB must be a non-negative integer"),
  body("eggsGradeC")
    .optional()
    .isInt({ min: 0 })
    .withMessage("eggsGradeC must be a non-negative integer"),
  body("priceGradeA")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeA must be a non-negative number"),
  body("priceGradeB")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeB must be a non-negative number"),
  body("priceGradeC")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("priceGradeC must be a non-negative number"),
  body("totalAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("totalAmount must be a positive number"),
  body("paymentMethod")
    .optional()
    .isIn(["Cash", "Transfer", "Check"])
    .withMessage("paymentMethod must be Cash, Transfer, or Check"),
  body("paymentStatus")
    .optional()
    .isIn(["Paid", "Pending", "Partial"])
    .withMessage("paymentStatus must be Paid, Pending, or Partial"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("notes must be a string with max 1000 characters"),
];

export const validateSalesQueries = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("date must be a valid date (YYYY-MM-DD)"),
  query("customer")
    .optional()
    .isInt({ min: 1 })
    .withMessage("customer must be a positive integer"),
  query("customerId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("customerId must be a positive integer"),
];

export const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

// Feed validators
export const validateCreateFeedRecipe = [
  body("recipeName").notEmpty().withMessage("recipeName is required"),
  body("cornPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("cornPercent must be between 0 and 100"),
  body("soybeanPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("soybeanPercent must be between 0 and 100"),
  body("wheatBranPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("wheatBranPercent must be between 0 and 100"),
  body("limestonePercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("limestonePercent must be between 0 and 100"),
  body("otherIngredients")
    .optional()
    .isObject()
    .withMessage("otherIngredients must be an object"),
];

export const validateCreateFeedBatch = [
  body("batchDate")
    .isISO8601()
    .withMessage("batchDate must be a valid date (YYYY-MM-DD)"),
  body("batchSizeKg")
    .isFloat({ min: 0 })
    .withMessage("batchSizeKg must be a positive number"),
  body("recipeId")
    .isInt({ min: 1 })
    .withMessage("recipeId must be a positive integer"),
];

export const validateAddBatchIngredient = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("batch id must be a positive integer"),
  body("ingredientName").notEmpty().withMessage("ingredientName is required"),
  body("amountKg")
    .isFloat({ min: 0 })
    .withMessage("amountKg must be a positive number"),
  body("costPerKg")
    .isFloat({ min: 0 })
    .withMessage("costPerKg must be a positive number"),
];

// House validators
export const validateCreateHouse = [
  body("houseName")
    .notEmpty()
    .withMessage("houseName is required")
    .isLength({ max: 50 })
    .withMessage("houseName max 50 chars"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("capacity must be a positive integer"),
  body("currentBirdCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("currentBirdCount must be non-negative"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("location max 100 chars"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("description max 500 chars"),
];

export const validateUpdateHouse = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("houseName")
    .optional()
    .notEmpty()
    .withMessage("houseName cannot be empty")
    .isLength({ max: 50 })
    .withMessage("houseName max 50 chars"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("capacity must be a positive integer"),
  body("currentBirdCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("currentBirdCount must be non-negative"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("location max 100 chars"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("description max 500 chars"),
];

// Helper to run validationResult and return 400 if errors
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Labor validators
export const validateCreateLaborer = [
  body("employeeId")
    .optional()
    .isLength({ max: 20 })
    .withMessage("employeeId max 20 chars"),
  body("fullName")
    .notEmpty()
    .withMessage("fullName is required")
    .isLength({ max: 100 })
    .withMessage("fullName max 100 chars"),
  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone max 20 chars"),
  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("address max 500 chars"),
  body("position")
    .notEmpty()
    .withMessage("position is required")
    .isLength({ max: 50 })
    .withMessage("position max 50 chars"),
  body("monthlySalary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("monthlySalary must be non-negative"),
  body("hireDate")
    .optional()
    .isISO8601()
    .withMessage("hireDate must be a valid date"),
  body("isActive").optional().isBoolean(),
  body("emergencyContact")
    .optional()
    .isLength({ max: 100 })
    .withMessage("emergencyContact max 100 chars"),
  body("emergencyPhone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("emergencyPhone max 20 chars"),
];

export const validateUpdateLaborer = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("employeeId")
    .optional()
    .isLength({ max: 20 })
    .withMessage("employeeId max 20 chars"),
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("fullName cannot be empty")
    .isLength({ max: 100 })
    .withMessage("fullName max 100 chars"),
  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone max 20 chars"),
  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("address max 500 chars"),
  body("position")
    .optional()
    .isLength({ max: 50 })
    .withMessage("position max 50 chars"),
  body("monthlySalary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("monthlySalary must be non-negative"),
  body("hireDate")
    .optional()
    .isISO8601()
    .withMessage("hireDate must be a valid date"),
  body("isActive").optional().isBoolean(),
  body("emergencyContact")
    .optional()
    .isLength({ max: 100 })
    .withMessage("emergencyContact max 100 chars"),
  body("emergencyPhone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("emergencyPhone max 20 chars"),
];

export const validateCreateWorkAssignment = [
  body("laborerId")
    .isInt({ min: 1 })
    .withMessage("laborerId is required and must be a positive integer"),
  body("date")
    .isISO8601()
    .withMessage("date is required and must be a valid date"),
  body("tasksAssigned")
    .optional()
    .isArray()
    .withMessage("tasksAssigned must be an array of task strings"),
  body("attendanceStatus")
    .optional()
    .isIn(["present", "absent", "half_day", "late"])
    .withMessage(
      "attendanceStatus must be one of present, absent, half_day, late"
    ),
  body("hours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("hours must be non-negative"),
];

export const validateUpdateWorkAssignment = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("tasksAssigned").optional().isArray(),
  body("attendanceStatus")
    .optional()
    .isIn(["present", "absent", "half_day", "late"]),
  body("hours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("hours must be non-negative"),
];

export const validateGeneratePayroll = [
  param("month_year")
    .notEmpty()
    .withMessage("month_year is required in format YYYY-MM"),
];
