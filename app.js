var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Load dotenv environment variables
require('dotenv').config();

//Winston setup
const logger = require('./config/winston.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://dba:f*xxNoa#t8Za3pV@ds249127.mlab.com:49127/stahb', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', (e) => logger.error('Mongoose connection error: ' + e));
db.once('open', function() {
  logger.info('Connected to mongo database')
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
