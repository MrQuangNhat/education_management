'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ClassStudents', {
            classId: {
                type: Sequelize.INTEGER,
                references: { model: 'Classes', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            studentId: {
                type: Sequelize.INTEGER,
                references: { model: 'Students', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ClassStudents');
    },
};
