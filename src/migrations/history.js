'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('history', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,

            },

            teacherId: {
                type: Sequelize.INTEGER
            },
            studentId: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.DATE
            },
            description: {
                type: Sequelize.TEXT
            },
            files: {
                type: Sequelize.TEXT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('history');
    }
};