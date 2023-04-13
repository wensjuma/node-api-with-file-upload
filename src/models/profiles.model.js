module.exports = (sequelize, Sequelize) => {
    const Profiles = sequelize.define("tb_profiles", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        profile_name: {
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
    return Profiles;
};