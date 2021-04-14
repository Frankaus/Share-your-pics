const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");

app.use(express.static("public"));

app.use((req, res, next) => {
    console.log(req.method + " made on path: " + req.url);
    next();
});

app.use(express.json());

app.get("/images", (req, res) => {
    db.getImagesData()
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => console.log("error in getImagesData: ", err));
});

app.get("/image/:id", (req, res) => {
    db.selectImageById(req.params.id)
        .then(({ rows }) => {
            return res.json(rows[0]);
        })
        .catch((err) => console.log("error in selectImageById: ", err));
});

app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
    let { body, file } = req;

    db.uploadImage(body.title, body.description, body.username, file.filename)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => console.log("error in uploadImage: ", err));
});

app.get("/moreImages/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => console.log("error in db getMoreImages", err));
});

app.get("/comments/:id", (req, res) => {
    db.selectComments(req.params.id)
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => console.log("error in get comments: ", err));
});

app.post("/postComment", (req, res) => {
    db.postComment(req.body.comment, req.body.username, req.body.id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in postComment", err));
});

app.listen(8080, () => console.log("Server listening on 8080..."));
