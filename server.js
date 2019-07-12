const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var formidable = require('formidable');
const jwt = require('jsonwebtoken');
const secret = 'wyasha';
const port = 9000;
const app = express();
const moment = require("moment");
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    database: "blog",
    user: "root",
    password: "123456"
});

const datetimeFormat = "YYYY-MM-DD HH:mm:ss";
const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
};
/******************************************************************************/
app.get("/getArticles", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("获取文章:" + err);
            res.send({error: 1});
        }
        else {
            const sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE likes.id = article.id) AS likes FROM article ORDER BY publishTime DESC`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log("查询article: " + err);
                    res.send({error: 1});
                }
                else {
                    result.forEach((item) => {
                        if (item.tags !== null) item.tags = item.tags.split(",");
                        item.publishTime = moment(item.publishTime).format(datetimeFormat);
                    });
                    res.send({
                        error: 0,
                        result: result
                    });
                }
            });
            connection.release();
        }
    });
});
app.get("/getMessages", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("获取留言: " + err);
            res.send({error: 1});
        }
        else {
            const sql = `SELECT message.*, avatar FROM message NATURAL LEFT JOIN user ORDER BY messageTime DESC`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log("查询message: " + err);
                    res.send({error: 1});
                }
                else {
                    result.forEach((item) => {
                        item.messageTime = moment(item.messageTime).format(datetimeFormat);
                    });
                    res.send({
                        error: 0,
                        result: result
                    });
                }
            });
            connection.release();
        }
    });
});
app.get("/getLikeArticles", (req, res) => {
    let name = req.query.name;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("获取喜欢文章: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`SELECT id FROM likes WHERE name = "${name}"`, (err, result) => {
                if (err) {
                    console.log("查询likes: " + err);
                    res.send({error: 1});
                }
                else res.send({
                    error: 0,
                    result: result.map((item) => item.id)
                });
            });
            connection.release();
        }
    });
});
app.get("/view", (req, res) => {
    let id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("查看文章: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`UPDATE article SET views = views + 1 WHERE id = ${id}`, (err, result) => {
                if (err) {
                    console.log("更新views: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/like", (req, res) => {
    let id = req.query.id,
        name = req.query.name;
    const token = req.headers.authorization;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log("喜欢身份验证: " + err);
            res.status(401).json({
                errors: {
                    global: "Invalid token"
                }
            });
        }
        else {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log("喜欢文章: " + err);
                    res.send({error: 1});
                }
                else {
                    connection.query(`INSERT INTO likes VALUES (${id}, "${name}")`, (err, result) => {
                        if (err) {
                            console.log("插入likes: " + err);
                            res.send({error: 1});
                        }
                    });
                    connection.release();
                }
            });
        }
    });
    res.send({error: 0});
});
app.get("/loginSuccess", (req, res) => {
    let name = req.query.name,
        password = req.query.password,
        ip = getClientIp(req);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("登录后: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`UPDATE user SET signTime = NOW(), signIP = "${ip}" WHERE name = "${name}"`, (err, result) => {
                if (err) {
                    console.log("修改user: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    let token = jwt.sign({
        name: name,
        password: password
    }, secret);
    res.send({
        error: 0,
        result: token
    });
});
app.get("/postMessage", (req, res) => {
    let name = req.query.name,
        content = req.query.content;
    const token = req.headers.authorization;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log("留言身份验证: " + err);
            res.status(401).json({
                errors: {
                    global: "Invalid token"
                }
            });
        }
        else {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log("添加留言: " + err);
                    res.send({error: 1});
                }
                else {
                    connection.query(`INSERT INTO message(name, content) VALUES ("${name}", "${content}")`, (err, result) => {
                        if (err) {
                            console.log("插入message: " + err);
                            res.send({error: 1});
                        }
                    });
                    connection.release();
                }
            });
        }
    });
    res.send({error: 0});
});
app.get("/findUser", (req, res) => {
    let name = req.query.name;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("查找用户: " + err);
            res.send({error: 1});
        }
        connection.query(`SELECT * FROM user WHERE name = "${name}"`, (err, result) => {
            if (err) {
                console.log("查询user: " + err);
                res.send({error: 1});
            }
            else res.send({
                error: 0,
                result: result
            });
        });
        connection.release();
    });
});
app.get("/sign", (req, res) => {
    let name = req.query.name,
        password = req.query.password,
        ip = getClientIp(req);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("注册账号: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`INSERT INTO user(name, password, signIP) VALUES ("${name}", "${password}", "${ip}")`, (err, result) => {
                if (err) {
                    console.log("插入user: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/likeArticle", (req, res) => {
    let name = req.query.name,
        id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("喜欢文章: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`INSERT INTO likes VALUES (${id}, "${name}")`, (err, result) => {
                if (err) {
                    console.log("插入likes: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/dislikeArticle", (req, res) => {
    let name = req.query.name,
        id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("取消喜欢文章: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`DELETE FROM likes WHERE id = ${id} AND name = "${name}"`, (err, result) => {
                if (err) {
                    console.log("删除likes: " + err);
                    res.send({error: 1});
                }
                else {
                    res.send({error: 0});
                }
            });
            connection.release();
        }
    });
});
app.post("/uploadAvatar", (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./upload/avatar";
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
        let oldpath = files.avatar.path,
            extname = files.avatar.name;
        if (!extname.endsWith("jpg") && !extname.endsWith("png") && !extname.endsWith("jpeg") && !extname.endsWith("JPG")) {
            res.send({
                error: 1,
                message: "请上传png/jpg/jpeg格式的文件!"
            });
        }
        else {
            let newpath = "./upload/avatar/" + extname;
            fs.rename(oldpath, newpath, (err) => {
                if (err) {
                    console.log("头像文件移动: " + err);
                    res.send({
                        error: 1,
                        result: []
                    });
                }
                let respath = newpath.replace("./", "/");
                res.send({
                    error: 0,
                    result: [respath]
                });
            });
        }
    });
});
app.get("/changeAvatar", (req, res) => {
    let avatar = req.query.avatar,
        name = req.query.name;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("修改头像: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`UPDATE user SET avatar = "${avatar}" WHERE name = "${name}"`, (err, result) => {
                if (err) {
                    console.log("更新avatar: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/postArticle", (req, res) => {
    let title = req.query.title,
        intro = req.query.intro,
        tags = "",
        content = req.query.content,
        type = req.query.type;
    for (let i = 0; i < req.query.tags.length; i += 1) {
        tags += req.query.tags[i];
        if (i < req.query.tags.length - 1) tags += ",";
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("添加文章: " + err);
            res.send({error: 1});
        }
        else {
            let sql = `INSERT INTO article(title, intro, tags, content, type) VALUES ("${title}", "${intro}", "${tags}", "${content}", "${type}")`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log("插入article: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/changeArticleType", (req, res) => {
    let id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("更改文章类型: " + err);
            res.send({error: 1});
        }
        else {
            let sql = `UPDATE article SET type = (CASE WHEN type = "NORMAL" THEN "PRIVATE" ELSE "NORMAL" END) WHERE id = ${id}`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log("修改article type: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});
app.get("/deleteMessage", (req, res) => {
    let id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("删除留言: " + err);
            res.send({error: 1});
        }
        else {
            connection.query(`DELETE FROM message WHERE id = ${id}`, (err, result) => {
                if (err) {
                    console.log("删除message: " + err);
                    res.send({error: 1});
                }
            });
            connection.release();
        }
    });
    res.send({error: 0});
});

app.listen(port, () => console.log(`端口${port}运行中`));
