'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AbsenceRequests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            studentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Students',
                    key: 'id',
                },
                onDelete: 'CASCADE', // Xóa yêu cầu nghỉ khi xóa sinh viên
            },
            classId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Classes',
                    key: 'id',
                },
                onDelete: 'CASCADE', // Xóa yêu cầu nghỉ khi xóa lớp học
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'approved', 'rejected'),
                defaultValue: 'pending',
            },
            requestDate: {
                type: Sequelize.DATEONLY,
            },
            responseTime: {
                type: Sequelize.DATEONLY,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AbsenceRequests');
    },
};
