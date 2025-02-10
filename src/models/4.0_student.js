'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // Mối quan hệ 1-nhiều với User
            Student.belongsTo(models.User, { foreignKey: 'userId' });

            // Mối quan hệ 1-nhiều với AbsenceRequest
            Student.hasMany(models.AbsenceRequest, { foreignKey: 'studentId' });

            // Mối quan hệ nhiều-nhiều với Class thông qua ClassStudent
            Student.belongsToMany(models.Class, {
                through: 'ClassStudent',
                foreignKey: 'studentId',
                otherKey: 'classId', // Chỉ định khóa ngoại của Class trong bảng phụ
            });
        }
    }

    Student.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Student',
        }
    );

    return Student;
};
