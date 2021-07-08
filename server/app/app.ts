import express from 'express';
import mysql from 'mysql';
import config from '../config/dev.js';
import dateformat from 'dateformat'
import path from 'path';

const app = express();

const port = process.env.PORT || 3001;
app.use(express.static(__dirname + '../../../dist/sample-project'));
app.listen(port);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../dist/sample-project/index.html'));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection(config.DB_MySQL);
connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
});

// TodoList初期表示
app.get('/api/init', async (req, res) => {
    await connection.query(
        'SELECT * FROM todo_list',
        (error, results) => {
            if (error) { res.status(500).send(); }

            res.status(200).send(results);
        }
    );
});

// Todo追加処理
app.post('/api/add', async (req, res) => {
    const nowDate = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    await connection.query(
        `INSERT INTO todo_list(title, created_at, status) values('${req.body.title}', '${nowDate}', 0);`,
        (error, result) => {
            if (error) { res.status(500).send(); }

            const response = {
                id: result.insertId,
                title: req.body.title,
                created_at: nowDate,
                status: 0
            };
            res.status(200).send(response);
        }
    );
});

// チェックボックスステータス変更処理
app.put('/api/check/:id', async (req, res) => {
    await connection.query(
        `UPDATE todo_list set status=${req.body.status} where id=${req.params.id}`,
        (error, result) => {
            if (error) { res.status(500).send(); }

            res.status(204).send();
        }
    );
});

// チェックボックスステータス変更処理
app.delete('/api/delete/:ids', async (req, res) => {
    await connection.query(
        `DELETE FROM todo_list where id IN(${req.params.ids})`,
        (error, result) => {
            if (error) { res.status(500).send(); }

            res.status(204).send();
        }
    );
});

// app.listen(3001, () => {
//     console.log('test runnning');
// })

