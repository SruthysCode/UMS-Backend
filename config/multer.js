const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    }),
    filename: ((req, file, cb) => {
        // const name = Date.now() + '-' + file.originalname;
        const name = file.originalname;
        
        cb(null, name);
    })
});

const upload = multer({ storage });

module.exports = upload

