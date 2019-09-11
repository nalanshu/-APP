/**
 * Created by Lenovo on 2019/8/15.
 */
/**
 * Created by Lenovo on 2019/8/14.
 */
const {ChatModel}=require('../db/models.js')
module .exports=function(server){
    const io=require('socket.io')(server)
    io.on('connection',function(socket){
        console.log('有一个浏览器连接上服务器连接成功')
        socket.on('sendMsg',function({from,to,content}){
            const create_time=Date.now()
            const chat_id=[from,to].sort().join('_')
            new ChatModel({from,to,content,chat_id,create_time}).save(function(error,chatMsg){
                io.emit('receiveMsg',chatMsg)
            })
        })
    })
}