const {logger: loggerConfig} = require("config");
const { session: sessionConfig } = require('config');
const SESSION_COOKIE_NAME = sessionConfig.cookieName;
const authLogger = require('../utils/logger')('auth context', loggerConfig);

const ROLES = {
    admin: 'admin',
    user: 'user'
}

function authContextParser(req, resp, next) {
    const isLoggedIn = !!req.cookies[SESSION_COOKIE_NAME];
    req.__authContext = {
        isLoggedIn,
    };
    req.__pageContext = {
        isLoggedIn,
    };
    next();
}

function authDestroySession(req, resp) {
    resp.clearCookie(SESSION_COOKIE_NAME);
    resp.redirect(req.baseUrl);
}

function authInitSessionAndRedirect(redirectTo) {
    return (req, resp) => {
         authLogger.info(`Creating session for [${req.__authContext.role}] [${req.__authContext.username}]`);
        req.session.context = req.__authContext;
        resp.redirect(redirectTo || req.baseUrl);
    };
}

function authDestroySessionAndRedirect(req, resp) {
    const { role, username } = req.session.context;
    req.session.destroy(() => {
        authLogger.info(`Session for [${role}] [${username}] terminated`);

        resp.clearCookie(sessionConfig.cookieName);
        resp.redirect(req.baseUrl);
    });
}

function restrictedResource(availableForRoles = []) {
    return (req, resp, next) => {
        const { role = 'unauthorised' } = req.session?.context || {};
        if (availableForRoles.includes(req.session?.context?.role)) {
            return next();
        }
        authLogger.info(`Resource is unavailable for [${role}]!`);
        resp.redirect(`${req.baseUrl}/login`);
    }
}

module.exports = {
    authContextParser,
    authDestroySession,
    authInitSessionAndRedirect,
    authDestroySessionAndRedirect,
    restrictedResource,
    ROLES
};