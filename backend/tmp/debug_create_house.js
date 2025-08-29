import { autoMigrate, sequelize } from "../src/utils/database.js";
import House from "../src/models/House.js";

(async () => {
  try {
    await autoMigrate();
    const h = await House.create({ name: "Debug House" });
    console.log("Created house", h.id);
    await sequelize.close();
  } catch (err) {
    console.error("Error creating house:", err);
    process.exit(1);
  }
})();
