'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Materials', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            classId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Classes',
                    key: 'id',
                },
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: Sequelize.TEXT,
            link: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('lecture', 'extra_reading', 'video'),
                allowNull: false,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Materials');
    },
};
