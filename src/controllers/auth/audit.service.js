const db = require("../../models");
const constructResponse = require('../../helpers/_responseHelper');
const Audit = db.auditLogs;


exports.auditLogs = (req, res)=>{
   
}
exports.getAuditLogs =async (req, res)=>{
    try {
        let auditTrails = await Audit.findAll({
            // where: condition
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Logs."
            });
        });
        if (auditTrails) {
            res.send(await constructResponse.constructSuccessResponse(auditTrails));
        }
    } catch (error) {
        res.send(await constructResponse.constructException(error));
    }
    
}

