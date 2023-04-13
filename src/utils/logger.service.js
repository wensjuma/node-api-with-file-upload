const winston = require("winston");
const moment = require('moment');
const db = require("../models");

require("winston-daily-rotate-file");

const Audit = db.auditLogs;


exports.loggerFunction = async (req, res, next) => {
  const auditItem = {
    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    user_agent:JSON.stringify(req.headers['user-agent']),
    action: req.originalUrl,
    action_data: JSON.stringify(req.body)
  }
  // console.log("===========", req.body);
  // console.log("===========", req.headers.host);
  console.log("===========", req.headers['user-agent']);
  // console.log("===========", req.baseUrl);
  // console.log("===========", req.originalUrl);
  // console.log("===========", req.headers['x-forwarded-for'] || req.socket.remoteAddress);
  try {
    let auditInsert = await Audit.create(auditItem)
    if(auditInsert){
      req.timestamp = moment().format('DD-MM-YYYY HH:mm:ss')
      let filenameExt = `${req.service}-${req.type}`
      const transport = new (winston.transports.DailyRotateFile)({
        filename: filenameExt,
        datePattern: 'YYYY-MM-DD',
        extension: '.log',
        zippedArchive: false,
        maxSize: '5m',
        dirname: `/var/log/USSD/${moment().format('YYYY-MM-DD')}`,
        maxFiles: '65d',
        auditFile: `/var/log/USSD/${moment().format('YYYY-MM-DD')}/${req.type}-audit.json`
      });
      const logger = winston.createLogger({
        transports: [
          transport
        ]
      });
      logger.info(req);
      // res.send({
      //   response: "successful"
      // })
      
    }
    } catch (error) {
      console.log(error);
    } 
    next();
}
