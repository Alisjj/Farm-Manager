import express from "express";
import customerController from "../controllers/customerController.js";
import {
  validateCreateCustomer,
  validateUpdateCustomer,
} from "../middleware/validation.js";

const router = express.Router();

// GET /api/customers
router.get("/", customerController.getAll);

// POST /api/customers
router.post("/", validateCreateCustomer, customerController.create);

// PUT /api/customers/:id
router.put("/:id", validateUpdateCustomer, customerController.update);

export default router;
