/*
主界面的路由组件
 */
import React, {Component} from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'
import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import {getRedirectTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import Notfound from '../../components/not-found/not-found'
import Navfooter from '../../components/nav-footer/nav-footer'

 class Main extends Component {
   
  componentDidMount(){
    const {_id}=this.props.user
    const userid=Cookies.get('userid')
    if(userid&&!_id){
      this.props.getUser()
    }
  }
  NavList=[
    {
      path: '/laoban', // 路由路径 
      component: Laoban, 
      title: '大神列表', 
      icon: 'dashen', 
      text: '大神', 
    },
    {
      path: '/dashen', // 路由路径 
      component:Dashen, 
      title: '老板列表', 
      icon: 'laoban', 
      text: '老板', 
    },
    {
      path: '/message', // 路由路径 
      component:Message, 
      title: '消息列表', 
      icon: 'message', 
      text: '消息', 
    },
    {
      path: '/personal', // 路由路径 
      component:Personal, 
      title: '用户中心', 
      icon: 'personal', 
      text: '个人', 
    }
  ]
  render() {
    const userid=Cookies.get('userid')
    if(!userid){
      return <Redirect to='/login'/>
    }
    const {user,unReadCount}=this.props
    if(!user._id){
     return null
    }else{
      let path=this.props.location.pathname
      if(path==='/'){
        path=getRedirectTo(user.type,user.header)
        return <Redirect to={path}/>
      }
    }
    let {NavList}=this
    const path=this.props.location.pathname
    const currentNav=NavList.find(nav=>nav.path===path)
    if(currentNav){
      if(user.type==='laoban'){
        NavList[1].hide=true
      }else{
        NavList[0].hide=true
      }
    }
    
    return(
      <div>
        {currentNav?<NavBar  className='stick-header' >{currentNav.title}</NavBar>:null}
        <Switch>
          {
            NavList.map((nav,index)=><Route key={index} path={nav.path} component={nav.component}/>)
          }
          <Route path='/dasheninfo' component={DashenInfo}/>
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={Notfound}/>
        </Switch>
        {currentNav?<Navfooter NavList={NavList} unReadCount={unReadCount}/>:null}
      </div>
    )
  }
}
export default connect(
  state=>({user:state.user,unReadCount:state.chat.unReadCount}),
  {getUser}
)(Main)