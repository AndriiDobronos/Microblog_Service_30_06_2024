require('dotenv').config();
const { logger: loggerConfig } = require('config');
const logger = require('./utils/logger')('main', loggerConfig);
const morgan = require('morgan');
const path = require("path");
const rfs = require("rotating-file-stream");
const servePath = path.join(process.cwd(), 'logs', 'file.log');
const stream = rfs.createStream(servePath, {
    size: "1M",
    interval: "1d",
    compress: true  //"gzip"
});
const accessLogger = morgan(':date :method :url :status',{stream});
//accessLogger("path")

logger.info('info message : the script is running!');
logger.warn('warn message');
logger.error('error message');
