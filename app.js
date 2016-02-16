var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var settings = require('./settings');
var routes = require('./routes/index');
var dealWechat = require('./routes/dealWechat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '/public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {maxAge : 86400000}));

// session mongodb
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    url: settings.dbUrl
  })
}));

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' hietech-nodejs')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/', routes);

var wechat = require('wechat');
//var config = {
//  token: 'pengyi_kobepeng',
//  appid: 'wx73c22f5b3c841dd2',
//  encodingAESKey: 'xkFi3jisAGd7iNbYkftRly0UicQsAL953a2BNyV3B3d'
//};

//var secret = '136c70fe1c4698a3508a26d6de12bb25';

var config = {
  token: 'kobepeng',
  appid: 'wx888300469dbe9436',
  encodingAESKey: 'xkFi3jisAGd7iNbYkftRly0UicQsAL953a2BNyV3B3d'
};

var secret = 'd4624c36b6795d1d99dcf0547af5443d';

//var OAuth = require('wechat-oauth');
//var client = new OAuth(config.appid, secret);

//var WechatAPI = require('wechat-api');
//var wapi = new WechatAPI(config.appid, secret);

app.use(express.query());
app.use('/wechat', wechat(config, dealWechat));


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
