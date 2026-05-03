'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('audit', {
            logId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            level: {
                type: Sequelize.STRING,
                allowNull: true
            },
            eventType: {
                type: Sequelize.STRING,
                allowNull: true
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
            message: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('audit');
    }
};