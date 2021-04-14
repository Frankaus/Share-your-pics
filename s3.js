const aws = require("aws-sdk");
const fs = require("fs");

let secrets;

process.env.NODE_ENV == "production"
    ? (secrets = process.env)
    : (secrets = require("./secrets"));

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) return res.sendStatus(500);

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("amazon upload complete!");
            next();
            // here I delete the uploaded image from the uploads folder
            fs.unlink(path, () => {});
        })
        .catch((err) => console.log("error in S3 promise: ", err));
};
