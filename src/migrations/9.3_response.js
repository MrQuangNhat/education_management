module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Responses', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            surveyId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Surveys',
                    key: 'id',
                },
                allowNull: false,
            },
            file: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            text_response: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            userId: {  // Liên kết với sinh viên (User)
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Responses');
    },
};
