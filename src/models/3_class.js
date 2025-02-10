'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        static associate(models) {
            // Mối quan hệ 1-nhiều với Teacher
            Class.belongsTo(models.Teacher, { foreignKey: 'teacherId' });

            // Mối quan hệ 1-nhiều với Schedule, AbsenceRequest, Attendance
            Class.hasMany(models.Schedule, { foreignKey: 'classId' });
            Class.hasMany(models.AbsenceRequest, { foreignKey: 'classId' });
            Class.hasMany(models.Attendance, { foreignKey: 'classId' });

            // Mối quan hệ nhiều-nhiều với Student thông qua ClassStudent
            Class.belongsToMany(models.Student, {
                through: 'ClassStudent',
                foreignKey: 'classId',
                otherKey: 'studentId', // Chỉ định khóa ngoại của Student trong bảng phụ
            });
        }
    }

    Class.init(
        {
            name: DataTypes.STRING,
            semester: DataTypes.STRING,
            max_students: DataTypes.INTEGER,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            teacherId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Class',
        }
    );

    return Class;
};
