module.exports = (sequelize, Sequelize) => {
    const Corporate = sequelize.define("organization", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
            
        },
        name: {
            type: Sequelize.STRING(64),
            allowNull: false,
        },
        reg_no: {
            type: Sequelize.STRING(65),
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING(65),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        account_no: {
            type: Sequelize.STRING(60),
            allowNull: false,
        },
        kra_pin: {
            type: Sequelize.STRING(60),
            allowNull: false,
        },
        branch: {
            type: Sequelize.STRING(55),
            allowNull: false,
        },
        physical_address: {
            type: Sequelize.STRING(100)
        },
        postal_address: {
            type: Sequelize.STRING(255)
        },
        profile_img: {
            type: Sequelize.TEXT
        },
        img_string: {
            type: Sequelize.TEXT
        }
    },
    {
        sequelize,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp'
      }
    );
    
    return Corporate;
};