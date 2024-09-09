'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User,
                { foreignKey: 'studentId', targetKey: 'id', as: 'studentData' }
            )
        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        teacherId: DataTypes.INTEGER,
        studentId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Booking',
        tableName: 'booking',
    });
    return Booking;
};