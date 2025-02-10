'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AssignmentSubmissions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            assignmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Assignments', // Tên bảng liên kết
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            studentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Students', // Tên bảng liên kết
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            submissionLink: {
                type: Sequelize.STRING, // Đường dẫn tới bài nộp
                allowNull: true,
            },
            grade: {
                type: Sequelize.FLOAT, // Điểm số
                allowNull: true,
            },
            feedback: {
                type: Sequelize.TEXT, // Nhận xét của giáo viên
                allowNull: true,
            },
            isSubmitted: {
                type: Sequelize.BOOLEAN, // Đã nộp bài hay chưa
                defaultValue: false,
                allowNull: false,
            },
            submittedAt: {
                type: Sequelize.DATE, // Thời gian nộp bài
                allowNull: true,
            },
            isLate: {
                type: Sequelize.BOOLEAN, // Bài nộp có bị muộn không
                defaultValue: false,
                allowNull: false,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AssignmentSubmissions');
    },
};
