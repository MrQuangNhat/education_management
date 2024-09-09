'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Group.belongsTo(models.Class, { foreignKey: 'id', targetKey: 'group', as: 'DataGroup' });
            // Group.belongsTo(models.Meeting, { foreignKey: 'meeting', targetKey: 'id', as: 'Data' });
            // Group.hasMany(models.Meeting, { foreignKey: 'id', sourceKey: 'meeting', as: 'DataMeeting' });
            // Group.hasMany(models.History, { foreignKey: 'groupID', sourceKey: 'id', as: 'DataHistoryData' });
        }
    };
    Group.init({
        name: DataTypes.STRING,
        meeting: DataTypes.STRING,
        teacher: DataTypes.JSON,
        classID: DataTypes.STRING,


    }, {
        sequelize,
        modelName: 'Group',
    });
    return Group;
};