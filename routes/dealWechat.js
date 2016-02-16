/*  微信自动回复消息 */

var settings = require('../settings');
var User = require('../models/user.js');


// 无用，why？
// var OAuth = require('wechat-oauth');
// var client = new OAuth(settings.appid, settings.secret);

var WechatAPI = require('wechat-api');
var wapi = new WechatAPI(settings.appid, settings.secret);

var dealWechat =  function (req, res, next) {
  var message = req.weixin;

  User.get(message.FromUserName,function(err, user){
    if(err || !user){
       wapi.getUser(message.FromUserName, function (err, result) {
          console.log('getUser:'+ result);
          var userinfo = result;
          var searchUser = new User({
               openid : userinfo.openid,
               nickname : userinfo.nickname,
               sex :userinfo.sex,
               headimgurl : userinfo.headimgurl,
               country : userinfo.country,
               city : userinfo.city,
               province : userinfo.province,
               unionid : userinfo.unionid,

              // needed 
              realName : userinfo.realName,
              company: userinfo.company,

               // possible use
               password : '', // 密码
               email : '',//邮箱
               identity : '' // 身份
          });

          //如果不存在则新增用户
          searchUser.save(function (err, user) {
            if (err) {
              console.log('save user error!');
            }
          });
       });
    }
  });
   
   res.reply('hehe,您发消息给我呃。');
   return;
 
  wapi.sendText(message.FromUserName, 'Hello world', function(err,info){
  });

  var message = req.weixin;
  var mesageType = message.MsgType;
  var userOpenid = message.FromUserName;
  var createTime = message.CreateTime;
  // ToUserName MsgId Content
   res.reply('消息开始.');
   switch(messageType){
        case 'text' :
          res.reply('文本消息.');
          break;
        case 'voice' :
          res.reply('语音消息.');
          break;
        case 'video' :
          res.reply('视频消息.');
          break;
        case 'shortvedio' :
          res.reply('短视频消息.');
          break;
        case 'location' :
          res.reply('位置消息.');
          break;
        case 'link' :
          res.reply('链接消息.');
          break;
        case 'event' :
          dealEvent(req, res, next);
          break;
          default :break;
   }
}

/*  微信事件消息  */
function dealEvent(req, res, next){

}

module.exports = dealWechat;
