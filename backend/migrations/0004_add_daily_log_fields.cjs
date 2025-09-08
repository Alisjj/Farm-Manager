"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("daily_logs");

    if (!table.cracked_eggs) {
      await queryInterface.addColumn("daily_logs", "cracked_eggs", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.feed_type) {
      await queryInterface.addColumn("daily_logs", "feed_type", {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("daily_logs");

    if (table.cracked_eggs) {
      await queryInterface.removeColumn("daily_logs", "cracked_eggs");
    }

    if (table.feed_type) {
      await queryInterface.removeColumn("daily_logs", "feed_type");
    }
  },
};
