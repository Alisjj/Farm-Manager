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
import { authenticate, authorize } from "../middleware/auth.js";
import { PERMISSIONS } from "../config/roles.js";

const router = express.Router();

// Laborers
router.get(
  "/laborers",
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.LABORERS.READ),
  laborController.getAll
);
router.post(
  "/laborers",
  validateCreateLaborer,
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.LABORERS.CREATE),
  laborController.create
);
router.put(
  "/laborers/:id",
  validateUpdateLaborer,
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.LABORERS.UPDATE),
  laborController.update
);
router.delete(
  "/laborers/:id",
  authenticate,
  authorize(PERMISSIONS.LABORERS.DELETE),
  laborController.delete
);

// Work assignments
router.get(
  "/work-assignments",
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.WORK_ASSIGNMENTS.READ),
  laborController.getAssignments
);
router.post(
  "/work-assignments",
  validateCreateWorkAssignment,
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.WORK_ASSIGNMENTS.CREATE),
  laborController.createAssignment
);
router.put(
  "/work-assignments/:id",
  validateUpdateWorkAssignment,
  handleValidation,
  authenticate,
  authorize(PERMISSIONS.WORK_ASSIGNMENTS.UPDATE),
  laborController.updateAssignment
);

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
