const { bgBlue, bgYellow, bgRed, disable: disableColors }  = require('colors/safe');
const path = require('path');
const fs = require('fs');

const logsFolderPath = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath);
    console.log(`Папка ${logsFolderPath} була створена`);
}

const writeStreamInfo = fs.createWriteStream(path.join(logsFolderPath, 'info.log'));
const writeStreamError = fs.createWriteStream(path.join(logsFolderPath, 'error.log'));

process.once('beforeExit', ()=> {
    writeStreamInfo.end();
    writeStreamError.end();
    console.log('Всі файл стріми закрились');
});

function getLogger(moduleName, loggerConfig) {
    const { logLevel, colorsEnabled } = loggerConfig;

    process.emit('init_logger')

    if (+colorsEnabled === 0) {
        disableColors();
    }

    return {
        info: (...args) => {
            const logMoment = new Date().toISOString();
            writeStreamInfo.write(`${logMoment} : ${moduleName} : ${[...args]}\n`);

            if (logLevel !== 'info') return;
            console.log(bgBlue(`${moduleName}:`), ...args);
        },
        warn: (...args) => {
            const logMoment = new Date().toISOString();
            writeStreamError.write(`${logMoment} : ${moduleName} : ${[...args]}\n`);

            if (logLevel === 'error') return;
            console.error(bgYellow(`${moduleName}:`), ...args);
        },
        error: (...args) => {
            const logMoment = new Date().toISOString();
            writeStreamError.write(`${logMoment} : ${moduleName} : ${[...args]}\n`);

            console.error(bgRed(`${moduleName}:`), ...args);
        }
    }
}
module.exports = getLogger;