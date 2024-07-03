require('dotenv').config();
const { server: srvConfig, logger: loggerConfig } = require('config');
const express = require('express');
const morgan = require('morgan');
const  rfs = require("rotating-file-stream");
const path = require("path");
const logger = require('./utils/logger')('express srv',loggerConfig);
const {pagesRouter} = require('./routers/pages');
const { authContextParser } = require('./middlewares/authContext');
const cookieParser = require('cookie-parser');
const app = express();
const { sessionMiddleware } = require('./session');

if(require.main === module) {
    logger.info('executed as a standalone script');
    app.listen(srvConfig.port, () => logger.info(`server is listening on [${srvConfig.port}] port`));
}

const servePath = path.join(process.cwd(), 'logs', 'file.log');
const stream = rfs.createStream(servePath, {
    size: "1M",
    interval: "1d",
    compress: true
});
const accessLogger = morgan(':date :method :url :status',{stream});
app.use(accessLogger);

app.set('view engine', 'pug');

app.use(express.static('static'));

app.use(sessionMiddleware);

app.use(cookieParser());

app.use(authContextParser);

app.use(morgan(':date :method :url :status'));

app.use('/', express.json(), pagesRouter);