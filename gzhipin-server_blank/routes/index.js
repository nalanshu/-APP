var express = require('express');
var router = express.Router();
const  md5=require('blueimp-md5');
const {UserModel,ChatModel}=require('../db/models.js');
const filter={password:0,__v:0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*router.post('/register',function(req,res){
  console.log('register()')
  console.log('register()')
  const {username,password}=req.body
  if(username==='admin'){
    res.send({code:1,msg:'用户已经存在'})
  }else{
    res.send({code:0,data:{_id:'abc123',username,password}})
  }
})*/
router.post('/register',function(req,res){
  const {username,password,type}=req.body
  UserModel.findOne({username},function(err,user){
    if(user){
      res.send({code:1,msg:'用户已存在'})
    }else{
      new UserModel({username,type,password:md5(password)}).save(function(error,user){
        res.cookie('userid',user._id, {maxAge:1000*60*60*24})
        const data={username,type, _id:user._id}
        res.send({code:0,data})
      })
    }
  })
})
router.post('/login',function(req,res){
  const {username,password}=req.body
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(user){
      res.cookie('userid',user._id, {maxAge:1000*60*60*24})
      res.send({code:0,data:user})
    }else{
      res.send({code:1,msg:'用户名或密码不正确'})
    }
  })
})
router.post('/update',function(req,res){

  const userId=req.cookies.userid
  if(!userId){
    return res.send({code:1,msg:'请先登录'})
  }
  const user=req.body
  UserModel.findByIdAndUpdate({_id:userId},user,function(error,oldUser){
    if(!oldUser){
      res.clearCookie('userid')
      res.send({code:1,msg:'请先登录'})
    }else{
      const {_id,username,type}=oldUser
      const data=Object.assign(user,{_id,username,type})
      res.send({code:0,data})
    }
  })
})
router.get('/user',function(req,res){
  const userId=req.cookies.userid
  if(!userId){
    return res.send({code:1,msg:'请先登录'})
  }
  UserModel.findOne({_id:userId},filter,function(error,user){
    res.send({code:0,data:user})
  })
})
router.get('/userlist', function (req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (error, users) {
    res.send({code: 0, data: users})
  })
})
router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid
  UserModel.find(function (err, userDocs) {
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    },{})
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})
router.post('/readmsg',function(req,res){
  const from=req.body.from
  const to=req.cookies.userid
  ChatModel.update({from, to,read:false},{read:true},{multi:true},function(err,doc){
    res.send({code:0,data:doc.nModified})
  })
})
module.exports = router;
