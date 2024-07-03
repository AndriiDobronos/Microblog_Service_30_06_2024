const express = require('express');
const pagesRouter = express.Router();

const pagesController = require('../controllers/pages_controller');
const { ValidationError, NotFoundError, AuthError } = require('../errors');
const {  userValidator, commentDataValidator,postsDataValidator } = require('../middlewares/validators');
const { logUserIn, createUserAccount } = require('../controllers/auth_controller');
const  { authDestroySession,authInitSessionAndRedirect,
    restrictedResource, ROLES} = require('../middlewares/authContext')
const {logger: loggerConfig} = require("config");
const formDataParser = express.urlencoded({ extended: false });
const logger = require('../utils/logger')('pages router', loggerConfig);

function notFoundErrorHandler(err, _req, resp, _next) {
    resp.status(404).json({ error: err.message });
}

async function formErrorHandler(err, req, resp, next) {
    if (err instanceof ValidationError || err instanceof AuthError) {
        logger.error(err.message, err);
        req.__pageContext = {
            ...req.__pageContext,
            data: req.body,
            errors: err.errors
        }
        delete req.__pageContext.data.password;
        logger.info('Saved metadata in context:', req.__pageContext);
        return next();
    }
    next(err);
}

pagesRouter.use(pagesController.addPageContext);

pagesRouter.get('/', pagesController. fetchHomePage,
    pagesController.renderPage('index')
);

pagesRouter.get('/admin', restrictedResource([ROLES.admin]),
     pagesController. fetchHomePage,
     pagesController.renderPage('admin_dashboard')
);

pagesRouter.route('/login')
    .get(pagesController.renderPage('login'))
    .post(formDataParser,
        userValidator,
        logUserIn,
        authInitSessionAndRedirect('/'),
        formErrorHandler,
        pagesController.renderPage('/add-post')
    );

pagesRouter.get('/my-posts',
    pagesController.fetchMyPost,
    pagesController.renderPage('my_posts')
);

pagesRouter.delete('/delete-post/:id',
    formDataParser,
    pagesController.handlerDeletePostAndRedirect
);

pagesRouter.get('/delete-my-post/:id',
    formDataParser,
    pagesController.fetchDeleteMyPost,
    pagesController.renderPage('delete_my_post')
);

pagesRouter.delete('/delete-comment/:id',
    formDataParser,
    pagesController.fetchDeleteCommentAndRedirect
);

pagesRouter.get('/delete-comment/:id',
    formDataParser,
    (req, resp) => {
    const { id } = req.params;
    resp.render('delete_comment',{id});
});


pagesRouter.route('/add-post')
    .get(pagesController.fetchAddPost,
        pagesController.renderPage('add_post'))
    .post(formDataParser,
        postsDataValidator,
        pagesController.fetchAddPost,
        formErrorHandler,
        pagesController. addPostAndRedirect
    );

pagesRouter.route('/add-comment/:post')
    .get(pagesController.fetchAddComment, pagesController.renderPage('add_comment'))
    .post(formDataParser,
        commentDataValidator,
        pagesController.fetchAddComment,
        pagesController.createCommentAndRedirect
    );

pagesRouter.route('/signup')
    .get(pagesController.renderPage('signup'))
    .post(formDataParser,
        userValidator,
        createUserAccount,
        authInitSessionAndRedirect('/'),
        formErrorHandler,
        pagesController.renderPage('signup')
    );

pagesRouter.get('/logout', authDestroySession);

pagesRouter.get('/users-list', restrictedResource([ROLES.admin]),
    pagesController. fetchAllUsers,
    pagesController.renderPage('users_list'),
    notFoundErrorHandler
);

pagesRouter.route('/delete-user')
    .get((req, resp) => {
        resp.render('delete_user');
    });

pagesRouter.use((_req, resp) => resp.render('404'));

pagesRouter.use((_err, _req, resp, _next) => resp.render('500'));

module.exports = {
    pagesRouter
}