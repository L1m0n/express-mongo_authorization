var mongoose = require('./lib/mongoose');
var User = require('./models/user').User;
var async = require('async');

mongoose.connection.on('open', function () {
    var db = mongoose.connection.db;
    db.dropDatabase(function (err) {
        if(err)  throw err;

        async.parallel([
            function (callback) {
                var vasya = new User({
                    userName: 'VASYA',
                    email: 'vasya@mail.ru',
                    password: 'eblan'
                });
                vasya.save(function (err) {
                    callback(err, vasya);
                })
            },
            function (callback) {
                var ivan = new User({
                    userName: 'IVAN',
                    email: 'ivan@mail.ru',
                    password: 'eblan'
                });
                ivan.save(function (err) {
                    callback(err, ivan);
                })
            },
            function (callback) {
                var kolya = new User({
                    userName: 'KOLYA',
                    email: 'kolyan@mail.ru',
                    password: 'eblan'
                });
                kolya.save(function (err) {
                    callback(err, kolya);
                })
            }
        ], function (err, results) {
            console.log(results);
            mongoose.disconnect();
        });
    })
})

