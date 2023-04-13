module.exports = (sequelize, Sequelize) => {
    const ProfileRoles = sequelize.define("tb_roles_in_profile", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        profile_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
      
        created_by:{
            type: Sequelize.STRING,
            allowNull: false
        },
        status:{
            type: Sequelize.TINYINT,
            allowNull: false
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
    return ProfileRoles;
};