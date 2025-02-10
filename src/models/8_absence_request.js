'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AbsenceRequest extends Model {
        static associate(models) {
            AbsenceRequest.belongsTo(models.Student, { foreignKey: 'studentId' });
            AbsenceRequest.belongsTo(models.Class, { foreignKey: 'classId' });
        }
    }
    AbsenceRequest.init(
        {
            studentId: DataTypes.INTEGER,
            classId: DataTypes.INTEGER,
            reason: DataTypes.TEXT,
            status: DataTypes.ENUM('pending', 'approved', 'rejected'),
            requestDate: DataTypes.DATEONLY,
            responseTime: DataTypes.DATEONLY,
        },
        {
            sequelize,
            modelName: 'AbsenceRequest',
        }
    );
    return AbsenceRequest;
};
