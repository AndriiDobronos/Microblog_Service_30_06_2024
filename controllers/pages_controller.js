const {logger: loggerConfig} = require("config");
const logger = require('../utils/logger')('pages controller', loggerConfig);
const usersService = require("../services/user_service_prisma");

function renderPage(templateName) {
    return (req, resp) => {
        resp.render(templateName, req.__pageContext);
    }
}

function addPageContext(req, resp, next) {
    const isLoggedIn = !!req.session?.context?.role;
    req.__pageContext = {
        isLoggedIn,
        role: req.session?.context?.role
    };
    const userMark = isLoggedIn ? `${req.__pageContext.role} ${req.session.context.username}`: 'unauthorized';
    logger.info(`page access from [${userMark}]`);
    next();
}

async function fetchAllUsers(req, resp, next) {
    const usersList = await usersService.getAllUsers();
    req.__pageContext.usersList = usersList;
    next();
}

async function fetchAddPost(req, resp, next) {
    const userName = req.session?.context
    req.__pageContext = {userName};
    next();
}

async function addPostAndRedirect(req, resp, next) {
    try{
        await usersService.addPost(req.body);
        resp.redirect('/pug');
    }catch (err) {
        next(err);
    }
}

async function fetchAddComment(req,resp,next) {
    const {post} = req.params;
    const userName = req.session?.context;
    req.__pageContext = {userName,post};
    next();
}

async function fetchDeleteMyPost(req,resp,next) {
    const { id } = req.params;
    const commentsList = await usersService.getAllComments();
    req.__pageContext = {commentsList, id};
    next();
}

async function fetchDeleteCommentAndRedirect(req,resp) {
        const { id } = req.params;
        await usersService.deleteCommentById(id);
        resp.redirect('/pug');
}

async function createCommentAndRedirect(req, resp, next) {
    try{
        await  usersService.addComment(req.body)
        resp.redirect('/pug');
    }catch (err) {
        next(err);
    }
}

async function fetchHomePage(req, resp, next) {
    const userPermit = await req.session?.context;
    const usersList = await usersService.getAllUsers();
    const postsList = await usersService.getAllPosts();
    const commentsList = await usersService.getAllComments();
    req.__pageContext = {userPermit,usersList,postsList,commentsList}
    next()
}

async function fetchMyPost(req, resp, next) {
    const userName = req.session?.context;
    if (!req.__pageContext.isLoggedIn) {
        resp.redirect('/pug/login')
    } else {
        const userPermit = req.__pageContext.role
        const postsList = await usersService.findPostsByUserName(userName?.username);
        const commentsList = await usersService.getAllComments();
        req.__pageContext = {userPermit,postsList,commentsList}
        next()
    }
}

async function handlerDeletePostAndRedirect(req, resp) {
    const {id} = req.params;
    const postId = id.split('*').slice(0, 1)[0]
    const commentId = id.split('*').slice(1)
    await usersService.deletePostById(postId);
    await usersService.deleteCommentById(commentId);
    resp.redirect('/pug');
}

module.exports = {
    renderPage,
    addPageContext,
    fetchMyPost,
    fetchAllUsers,
    fetchAddPost,
    addPostAndRedirect,
    fetchAddComment,
    fetchHomePage,
    createCommentAndRedirect,
    fetchDeleteMyPost,
    fetchDeleteCommentAndRedirect,
    handlerDeletePostAndRedirect,
};