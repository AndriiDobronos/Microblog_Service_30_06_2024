const yup = require('yup');
const { data } = require('config');
const { ValidationError } = require('../errors');

const MESSAGES = {
    missing: 'should be provided',
    wrongType: (type) => `should be ${type}`
}

const usersIdSchemaSql = yup.number()
    .typeError(MESSAGES.wrongType('a number'))
    .required(MESSAGES.missing)
    .integer(MESSAGES.wrongType('an integer'))
    .positive('should be more than 0')

const usersIdSchemaMongo = yup.string()
    .typeError(MESSAGES.wrongType('a string'));

const usersIdSchema = {
    sql: usersIdSchemaSql,
    mongo: usersIdSchemaMongo
};

const postsMetadataSchema = yup.object({
    title: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be longer than 4 chars'),
    content: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be longer than 4 chars'),
    author: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be longer than 4 chars'),
    time_publication:yup.string()
});

const commentMetadataSchema = yup.object({
    username: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be longer than 4 chars'),
    comment: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(2, 'should be longer than 2 chars'),
    time_publication: yup.string(),
    refers_to_post: yup.string(),
})

const usersIdValidator = async (req, resp, next) => {
    try {
        const parsedId = await usersIdSchema[data.dbType].validate(req.params.usersId);
        req.params.usersId = parsedId;
        next();
    } catch (err) {
        const errors = {
            usersId: err.message
        };
        next(new ValidationError({ errors }))
    }
}

const userDataSchema = yup.object({
    username: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be at least 4 chars'),
    password_hash: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, 'should be at least 4 chars'),
    role:yup.string()
});

const userValidator = async (req, resp, next) => {
    try {
        await userDataSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }

            acc[curr.path].push(curr.message);
            return acc;
        }, {});

        next(new ValidationError({ msg: 'Invalid user credentials format', errors }));
    }
}

const commentDataValidator = async (req, resp, next) => {
    try {
        await commentMetadataSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }

            acc[curr.path].push(curr.message);
            return acc;
        }, {});
        next(new ValidationError({ errors }))
    }
}

const postsDataValidator = async (req, resp, next) => {
    try {
        await postsMetadataSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }

            acc[curr.path].push(curr.message);
            return acc;
        }, {});
        next(new ValidationError({ errors }))
    }
}

module.exports = {
    userValidator,
    usersIdValidator,
    commentDataValidator,
    postsDataValidator
}