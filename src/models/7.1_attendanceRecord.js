// attendanceRecord.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AttendanceRecord extends Model {
        static associate(models) {
            AttendanceRecord.belongsTo(models.Attendance, { foreignKey: 'attendanceId' });
            AttendanceRecord.belongsTo(models.Student, { foreignKey: 'studentId' });
        }
    }
    AttendanceRecord.init(
        {
            attendanceId: DataTypes.INTEGER,
            studentId: DataTypes.INTEGER,
            status: DataTypes.ENUM('present', 'absent', 'late'), // Trạng thái điểm danh
            timestamp: DataTypes.DATEONLY, // Thời gian điểm danh
        },
        {
            sequelize,
            modelName: 'AttendanceRecord',
        }
    );
    return AttendanceRecord;
};
