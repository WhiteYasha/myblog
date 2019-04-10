const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const port = 9000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
            })
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
