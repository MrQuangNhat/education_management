'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Material extends Model {
        static associate(models) {
            Material.belongsTo(models.Class, { foreignKey: 'classId' });
        }
    }
    Material.init(
        {
            classId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            link: DataTypes.STRING,
            type: DataTypes.ENUM('lecture', 'extra_reading', 'video'),
        },
        {
            sequelize,
            modelName: 'Material',
        }
    );
    return Material;
};
