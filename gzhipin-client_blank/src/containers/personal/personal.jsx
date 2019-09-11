import React,{Component} from 'react'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {Result,List,Button,WhiteSpace,Modal} from 'antd-mobile'
import {resetUser} from '../../redux/actions'
const Item=List.Item
const Brief=Item.Brief
class Personal extends Component{ 
    logOut=()=>{
        Modal.alert('退出', '确认退出登陆？', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
              text: '确认',
              onPress: () =>{
                Cookies.remove('userid')
                this.props.resetUser()
              }
            },
          ])
    }
    render(){
        const {username,salary,info,header,company,post}=this.props.user
        return(
            <div style={{marginTop:50}}>
              <Result
              img={<img src={require(`../../assets/images/${header}.png`)} style={{width:50}} alt='header'/>}
              title={username}
              message={company}/>
              <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary?<Brief>薪资：{salary}</Brief>:null}
                    </Item>
              </List>
              <WhiteSpace/>
              <List>
                  <Button type='warning' onClick={this.logOut}>退出登录</Button>
              </List>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {resetUser}
)(Personal)