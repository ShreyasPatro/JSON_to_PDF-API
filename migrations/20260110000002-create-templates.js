module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Templates', {
      id: { 
        type: Sequelize.STRING, 
        primaryKey: true 
      },
      name: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      html: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      css: { 
        type: Sequelize.TEXT 
      },
      owner_id: { 
        type: Sequelize.UUID, 
        allowNull: false,
        references: { 
          model: 'Users', 
          key: 'id' 
        },
        onDelete: 'CASCADE'
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Templates');
  }
};