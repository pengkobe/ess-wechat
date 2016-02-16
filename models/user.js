var mongodb = require('./db');

function User(user) {
  this.openid = user.openid;  // 每个用户相对于某个公众号唯一
  this.nickname = user.nickname;
  this.sex = user.sex;
  this.headimgurl = user.headimgurl;
  this.country = user.country;
  this.city = user.city;
  this.province = user.province;
  this.unionid= user.unionid;

  this.realName= user.realName;
  this.company=user.company;

  // 自定义
  this.password = user.password; // 密码
  this.email = user.email; //邮箱
  this.identity = user.identity; // 身份
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入数据库的用户信息文档
  var user = {
      openid : this.openid,
      nickname : this.nickname,
      sex :this.sex,
      headimgurl : this.headimgurl,
      country : this.country,
      city : this.city,
      province : this.province,
      unionid : this.unionid,

      realName : this.realName,
      company: this.company,

      // 自定义
      password : this.password,// 密码
      email : this.email, //邮箱
      identity : this.identity// 身份
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

//读取用户信息
User.get = function(openid, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //按主键openid
      collection.findOne({
        openid: openid
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, user);//成功！
      });
    });
  });
};

//读取用户信息
User.login = function(username,password, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //按主键openid
      collection.findOne({
        nickname: username,
        password: password
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, user);//成功！
      });
    });
  });
};

//更新用户信息
User.update = function(openid, company,realName, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "openid": openid
      }, {
        $set: {company: company,realName:realName}
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
