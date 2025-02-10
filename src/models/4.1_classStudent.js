'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ClassStudent extends Model { }

    ClassStudent.init(
        {
            classId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Classes', // Tên bảng của Class
                    key: 'id',
                },
                allowNull: false,
            },
            studentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Students', // Tên bảng của Student
                    key: 'id',
                },
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'ClassStudent',
            tableName: 'ClassStudents', // Tên bảng trong cơ sở dữ liệu
            timestamps: false, // Bảng này không có timestamp
        }
    );

    return ClassStudent;
};
