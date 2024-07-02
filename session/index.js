const { session: sessionConfig } = require('config');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//const sessionStore = prisma.session

const expressSession = require('express-session');
const MongoStorage = require('connect-mongo');

const cookieParams = {
    httpOnly: false, //true,
    sameSite: 'strict',
    secure: sessionConfig.secureCookie
}

const sessionStore = MongoStorage.create({
    mongoUrl: process.env.SESSION_DATABASE_URL
})

const sessionMddleware = expressSession({
    secret: sessionConfig.secret,
    name: sessionConfig.cookieName,
    cookie: cookieParams,
    saveUninitialized: false,
    resave: false,
    store: sessionStore
});

module.exports = {
    sessionMddleware
};