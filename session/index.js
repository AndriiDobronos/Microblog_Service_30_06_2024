const { session: sessionConfig } = require('config');

const expressSession = require('express-session');
const MongoStorage = require('connect-mongo');

const cookieParams = {
    httpOnly: false,
    sameSite: 'strict',
    secure: sessionConfig.secureCookie
}

const sessionStore = MongoStorage.create({
    mongoUrl: process.env.SESSION_DATABASE_URL
})

const sessionMiddleware = expressSession({
    secret: sessionConfig.secret,
    name: sessionConfig.cookieName,
    cookie: cookieParams,
    saveUninitialized: false,
    resave: false,
    store: sessionStore
});

module.exports = {
    sessionMiddleware
};