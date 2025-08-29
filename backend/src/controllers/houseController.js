import House from '../models/House.js';
import { BadRequestError } from '../utils/exceptions.js';

const houseController = {
  create: async (req, res, next) => {
    try {
      const { houseName, capacity, currentBirdCount, location, description } = req.body;
      if (!houseName) throw new BadRequestError('House name is required');

      if (!houseName) throw new BadRequestError('House name is required');

      const house = await House.create({
        houseName,
        capacity: capacity || 1000,
        currentBirdCount: currentBirdCount || 0,
        location,
        description
      });
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

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const house = await House.findByPk(id);

      if (!house) {
        return res.status(404).json({ success: false, message: 'House not found' });
      }

      res.status(200).json({ success: true, data: house });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updatedCount] = await House.update(updates, { where: { id } });

      if (updatedCount === 0) {
        return res.status(404).json({ success: false, message: 'House not found' });
      }

      const updatedHouse = await House.findByPk(id);
      res.status(200).json({ success: true, data: updatedHouse });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCount = await House.destroy({ where: { id } });

      if (deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'House not found' });
      }

      res.status(204).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

export default houseController;
