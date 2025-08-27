import express from "express";
import salesController from "../controllers/salesController.js";
import {
  validateCreateSale,
  validateUpdateSale,
  validateSalesQueries,
} from "../middleware/validation.js";

const router = express.Router();

// GET /api/sales?date={date}&customer={id}
router.get("/", validateSalesQueries, salesController.getAll);

// POST /api/sales
router.post("/", validateCreateSale, salesController.create);

// PUT /api/sales/:id
router.put("/:id", validateUpdateSale, salesController.update);

export default router;
