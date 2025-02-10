'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ActivityLog extends Model {
        static associate(models) {
            // Thay đổi từ User sang Teacher hoặc Student
            ActivityLog.belongsTo(models.Teacher, { foreignKey: 'userId', as: 'Teacher' });
            ActivityLog.belongsTo(models.Student, { foreignKey: 'userId', as: 'Student' });
        }
    }

    ActivityLog.init(
        {
            userId: DataTypes.INTEGER,  // Chỉ định khóa ngoại
            action: DataTypes.STRING,
            details: DataTypes.TEXT,
            timestamp: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'ActivityLog',
        }
    );

    return ActivityLog;
};
