const mongoose=require('mongoose');
const  md5=require('blueimp-md5')
mongoose.connect('mongodb://localhost:27017/gzhipin_test',{useNewUrlParser: true});
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
    }
});
const UserModel=mongoose.model("user",useSchema);
function testsave(){
    const userModel=new UserModel({username:'Tom',password:md5('123'),type:'dashen'})
    userModel.save(function(err,user){
        console.log('save()',err, user)
    })
}
//testsave()
function find(){
    UserModel.find({"_id" : '5d4bf7be7dd16b42d082838c'},function(err,users){
        console.log('find()',err,users)
    })
    UserModel.findOne({"_id" : '5d4bf7be7dd16b42d082838c'},function(err,user){
        console.log('find()',err,user)
    })
}
//find()
function update(){
    UserModel.update({"_id" : '5d4bf7be7dd16b42d082838c'},{username:'jenny'},function(err,doc){
            console.log('updata()',err,doc)
        }
    )
}
//update()
function remove(){
    UserModel.remove({"_id" : '5d4bf7be7dd16b42d082838c'},function(err,doc){
        console.log('updata()',err,doc)
    })
}
remove()