import express from "express";
import houseController from "../controllers/houseController.js";
import {
  validateCreateHouse,
  validateUpdateHouse,
  validateId,
  handleValidation
} from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, houseController.getAll);

router.get("/:id", authenticate, validateId, handleValidation, houseController.getById);

router.post("/", authenticate, validateCreateHouse, handleValidation, houseController.create);

router.put("/:id", authenticate, validateUpdateHouse, handleValidation, houseController.update);

router.delete("/:id", authenticate, validateId, handleValidation, houseController.delete);

export default router;
