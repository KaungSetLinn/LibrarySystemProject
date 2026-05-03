'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('history', {
            historyId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            bookId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'books',
                    key: 'bookId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            eventType: {
                type: Sequelize.STRING,
                allowNull: true
            },
            eventAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            detail: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('history');
    }
};