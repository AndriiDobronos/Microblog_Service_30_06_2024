const isProd = process.env.NODE_ENV === 'production';
const allowedDataSources = ['mock', 'db'];
const envDataSource = process.env.DATA_SOURCE;

module.exports = {
    logger: {
        colorsEnabled: process.env.COLORS_ENABLED || 0,
        logLevel: process.env.LOG_LEVEL || 'warn',
        target: process.env.TARGET_FOLDER
    },
    server: {
        port: process.env.PORT || 3000
    },
    data: {
        source: allowedDataSources.includes(envDataSource) ? envDataSource : allowedDataSources[0],
        dbType: process.env.DATABASE_URL.includes('mongo') ? 'mongo' : 'sql'
    },
    session: {
        secureCookie: isProd, // httpS || http
        cookieName: 'sid',
        secret: process.env.SESSION_SECRET || Math.random().toString(36).slice(2)
    }
};
