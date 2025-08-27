import laborService from "../services/laborService.js";

const laborController = {
  getAll: async (req, res, next) => {
    try {
      const data = await laborService.getAllLaborers();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const l = await laborService.createLaborer(req.body);
      res.status(201).json(l);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await laborService.updateLaborer(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await laborService.deleteLaborer(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  // Work assignments
  getAssignments: async (req, res, next) => {
    try {
      const rows = await laborService.getWorkAssignments(req.query);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  createAssignment: async (req, res, next) => {
    try {
      const a = await laborService.createWorkAssignment(req.body);
      res.status(201).json(a);
    } catch (err) {
      next(err);
    }
  },

  updateAssignment: async (req, res, next) => {
    try {
      const u = await laborService.updateWorkAssignment(
        req.params.id,
        req.body
      );
      res.json(u);
    } catch (err) {
      next(err);
    }
  },

  // Payroll
  getPayrollMonth: async (req, res, next) => {
    try {
      const data = await laborService.getPayrollForMonth(req.params.month_year);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  generatePayroll: async (req, res, next) => {
    try {
      const created = await laborService.generatePayrollForMonth(
        req.params.month_year
      );
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  updatePayroll: async (req, res, next) => {
    try {
      const updated = await laborService.updatePayroll(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  payrollSummary: async (req, res, next) => {
    try {
      const s = await laborService.getPayrollSummary(req.query.year);
      res.json(s);
    } catch (err) {
      next(err);
    }
  },
};

export default laborController;
