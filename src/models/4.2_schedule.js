'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            // Schedule thuộc về một Class
            Schedule.belongsTo(models.Class, { foreignKey: 'classId' });
        }
    }
    Schedule.init(
        {
            classId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Classes', // Liên kết với bảng Classes
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            dayOfWeek: {
                type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
                allowNull: false,
            },
            startTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Schedule',
        }
    );
    return Schedule;
};
