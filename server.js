const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const secret = 'wyasha';
const port = 9000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    database: "blog_db",
    user: "root",
    password: "123456"
});

app.get("/init", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("SELECT * FROM articles ORDER BY publishtime DESC", (err, result) => {
                if (err) console.log(err);
                else {
                    result.forEach((item) => {
                        if (item.tags !== null) item.tags = item.tags.split(",");
                        if (item.likeuser === null) item.likeuser = "";
                        const year = item.publishtime.getFullYear(),
                            month = item.publishtime.getMonth() + 1,
                            day = item.publishtime.getDate(),
                            hour = item.publishtime.getHours(),
                            minute = item.publishtime.getMinutes(),
                            second = item.publishtime.getSeconds();
                        item.publishtime = `${year}-${(month < 10 ? "0" : "") + month}-${(day < 10 ? "0" : "") + day} ${(hour < 10 ? "0" : "") + hour}:${(minute < 10 ? "0" : "") + minute}:${(second < 10 ? "0" : "") + second}`;
                    });
                    res.send(result);
                }
                connection.release();
            });
        }
    });
});
app.get("/view", (req, res) => {
    let id = req.query.id,
        views = req.query.views;
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("UPDATE articles SET views = " + views + " WHERE id = " + id, (err, result) => {
                if (err) console.log(err);
                connection.release();
            });
        }
    });
});
app.get("/like", (req, res) => {
    let id = req.query.id,
        likes = req.query.likes,
        likeuser = req.query.likeuser;
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("UPDATE articles SET likes = " + likes + ", likeuser = '" + likeuser + "' WHERE id = " + id, (err, result) => {
                if (err) console.log(err);
                connection.release();
            });
        }
    });
});
app.get("/sort", (req, res) => {
    const type = req.query.type;
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("SELECT * FROM articles ORDER BY " + type + " DESC", (err, result) => {
                if (err) console.log(err);
                else {
                    result.forEach((item) => {
                        if (item.tags !== null) item.tags = item.tags.split(",");
                        if (item.likeuser === null) item.likeuser = "";
                        const year = item.publishtime.getFullYear(),
                            month = item.publishtime.getMonth() + 1,
                            day = item.publishtime.getDate(),
                            hour = item.publishtime.getHours(),
                            minute = item.publishtime.getMinutes(),
                            second = item.publishtime.getSeconds();
                        item.publishtime = `${year}-${(month < 10 ? "0" : "") + month}-${(day < 10 ? "0" : "") + day} ${(hour < 10 ? "0" : "") + hour}:${(minute < 10 ? "0" : "") + minute}:${(second < 10 ? "0" : "") + second}`;
                    });
                    res.send(result);
                }
                connection.release();
            });
        }
    });
});
app.get("/login", (req, res) => {
    let userName = req.query.userName,
        password = req.query.password;
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("SELECT * FROM users WHERE user_name = '" + userName + "'", (err, result) => {
                if (err) console.log(err);
                else {
                    res.send(result);
                }
                connection.release();
            });
        }
    });
});
app.get("/loginsuccess", (req, res) => {
    let userName = req.query.userName,
        password = req.query.password;
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        else {
            connection.query("UPDATE users SET lastlogintime=NOW() WHERE user_name = '" + userName + "'", (err, result) => {
                if (err) console.log(err);
                connection.release();
            });
        }
    });
    let token = jwt.sign({
        userName: userName,
        password: password
    }, secret);
    res.send(token);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
