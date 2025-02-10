'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Response extends Model {
        static associate(models) {
            Response.belongsTo(models.Survey, { foreignKey: 'surveyId' });
            Response.belongsTo(models.User, {
                foreignKey: 'userId', // Khoá ngoại liên kết với User
                as: 'user' // Alias để sử dụng khi eager-load
            });
        }
    }
    Response.init({
        surveyId: DataTypes.INTEGER,
        file: DataTypes.STRING,
        text_response: DataTypes.TEXT,
        userId: DataTypes.INTEGER,  // Liên kết với User (hoặc Student)
    }, {
        sequelize,
        modelName: 'Response',
    });
    return Response;
};
