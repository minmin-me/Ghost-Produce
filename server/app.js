const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const fs = require('fs');

app.use(session({
  secret: 'secret code',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 //쿠기 유효시간 1시간
  }
}));

const server = app.listen(3001, () => {
  console.log('Server started. port 3001')
});

let sql = require('./sql.js')

fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
  console.log('sql 변경시 재시작 없이 반영되도록 함.');
  delete require.cache[require.resolve('./sql.js')];
  sql = require('./sql.js');
});

const db = {
  database: 'uglyproject',
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: 'mariadb',
  port: 33063
};

const dbPool = require('mysql').createPool(db);

app.post('/app/login', async(request, res) => {

});

app.post('/app/logout', async(request, res) => {

});

app.post('/api/:alias', async (request, res) => {
  try {
    res.send(await req.db(request.params.alias));
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: err
    });
  }
});

const req = {
  async db(alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbPool.query(sql[alias].query + where, param, (error, rows) => {
      if (error) {
        if (error.code != 'ER_DUP_ENTRY')
          console.log(error);
        resolve({
          error
        });
      } else resolve(rows);
    }));
  }
};