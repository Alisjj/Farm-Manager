import bcrypt from "bcrypt";
import User from "../models/User.js";
import { ROLES } from "../config/roles.js";

const staffService = {
  list: async () => {
    return User.findAll({
      where: { role: ROLES.SUPERVISOR },
      attributes: ["id", "username", "full_name", "isActive", "created_at"],
    });
  },

  create: async ({ username, password, fullName }) => {
    const existing = await User.findOne({ where: { username } });
    if (existing) throw new Error("Username already exists");
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hash,
      role: ROLES.SUPERVISOR,
      full_name: fullName,
    });
    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      isActive: user.isActive,
    };
  },

  update: async (id, payload) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    if (payload.fullName) payload.full_name = payload.fullName;
    delete payload.fullName;
    await user.update(payload);
    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      isActive: user.isActive,
    };
  },

  remove: async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.destroy();
    return true;
  },
};

export default staffService;
