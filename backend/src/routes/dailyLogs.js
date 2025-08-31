import express from "express";
import dailyLogController from "../controllers/dailyLogController.js";
import {
  validateCreateDailyLog,
  validateUpdateDailyLog,
  validateDailyLogQueries,
  validateId,
  handleValidation,
} from "../middleware/validation.js";

const router = express.Router();

router.get(
  "/",
  validateDailyLogQueries,
  handleValidation,
  dailyLogController.getAll
);

router.get("/:id", validateId, handleValidation, dailyLogController.getById);

router.post(
  "/",
  validateCreateDailyLog,
  handleValidation,
  dailyLogController.create
);

router.put(
  "/:id",
  validateUpdateDailyLog,
  handleValidation,
  dailyLogController.update
);

router.delete("/:id", validateId, handleValidation, dailyLogController.delete);

export default router;
