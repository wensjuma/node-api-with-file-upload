module.exports = (sequelize, Sequelize) => {
    const Staging = sequelize.define("tb_staging", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        data: {
            type: Sequelize.TEXT,
            allowNull: false
            // unique: true
        },
        is_approved: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        is_complete: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        data_channel: {
            type: Sequelize.STRING
        },
        created_by:{
            type: Sequelize.STRING,
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
       updatedAt: 'approved_on'
     });
    return Staging;
};