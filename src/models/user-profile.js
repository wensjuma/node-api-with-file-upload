module.exports = (sequelize, Sequelize) => {
    const userProfile = sequelize.define("tb_user_profiles", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        profile_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_active: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
      
        created_by:{
            type: Sequelize.STRING,
            allowNull: false
        },
        user_email:{
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'updated_on'
     });
    return userProfile;
};