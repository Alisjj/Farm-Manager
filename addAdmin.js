import bcrypt from "bcrypt";
import User from "./src/models/User.js";

/**
 * Script to add an admin user to the database.
 */
(async () => {
  try {
    const username = "admin";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      username,
      password: hashedPassword,
      role: "Owner",
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
})();
