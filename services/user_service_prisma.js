const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { NotFoundError, AuthError } = require("../errors");
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

function getAllUsers() {
    return prisma.user.findMany();
}

function getAllPosts() {
    return prisma.post.findMany()
}

async function getUserById(userId) {
    const userItem = await prisma.user.findUnique({ where: { id: userId }});
    if (!userItem) {
        throw new NotFoundError({ msg: 'User not found' });
    }
    return userItem;
}

function findByUserName(username) {
    return prisma.user.findFirst({ where: { username } });
}

function findPostsByUserName(username) {
    return prisma.post.findMany({ where: {author: username } });
}

function deletePostById(postId) {
    return prisma.post.delete({ where: { id: postId } })
}

function deleteCommentById(commentId) {
    if (typeof commentId === "object" ) {
            return  prisma.comment.deleteMany({ where: {
                    id: { in: commentId },
                },
            })
    }else {
        return  prisma.comment.delete({ where: { id: commentId } })
    }
}

async function deleteUserById(userId) {
    try {
        return await prisma.user.delete({ where: { id: userId } });
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError({ msg: 'User not found' });
        }
        throw err;
    }
}

async function saveNewUser({ username, hashedPass, role}) {
    try {
        return await prisma.user.create({ data: {
                username,
                password_hash: hashedPass,
                role: role || "user"
            }});
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new AuthError({ msg: 'Cannot use this username' });
        }
        throw err;
    }
}

function addComment(metadata) {
    return prisma.comment.create({ data: metadata })
}

function addPost(metadata) {
    return prisma.post.create({ data: metadata })
}


function getAllComments() {
    return prisma.comment.findMany();
}

module.exports = {
    getAllUsers,
    getAllPosts,
    getUserById,
    deleteUserById,
    deletePostById,
    deleteCommentById,
    saveNewUser,
    addComment,
    addPost,
    getAllComments,
    findByUserName,
    findPostsByUserName
};