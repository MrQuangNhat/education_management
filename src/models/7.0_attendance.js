// attendance.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        static associate(models) {
            Attendance.belongsTo(models.Class, { foreignKey: 'classId' });
            Attendance.hasMany(models.AttendanceRecord, { foreignKey: 'attendanceId' });
        }
    }
    Attendance.init(
        {
            classId: DataTypes.INTEGER,
            sessionDate: DataTypes.DATEONLY, // Ngày học
        },
        {
            sequelize,
            modelName: 'Attendance',
        }
    );
    return Attendance;
};
