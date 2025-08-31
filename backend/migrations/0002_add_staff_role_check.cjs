"use strict";

module.exports = {
  async up(queryInterface /* , Sequelize */) {
    const dialect = queryInterface.sequelize.options.dialect;

    if (dialect !== "postgres") {
      // nothing to do for sqlite or other dialects
      return;
    }

    try {
      await queryInterface.sequelize.query(`
				DO $$
				BEGIN
					IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
						BEGIN
							ALTER TYPE enum_users_role ADD VALUE 'staff';
						EXCEPTION WHEN duplicate_object THEN
							NULL;
						END;
					END IF;
				END
				$$;
			`);
    } catch (err) {
      console.warn(
        "Could not add enum value enum_users_role.staff:",
        err.message || err
      );
    }

    try {
      await queryInterface.sequelize.query(`
				DO $$
				BEGIN
					IF EXISTS (
						SELECT 1 FROM pg_constraint c
						JOIN pg_class t ON c.conrelid = t.oid
						WHERE c.conname = 'users_role_check'
					) THEN
						ALTER TABLE users DROP CONSTRAINT users_role_check;
					END IF;
				END$$;
			`);

      await queryInterface.sequelize.query(`
				ALTER TABLE users
				ADD CONSTRAINT users_role_check CHECK (role IN ('owner','staff','supervisor'));
			`);
    } catch (err) {
      console.warn(
        "Could not ensure users_role_check constraint:",
        err.message || err
      );
    }
  },

  async down(queryInterface /* , Sequelize */) {
    const dialect = queryInterface.sequelize.options.dialect;
    if (dialect !== "postgres") return;

    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`
      );
    } catch (err) {
      console.warn(
        "Could not drop users_role_check constraint during rollback:",
        err.message || err
      );
    }
  },
};
