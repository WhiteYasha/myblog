const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const secret = 'wyasha';
const port = 9000;
const app = express();
const moment = require("moment");

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
        if (err) console.log("获取文章:" + err);
        else {
            const sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE likes.id = article.id) AS likes FROM article ORDER BY publishTime DESC`;
            connection.query(sql, (err, result) => {
                if (err) console.log("查询article: " + err);
                else {
                    result.forEach((item) => {
                        if (item.tags !== null) item.tags = item.tags.split(",");
                        item.publishTime = moment(item.publishTime).format(datetimeFormat);
                    });
                    res.send(result);
                }
            });
            connection.release();
        }
    });
});
app.get("/getMessages", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log("获取留言: " + err);
        else {
            const sql = `SELECT message.*, avatar FROM message NATURAL LEFT JOIN user ORDER BY messageTime DESC`;
            connection.query(sql, (err, result) => {
                if (err) console.log("查询message: " + err);
                else {
                    result.forEach((item) => {
                        item.messageTime = moment(item.messageTime).format(datetimeFormat);
                    });
                    res.send(result);
                }
            });
            connection.release();
        }
    });
});
app.get("/getLikeArticles", (req, res) => {
    let name = req.query.name;
    pool.getConnection((err, connection) => {
        if (err) console.log("获取喜欢文章: " + err);
        else {
            connection.query(`SELECT id FROM likes WHERE name = "${name}"`, (err, result) => {
                if (err) console.log("查询likes: " + err);
                else res.send(result.map((item) => item.id));
            });
            connection.release();
        }
    });
});
app.get("/view", (req, res) => {
    let id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) console.log("查看文章: " + err);
        else {
            connection.query(`UPDATE article SET views = views + 1 WHERE id = ${id}`, (err, result) => {
                if (err) console.log("更新views: " + err);
            });
            connection.release();
        }
    });
    res.end();
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
                if (err) console.log("喜欢文章: " + err);
                else {
                    connection.query(`INSERT INTO likes VALUES (${id}, "${name}")`, (err, result) => {
                        if (err) console.log("插入likes: " + err);
                    });
                    connection.release();
                }
            });
        }
    });
    res.end();
});
app.get("/loginSuccess", (req, res) => {
    let name = req.query.name,
        password = req.query.password,
        ip = getClientIp(req);
    pool.getConnection((err, connection) => {
        if (err) console.log("登录后: " + err);
        else {
            connection.query(`UPDATE user SET signTime = NOW(), signIP = "${ip}" WHERE name = "${name}"`, (err, result) => {
                if (err) console.log("修改user: " + err);
            });
            connection.release();
        }
    });
    let token = jwt.sign({
        name: name,
        password: password
    }, secret);
    res.send(token);
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
                if (err) console.log("添加留言: " + err);
                else {
                    connection.query(`INSERT INTO message(name, content) VALUES ("${name}", "${content}")`, (err, result) => {
                        if (err) console.log("插入message: " + err);
                    });
                    connection.release();
                }
            });
        }
    });
    res.end();
});
app.get("/findUser", (req, res) => {
    let name = req.query.name;
    pool.getConnection((err, connection) => {
        if (err) console.log("查找用户: " + err);
        connection.query(`SELECT * FROM user WHERE name = "${name}"`, (err, result) => {
            if (err) console.log("查询user: " + err);
            else res.send(result);
        });
        connection.release();
    });
});
app.get("/sign", (req, res) => {
    let name = req.query.name,
        password = req.query.password,
        ip = getClientIp(req);
    pool.getConnection((err, connection) => {
        if (err) console.log("注册账号: " + err);
        else {
            connection.query(`INSERT INTO user(name, password, signIP) VALUES ("${name}", "${password}", "${ip}")`, (err, result) => {
                if (err) console.log("插入user: " + err);
            });
            connection.release();
        }
    });
    res.end();
});
app.get("/likeArticle", (req, res) => {
    let name = req.query.name,
        id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) console.log("喜欢文章: " + err);
        else {
            connection.query(`INSERT INTO likes VALUES (${id}, "${name}")`, (err, result) => {
                if (err) console.log("插入likes: " + err)
            });
            connection.release();
        }
    });
    res.end();
});
app.get("/dislikeArticle", (req, res) => {
    let name = req.query.name,
        id = req.query.id;
    pool.getConnection((err, connection) => {
        if (err) console.log("取消喜欢文章: " + err);
        else {
            connection.query(`DELETE FROM likes WHERE id = ${id} AND name = "${name}"`, (err, result) => {
                if (err) console.log("删除likes: " + err)
            });
            connection.release();
        }
    });
    res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
