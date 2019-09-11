/**
 * Created by Lenovo on 2019/8/14.
 */
module .exports=function(server){
    const io=require('socket.io')(server)
    io.on('connection',function(socket){
        console.log('有一个浏览器连接上服务器连接成功')
        socket.on('sendMsg',function(data){
            console.log('服务器接收消息',data)
            data.name=data.name.toUpperCase()
            socket.emit('receiveMsg',data)
        })
    })
}