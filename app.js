var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { createClient } = require('redis');


var indexRouter = require('./routes/index');

const redisClient = createClient({
  username: 'default',
  password: 'X06WbL52ikDsS1HNrbbps2f6yqaZDEW0',
  socket: {
      host: 'redis-14007.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 14007
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

(async () => {
  await redisClient.connect();
})();

const allowedOrigin = "http://localhost:5173"

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

var app = express();

app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});

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
