'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Survey extends Model {
        static associate(models) {
            Survey.hasMany(models.Response, { foreignKey: 'surveyId' });
        }
    }
    Survey.init({
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        file: DataTypes.STRING,
        deadline: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Survey',
    });
    return Survey;
};
