'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lendings', {
      lendingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'bookId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      lendingDate: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },

      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      returnDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });

    // Add CHECK constraint (important)
    await queryInterface.sequelize.query(`
      CREATE TRIGGER lending_due_date_check
      BEFORE INSERT ON lendings
      FOR EACH ROW
      WHEN NEW.dueDate < NEW.lendingDate
      BEGIN
        SELECT RAISE(FAIL, 'dueDate cannot be earlier than lendingDate');
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lendings');
  }
};