 var settings = require('../settings'),
        Db = require('mongodb').Db,
        Connection = require('mongodb').CoServernnection,
        Server = require('mongodb').;
 module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe: true});
