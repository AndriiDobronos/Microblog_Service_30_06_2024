const bcrypt = require('bcrypt');
const config = require('config');
const { AuthError } = require("../errors");
const userService = require('../services/user_service_prisma');
const authLogger = require('../utils/logger')('auth',config);
const { ROLES } = require('../middlewares/authContext');

async function logUserIn(req, resp, next) {
    const { username, password_hash } = req.body;
    const user = await userService.findByUserName(username);
    if (!user) {

        resp.redirect('/unsuccessful-login')

        return next(new AuthError({
            msg: `user [${username}] - invalid creds`,
            errors: { auth: 'Invalid creds!'}
        }));
    }
    const isPasswordOk = await bcrypt.compare(password_hash, user.password_hash);
    if (!isPasswordOk) {

        resp.redirect('/unsuccessful-login')

        return next(new AuthError({
            msg: `user [${username}] - invalid creds`,
            errors: { auth: 'Invalid creds!' }
        }));
    }
    const role = user.role || ROLES.user;
    req.__authContext = { username, role };
    authLogger.info(`user [${username}] with role [${role}] - successfully logged in`);
    next();
}

async function createUserAccount(req, resp, next) {
    const { username, password_hash } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password_hash, salt);

    try {
        const role = ROLES.user;
        const newUser = await userService.saveNewUser({ username, hashedPass, role });
        req.__authContext = { username, role };
        authLogger.info(`user [${newUser.username}] with role [${role}] - successfully created new account`);
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    logUserIn,
    createUserAccount
}