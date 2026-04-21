'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lending', {
      lending_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'book_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      lending_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },

      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });

    // Add CHECK constraint (important)
    await queryInterface.sequelize.query(`
      CREATE TRIGGER lending_due_date_check
      BEFORE INSERT ON lending
      FOR EACH ROW
      WHEN NEW.due_date < NEW.lending_date
      BEGIN
        SELECT RAISE(FAIL, 'due_date cannot be earlier than lending_date');
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lending');
  }
};