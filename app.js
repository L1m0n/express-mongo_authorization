var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var http = require('http');
var User = require('./models/user').User;
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
    secret: 'ololo',
    store: new MongoStore({
        host: '127.0.0.1',
        db: 'session',
        url: 'mongodb://localhost/test'
    })
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res, next) {
    fs.readFile('index.html', 'utf8', function(err, contents) {
        res.end(contents);
    });

})

app.post('/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var userName = req.body.userName;
    User.findOne({email: email}, function (err, user) {
        if(user) {
            if(user.checkPassword(password)) {
                res.end('OK')
            } else {
                res.end('wrong password');
            }
        } else {
            res.end('user not exist!')
        }
    })
})

app.post('/register', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var userName = req.body.userName;
    var user = new User({userName: userName, email: email, password: password, });

    User.findOne({email: email}, function (err, usr) {
        if(!usr) {
            user.save(function (err) {
                if (err) {
                    console.log(err.errmsg);
                    res.end('error');
                } else {
                    res.end('ok');
                }
            })
        } else {
            res.end('email already exist');
        }
    });

})


http.createServer(app).listen(3000);
