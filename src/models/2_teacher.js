'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {
            Teacher.belongsTo(models.User, { foreignKey: 'userId' });
            Teacher.hasMany(models.Class, { foreignKey: 'teacherId' });
        }
    }
    Teacher.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Teacher',
        }
    );
    return Teacher;
};
