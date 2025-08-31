import { validationResult } from "express-validator";
import staffService from "../services/staffService.js";

const staffController = {
  listStaff: async (req, res, next) => {
    try {
      const staff = await staffService.list();
      res.json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  },

  createStaff: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { username, password, fullName } = req.body;
      const user = await staffService.create({ username, password, fullName });
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  updateStaff: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const updated = await staffService.update(id, payload);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  deleteStaff: async (req, res, next) => {
    try {
      const { id } = req.params;
      await staffService.remove(id);
      res.json({ success: true, message: "Staff deleted" });
    } catch (err) {
      next(err);
    }
  },
};

export default staffController;
