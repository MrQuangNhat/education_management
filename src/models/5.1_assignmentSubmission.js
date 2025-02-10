'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AssignmentSubmission extends Model {
        static associate(models) {
            // Liên kết với bảng Assignment
            AssignmentSubmission.belongsTo(models.Assignment, { foreignKey: 'assignmentId' });
            // Liên kết với bảng Student
            AssignmentSubmission.belongsTo(models.Student, { foreignKey: 'studentId' });
        }
    }
    AssignmentSubmission.init(
        {
            assignmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            studentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            submissionLink: {
                type: DataTypes.STRING, // Đường dẫn tới bài nộp
                allowNull: true, // Có thể để trống nếu chưa nộp
            },
            grade: {
                type: DataTypes.FLOAT, // Điểm số
                allowNull: true,
            },
            feedback: {
                type: DataTypes.TEXT, // Nhận xét của giáo viên
                allowNull: true,
            },
            isSubmitted: {
                type: DataTypes.BOOLEAN, // Đã nộp bài hay chưa
                defaultValue: false,
            },
            submittedAt: {
                type: DataTypes.DATE, // Thời gian nộp bài
                allowNull: true,
            },
            isLate: {
                type: DataTypes.BOOLEAN, // Bài nộp có bị muộn không
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'AssignmentSubmission',
        }
    );

    return AssignmentSubmission;
};
