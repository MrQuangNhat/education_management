'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Một User có thể là Student hoặc Teacher
            User.hasOne(models.Student, { foreignKey: 'userId' });
            User.hasOne(models.Teacher, { foreignKey: 'userId' });
            User.hasMany(models.Response, {
                foreignKey: 'userId',
                as: 'responses', // Alias phải khớp với alias trong Response
            });
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            avatar: DataTypes.STRING,
            role: DataTypes.ENUM('0', '1'),
            active: DataTypes.ENUM('0', '1'),
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
