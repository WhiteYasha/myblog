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
            connection.query("SELECT * FROM articles_view", (err, result) => {
                if (err) console.log(err);
                else {
                    result.forEach((item) => {
                        if (item.tags !== null) item.tags = item.tags.split(",");
                        const datetime = item.publishtime;
                        item.publishtime = `${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
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
                        const datetime = item.publishtime;
                        item.publishtime = `${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
                    });
                    res.send(result);
                }
                connection.release();
            });
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
