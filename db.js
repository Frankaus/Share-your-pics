const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:francesco:password@localhost:5432/imageboard"
);

exports.getImagesData = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};

exports.uploadImage = (title, description, username, fileName) => {
    const params = [
        title,
        description,
        username,
        "https://s3.amazonaws.com/spicedling/" + fileName,
    ];
    const q = `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING title, description, username, url, id`;
    return db.query(q, params);
};

exports.selectImageById = (id) => {
    return db.query(`SELECT * FROM images WHERE id=$1`, [id]);
};

exports.getMoreImages = (id) => {
    return db.query(
        `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [id]
    );
};

exports.selectComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE idimage = $1`, [id]);
};

exports.postComment = (text, username, id) => {
    return db.query(
        `INSERT INTO comments (text, username, idimage) VALUES ($1, $2, $3) RETURNING text, username, created_at`,
        [text, username, id]
    );
};
