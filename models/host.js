var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Host () {
}

module.exports = Host;

//获取一条记录
Host.getone  = function(_id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 hosts 集合
    db.collection('visitors', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      
      collection.findOne({
        "_id": new ObjectID(_id)
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
         callback(null, doc);
      });
    });
  });
};


Host.getall = function(openid, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({
        "openid": openid
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        var company=doc.company;
        // qi
         db.collection('visitors', function (err, collection) {
              if (err) {
                mongodb.close();
                return callback(err);
              }
              // 按所在公司查询
              collection.find({
                "company": company
              }).sort({
                applytime: -1
              }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                  return callback(err);
                }
                callback(null, docs);
              });

        });
        // mo
        
      });

    });
  });
};

Host.getbycompanyname = function(company, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
         if (err) {
           mongodb.close();
           return callback(err);
         }
         // 按所在公司查询
         collection.find({
           "company": company
         }).sort({
           company: -1
         }).toArray(function (err, docs) {
           mongodb.close();
           if (err) {
             return callback(err);
           }
           callback(null, docs);
         });
   });
  });
};


Host.updateState = function(_id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('visitors', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {state: 1}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};