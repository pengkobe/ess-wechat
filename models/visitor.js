var mongodb = require('./db');

function Visitor(vis) {
  this.openid = vis.openid;
  this.realName = vis.realName; 
  this.headimgurl = vis.headimgurl; 
  this.visitorCompany = vis.visitorCompany; 

  this.company=vis.company;
  this.hostname=vis.hostname;
  this.applytime = vis.applytime; 
  this.datetime = vis.datetime; 
  this.notes = vis.notes; // 备注

  this.state = vis.state; // 状态
};

module.exports = Visitor;

//插入
Visitor.prototype.save = function(callback) {
  //要存入数据库的用户信息文档
  var visitor = {
      openid : this.openid, 
      realName : this.realName, 
      headimgurl : this.headimgurl, 
      visitorCompany : this.visitorCompany, 

      company : this.company,
      hostname : this.hostname,
      applytime : this.applytime, 
      datetime : this.datetime, 

      notes : this.notes, // 备注
      state : this.state // 状态
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 visitors 集合
    db.collection('visitors', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      
      collection.insert(visitor, {
        safe: true
      }, function (err, visitor) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, visitor[0]);//成功！err 为 null
      });
    });
  });
};



//获取一条记录
Visitor.getone  = function(_id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 visitors 集合
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

Visitor.getall = function(openid, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('visitors', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询用户所有访问记录
      collection.find({
        "openid": openid
      }).sort({
        datetime: -1
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

//更新访问记录
Visitor.update = function(openid, hostname, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 visitors 集合
    db.collection('visitors', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "openid": openid
      }, {
        $set: {hostname: hostname}
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
