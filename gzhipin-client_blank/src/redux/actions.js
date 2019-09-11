/*
包含n个action creator
异步action
同步action
 */
import io from 'socket.io-client'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from './action-types'
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg
} from '../api/index'


/*
单例对象
1. 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
2. 创建对象之后: 保存对象
 */



// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data:msg})
// 接收用户的同步action
const receiveUser=(user)=>({type:RECEIVE_USER,data:user})
// 重置用户的同步action
export const resetUser=(msg)=>({type:RESET_USER,data:msg})
const receiveUserList=(userList)=>({type:RECEIVE_USER_LIST,data:userList})
const receiveMsgList=({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
const receiveMsg=(chatMsg,userid)=>({type:RECEIVE_MSG,data:{chatMsg,userid}})
const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})
// 注册异步action
export const register = (user) => {
  const {username, password, password2, type} = user
  // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
  if(!username) {
    return errorMsg('用户名必须指定!')
  } else if(password!==password2) {
    return errorMsg('2次密码要一致!')
  }
  // 表单数据合法, 返回一个发ajax请求的异步action函数
  return async dispatch => {


    // 发送注册的异步ajax请求
    /*const promise = reqRegister(user)
    promise.then(response => {
      const result = response.data  // {code: 0/1, data: user, msg: ''}
    })*/
    const response = await reqRegister({username, password, type})
    const result = response.data //  {code: 0/1, data: user, msg: ''}
    if(result.code===0) {// 成功
      getMsgList(dispatch,result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else { // 失败
      // 分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 登陆异步action
export const login = (user) => {

  const {username, password} = user
  // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
  if(!username) {
    return errorMsg('用户名必须指定!')
  } else if(!password) {
    return errorMsg('密码必须指定!')
  }

  return async dispatch => {
    // 发送注册的异步ajax请求
    /*const promise = reqLogin(user)
    promise.then(response => {
      const result = response.data  // {code: 0/1, data: user, msg: ''}
    })*/
    const response = await reqLogin(user)
    const result = response.data
    if(result.code===0) {// 成功
      getMsgList(dispatch,result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else { // 失败
      // 分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

export const updateUser=(user)=>{
  return async dispatch=>{
    const response=await reqUpdateUser(user)
    const result=response.data
    if(result.code===0){
      dispatch(receiveUser(result.data))
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}

export const getUser=()=>{
  return async dispatch=>{
    const response=await reqUser()
    const result=response.data
    if(result.code===0){
      getMsgList(dispatch,result.data._id)
      dispatch(receiveUser(result.data))
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data
    if(result.code===0) {
      dispatch(receiveUserList(result.data))
    }
  }
}
function initIO(dispatch,userid){ 
  if(!io.socket){
    io.socket=io('ws://localhost:4000')
    io.socket.on('receiveMsg',function(chatMsg){
      console.log('客户端接收服务端发送的消息',chatMsg)
      if(userid===chatMsg.from || userid===chatMsg.to){
          dispatch(receiveMsg(chatMsg,userid))
      }
    })
  }
}
export const sendMsg=({from,to,content})=>{
  return dispatch=>{
    console.log('客户端向服务器发消息',{from,to,content})
    io.socket.emit('sendMsg',{from,to,content})
  }
}
async function getMsgList(dispatch,userid){
  initIO(dispatch,userid)
  const response=await reqChatMsgList()
  const result=response.data
  if(result.code===0){
    const {users,chatMsgs}=result.data
    dispatch(receiveMsgList({users,chatMsgs,userid}))
  }
}
export const readMsg=(from,to)=>{
  return async dispatch=>{
    const response=await reqReadMsg(from)
    const result=response.data
    if(result.code===0){
      const count=result.data
      dispatch(msgRead({count,from,to}))
    }
  }
}