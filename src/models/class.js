'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Class.hasMany(models.Group, { foreignKey: 'id', sourceKey: 'group', as: 'DataGroup' });
        }
    }
    Class.init(
        {
            group: DataTypes.STRING,
            title: DataTypes.STRING,
            teacher: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Class',
        },
    );
    return Class;
};
