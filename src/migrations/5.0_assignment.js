'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Assignments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: Sequelize.TEXT,
            teacherId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Teachers',
                    key: 'id',
                },
            },
            classId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Classes',
                    key: 'id',
                },
            },
            deadline: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Assignments');
    },
};
