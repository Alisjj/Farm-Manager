import express from "express";
import laborController from "../controllers/laborController.js";
import {
  validateCreateLaborer,
  validateUpdateLaborer,
  validateCreateWorkAssignment,
  validateUpdateWorkAssignment,
  validateGeneratePayroll,
  handleValidation,
} from "../middleware/validation.js";

const router = express.Router();

// Laborers
router.get("/laborers", laborController.getAll);
router.post(
  "/laborers",
  validateCreateLaborer,
  handleValidation,
  laborController.create
);
router.put(
  "/laborers/:id",
  validateUpdateLaborer,
  handleValidation,
  laborController.update
);
router.delete("/laborers/:id", laborController.delete);

// Work assignments
router.get("/work-assignments", laborController.getAssignments);
router.post(
  "/work-assignments",
  validateCreateWorkAssignment,
  handleValidation,
  laborController.createAssignment
);
router.put(
  "/work-assignments/:id",
  validateUpdateWorkAssignment,
  handleValidation,
  laborController.updateAssignment
);

// Payroll
router.get("/payroll/:month_year", laborController.getPayrollMonth);
router.post(
  "/payroll/generate/:month_year",
  validateGeneratePayroll,
  handleValidation,
  laborController.generatePayroll
);
router.put("/payroll/:id", laborController.updatePayroll);
router.get("/payroll/summary", laborController.payrollSummary);

export default router;
