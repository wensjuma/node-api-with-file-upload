const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const MySQLTransport = require("winston-mysql");
const winston = require("winston");
const logger = require("./src/utils/logger.service");
var path = require('path');
const loggerService = require("./src/utils/logger.service");
// const logger = require('winston')
var logPath = path.join(__dirname, 'log', 'access.log');
global.__basedir = __dirname + "/";

const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

const db = require("./src/models");
db.sequelize.sync();

/**If existing tables need to dropped and the database resynced */
// db.sequelize.sync({
//     force: true
// }).then(() => {
//     console.log("Drop and re-sync db.");
// });


/**
 * _______________________________________
 * LOGGING
 * _______________________________________
 */
// app.use(morgan('combined'));
// app.use(morgan('combined', {
//     stream: fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
// }));
// loggerService.info(`User Authenticated : ${'email'}!`);


app.get("/", (req, res) => {
    console.log("pass here", req);
    res.json({
        message: "Welcome to application."
    });
});
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,DELETE,PUT,HEAD,OPTIONS")
    res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin")
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
})

require("./src/routes/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
