/**
 * Add status field to Houses table
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column with enum values
    await queryInterface.addColumn("Houses", "status", {
      type: Sequelize.ENUM("active", "maintenance", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove status column (and its enum type)
    await queryInterface.removeColumn("Houses", "status");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Houses_status";'
    );
  },
};
