import express from "express";
import customerController from "../controllers/customerController.js";
import {
  validateCreateCustomer,
  validateUpdateCustomer,
  handleValidation
} from "../middleware/validation.js";

const router = express.Router();

// GET /api/customers
router.get("/", customerController.getAll);

// POST /api/customers
router.post("/", validateCreateCustomer, handleValidation, customerController.create);

// PUT /api/customers/:id
router.put("/:id", validateUpdateCustomer, handleValidation, customerController.update);

export default router;
