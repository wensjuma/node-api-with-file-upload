module.exports = app => {
  // const tutorials = require("../controllers/tutorialController");
  const staffController = require("../controllers/staff.controller");
  const corporate = require("../controllers/corporate.controller");
  const global = require("../controllers/global.controller");
  const userController = require("../controllers/auth/sys.user.controller");
  const auditService = require("../controllers/auth/audit.service");
  const authService = require("../controllers/auth/auth.service");
  const loggerService = require("../utils/logger.service");
  const upload = require("../middlewares/file.upload");
  const loanService = require("../controllers/apply-loan.controller");
  const loanProductService = require("../controllers/products.controller");
  const profileManagement = require("../controllers/auth/rolesProfiles.service");
  let router = require("express").Router();
  /**USER ROUTES */
  router.post("/create-user",loggerService.loggerFunction, userController.create);
  router.post("/get-users", userController.findAll);

  router.post("/get-approved-users",
  authService.authorizeRequest,
  loggerService.loggerFunction, 
  userController.findApprovedUsers);
  
  router.post("/approve-user", userController.approveUser);
  router.post("/create-user", authService.authorizeRequest, userController.create);
  router.post("/get-users", authService.authorizeRequest, userController.findAll);
  router.post("/users/edit", authService.authorizeRequest, userController.update);
  router.post("/users/delete",  authService.authorizeRequest, userController.delete);
  router.post("/get-approved-users",  authService.authorizeRequest, userController.findApprovedUsers);
  router.post("/approve-user", authService.authorizeRequest, userController.approveUser);
  router.post("/login", authService.login);

  //STAFF LOGIN

  router.post("/staff-login", authService.staffLogin);
  router.post("/reset-password", authService.resetPasswordRequest);

  /**STAFF ROUTES */
  router.post("/create-staff",authService.authorizeRequest, staffController.createStaff);
  router.post("/create-staff/upload", upload.single("file"), staffController.upload);
  router.post("/get-staff", staffController.findAllStaff);
  router.post("/approve-staff", authService.authorizeRequest, staffController.approveStaff);

  router.post("/get-approved-staff", staffController.findApprovedStaff);
  router.post("/get-staff", staffController.findOne);
  router.post("/approved-staff/edit", staffController.updateApproved);
  router.post("/staff/edit", staffController.update);

  router.post("/staff/delete", staffController.delete);
  router.post("/staff/delete/all", staffController.deleteAll);
  /**CORPORATES ROUTES */
  router.post("/create-corporate", authService.authorizeRequest, corporate.create);
  router.post("/corporate/upload", authService.authorizeRequest, upload.single("file"), corporate.uploadEmployee);
  router.post("/get-corporate", authService.authorizeRequest, corporate.findAll);
  router.post("/get-corporate", authService.authorizeRequest, corporate.findOne);
  router.post("/corporate/edit", authService.authorizeRequest, corporate.update);
  router.post("/corporate/delete", authService.authorizeRequest, corporate.delete);
  router.post("/corporate/delete/", authService.authorizeRequest, corporate.deleteAll);
  /**LOAN MANAGEMENT */
  router.post("/get-loans", authService.authorizeRequest, loanService.findAll);
  router.post("/loan/apply",authService.authorizeRequest, loanService.applyLoan);
  router.post("/my-loans",authService.authorizeRequest, loanService.findIndividualLoans);
  // router.post("/loan/applied", loanService.findAll);
  router.post("/repayment", authService.authorizeRequest, loanService.repayLoan);
  /**LOAN PRODUCT MANAGEMENT */
  router.post("/create-product", loanProductService.create);
  router.post("/get-products", loanProductService.findAll);
  router.post("/delete-product", loanProductService.delete);
  router.post("/update-product", loanProductService.update);

  router.post("/get-auditlogs", auditService.getAuditLogs);

  /**PROFILE MANAGEMENT  */
  router.post("/create-profile", profileManagement.addProfiles);
  router.post("/get-profiles",
  //  authService.authorizeRequest,
  loggerService.loggerFunction, 
   profileManagement.getAllProfiles);

  router.post("/assign-roles",
  //  authService.authorizeRequest,
  loggerService.loggerFunction, 
   profileManagement.assignRoles);

  router.post("/assign-profile",
  //  authService.authorizeRequest,
  // loggerService.loggerFunction, 
   profileManagement.assignUserProfile);

  router.post("/create-roles",
  //  authService.authorizeRequest,
  loggerService.loggerFunction, 
   profileManagement.addRoles);

  router.post("/get-roles-in-profile",
  //  authService.authorizeRequest,
  loggerService.loggerFunction, 
   profileManagement.getRolesInProfile);
 

  router.post("/get-users-in-profile",
  //  authService.authorizeRequest,
  loggerService.loggerFunction, 
   profileManagement.getUsersInProfile);
 
  app.use('/api/loan-originator', router );
};