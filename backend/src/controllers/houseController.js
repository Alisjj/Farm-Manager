import House from '../models/House.js';
import { BadRequestError } from '../utils/exceptions.js';

const houseController = {
  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      if (!name) throw new BadRequestError('House name is required');

      const house = await House.create({ name, description });
      res.status(201).json({ success: true, data: house });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const houses = await House.findAll();
      res.status(200).json({ success: true, data: houses });
    } catch (error) {
      next(error);
    }
  },
};

export default houseController;
