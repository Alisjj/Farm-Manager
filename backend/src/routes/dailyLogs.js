import express from "express";
import dailyLogController from "../controllers/dailyLogController.js";
import {
  validateCreateDailyLog,
  validateUpdateDailyLog,
  validateDailyLogQueries,
  validateId,
} from "../middleware/validation.js";

const router = express.Router();

router.get("/", validateDailyLogQueries, dailyLogController.getAll);

router.post("/", validateCreateDailyLog, dailyLogController.create);

router.put("/:id", validateUpdateDailyLog, dailyLogController.update);

router.delete("/:id", validateId, dailyLogController.delete);

export default router;
