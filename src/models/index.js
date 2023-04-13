const dbConfig = require("../../db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// db.tutorials = require("./tutorial.model")(sequelize, Sequelize);
// db.staff = require("./employees.model")(sequelize, Sequelize);
db.corporates = require("./companies.model")(sequelize, Sequelize);
db.users = require("./User.model")(sequelize, Sequelize);
db.loans = require("./loans.model")(sequelize, Sequelize);
db.loanProduct = require("./loan-product.model")(sequelize, Sequelize);
db.loansMessages = require("./loan-messages.model")(sequelize, Sequelize);
db.staging = require("./staging.model")(sequelize, Sequelize);
db.auditLogs = require("./audit.model")(sequelize, Sequelize);
db.profiles = require("./profiles.model")(sequelize, Sequelize);
db.roles = require("./roles.model")(sequelize, Sequelize);
db.rolesInProfiles = require("./rolesprofile.model")(sequelize, Sequelize);
db.userProfile = require("./user-profile")(sequelize, Sequelize);
// db.loansLimits = require("./loan-limits.models")(sequelize, Sequelize);


const Limits = require("./loan-limits.models")(sequelize, Sequelize); 
const Staff =  require("./employees.model")(sequelize, Sequelize);
const RolesInProfile = require("./rolesprofile.model")(sequelize, Sequelize);
const Roles =  require("./roles.model")(sequelize, Sequelize);

/**
 * ---------staff to loan limit relationship----------------
 */
Staff.hasMany(Limits, {foreignKey: 'employee_id', as: 'limits'})
Limits.belongsTo(Staff, {foreignKey: 'employee_id', as: 'staff'})
/**
 * ---------profile to role relationship----------------
 */
 RolesInProfile.hasMany(Roles, {foreignKey: 'id', as: 'roles'})
Roles.belongsTo(RolesInProfile, {foreignKey: 'role_id', as: 'rolesInProfile'})

db.staff = Staff;
db.loansLimits = Limits;

db.rolesInProfiles = RolesInProfile;
db.roles = Roles;
module.exports = db;