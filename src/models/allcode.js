'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcodes.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })
        }
    };
    Allcodes.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        value: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Allcodes',
    });
    return Allcodes;
};