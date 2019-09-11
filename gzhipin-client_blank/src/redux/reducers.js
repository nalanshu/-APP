/*
包含n个reducer函数: 根据老的state和指定的action返回一个新的state
 */
import {combineReducers} from 'redux'
import {getRedirectTo} from '../utils'

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

const initUser = {
  username: '', // 用户名
  type: '', // 用户类型 dashen/laoban
  msg: '', // 错误提示信息
  redirectTo: '' // 需要自动重定向的路由路径
}
// 产生user状态的reducer
function user(state=initUser, action) {
  
  switch (action.type) {
    case AUTH_SUCCESS: // data是user
    const {type,header}=action.data
      return {...action.data,redirectTo:getRedirectTo(type,header)}
    case ERROR_MSG: // data是msg
      return {...state, msg: action.data}
    case RECEIVE_USER: // data是msg
      return action.data
    case RESET_USER: // data是msg
      return {...initUser, msg: action.data}
    default:
      return state
  }
}

const initUserList=[]
function userList(state=initUserList,action){
  switch(action.type){
    case RECEIVE_USER_LIST:
      return action.data
    default:
      return state
  }
}

const initChat={
  users:{},
  chatMsgs:[],
  unReadCount:0
}
function chat(state=initChat,action){
  switch(action.type){
    case RECEIVE_MSG_LIST:
      const {users,chatMsgs,userid}=action.data
      return {
        users,
        chatMsgs,
        unReadCount:chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid?1:0),0)
      }
    case RECEIVE_MSG:
      const {chatMsg}=action.data
      return {
        users:state.users,
        chatMsgs:[...state.chatMsgs,chatMsg],
        unReadCount:state.unReadCount+(!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
      }
    case MSG_READ:
      const {count,from,to}=action.data
      return {
        users:state.users,
        chatMsgs:state.chatMsgs.map(msg=>{
          if(msg.from===from&&msg.to===to&&!msg.read){
            return {...msg,read:true}
          }else{
            return msg
          }
        }),
        unReadCount:state.unReadCount-count
      }
    default:
      return state
  }
}
export default combineReducers({
  user,
  userList,
  chat
})
// 向外暴露的状态的结构: {user: {}, userList: [], chat: {}}

