'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('favorites', {
            favoriteId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
            addedAt: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('favorites');
    }
};