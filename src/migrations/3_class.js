'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Classes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            semester: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            max_students: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            teacherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Teachers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Classes');
    },
};
