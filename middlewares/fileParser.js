const multer = require('multer');
const { randomUUID } = require('crypto')

const storage = multer.diskStorage({
    destination: (_req, _file, next) => next(null, './uploads'),
    filename: (_req, file, next) => {
        const fileExt = file.originalname.split('.').pop();
        next(null, `${randomUUID()}.${fileExt}`);
    }
});

module.exports = {
    fileParser: multer({ storage })
}