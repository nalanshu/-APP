/**
 * Created by Lenovo on 2019/8/8.
 */
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/gzhipin',{useNewUrlParser: true});
mongoose.connection.once("open",function(){
    console.log("连接成功")
});
const Schema=mongoose.Schema;
const useSchema=new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    header:{
        type:String
    },
    post:{
        type:String
    },
    info:{
        type:String
    },
    company:{
        type:String
    },
    salary:{
        type:String
    }
});
const UserModel=mongoose.model('gzhipin',useSchema)

const chatSchema=new Schema({
    from:{type:String, required:true},
    to:{type:String, required:true},
    chat_id:{type:String, required:true},
    content:{type:String, required:true},
    read:{type:Boolean, default:false},
    create_time:{type:Number},
})
const ChatModel=mongoose.model('chat',chatSchema)
exports.UserModel=UserModel
exports.ChatModel=ChatModel