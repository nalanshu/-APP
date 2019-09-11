import io from 'socket.io-client'
const socket=io('ws://localhost:4000')
socket.on('receiveMsg',function(data){
    console.log('浏览器接收到服务器的消息',data)
})
socket.emit('sengMsg',{name:'zhangsan'})
console.log('浏览器向服务器发送消息',{name:'zhangsan'})