const multer = require("multer");
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form; the file or files object contains the files uploaded via the form.
const uidSafe = require("uid-safe");
// UID generates unique names for uploaded files

const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

exports.uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
