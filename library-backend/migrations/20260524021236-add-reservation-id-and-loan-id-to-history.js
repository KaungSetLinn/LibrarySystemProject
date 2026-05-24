'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');

        await queryInterface.addColumn('history', 'reservationId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'reservations', key: 'reservationId' },
        });

        await queryInterface.addColumn('history', 'loanId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'loans', key: 'loanId' },
        });

        // Backfill reservationId for CANCEL events
        await queryInterface.sequelize.query(`
            UPDATE history
            SET reservationId = CAST(
                SUBSTR(
                    detail,
                    INSTR(detail, 'reservationId=') + LENGTH('reservationId='),
                    INSTR(SUBSTR(detail, INSTR(detail, 'reservationId=') + LENGTH('reservationId=')), ' ') - 1
                ) AS INTEGER
            )
            WHERE eventType = 'CANCEL'
            AND detail LIKE '%reservationId=%';
        `);

        // Backfill loanId for LOAN / RETURN events
        await queryInterface.sequelize.query(`
            UPDATE history
            SET loanId = CAST(JSON_EXTRACT(detail, '$.loanId') AS INTEGER)
            WHERE eventType IN ('LOAN', 'RETURN');
        `);

        await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
        await queryInterface.removeColumn('history', 'reservationId');
        await queryInterface.removeColumn('history', 'loanId');
        await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    },
};