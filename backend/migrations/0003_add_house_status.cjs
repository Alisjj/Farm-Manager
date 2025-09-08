/**
 * Add status field to houses table
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column with enum values
    await queryInterface.addColumn("houses", "status", {
      type: Sequelize.ENUM("active", "maintenance", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove status column (and its enum type)
    await queryInterface.removeColumn("houses", "status");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_houses_status";'
    );
  },
};
