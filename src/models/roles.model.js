module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define("tb_roles", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
      
        created_by:{
            type: Sequelize.STRING,
            allowNull: false
        },
        status:{
            type: Sequelize.TINYINT,
            allowNull: false
        },
        workflow_status:{
            type: Sequelize.TINYINT,
            allowNull: true
        }

        // record_action: {
        //     type: Sequelize.STRING
        // }
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updated_on'
     });
    return Roles;
};