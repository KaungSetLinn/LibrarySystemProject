'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            notificationId: {
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
            type: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notifications');
    }
};