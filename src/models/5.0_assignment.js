'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Assignment extends Model {
        static associate(models) {
            Assignment.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
            Assignment.belongsTo(models.Class, { foreignKey: 'classId' });
            Assignment.hasMany(models.AssignmentSubmission, { foreignKey: 'assignmentId', as: 'Submissions' });
        }
    }
    Assignment.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            teacherId: DataTypes.INTEGER,
            classId: DataTypes.INTEGER,
            deadline: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Assignment',
        }
    );
    return Assignment;
};
