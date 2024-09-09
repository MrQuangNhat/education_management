'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      User.hasOne(models.Markdown, { foreignKey: 'teacherId' })
      User.hasMany(models.Schedule, { foreignKey: 'teacherId', as: 'teacherData' })
      User.hasMany(models.Booking, { foreignKey: 'studentId', as: 'studentData' })

    }
  };
  User.init({

    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    studentCode: DataTypes.STRING,
    roleId: DataTypes.STRING,
    class: DataTypes.STRING,
    group: DataTypes.JSON,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};