const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

app.use(function(req, res, next) {
    let ress = {
      code: '01',
      message: "Failed, URL tidak ditemukan",
      data: []
  }
  res.send(ress);
  });
  

module.exports = app;
