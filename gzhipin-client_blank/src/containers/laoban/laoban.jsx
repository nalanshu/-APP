import React,{Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'

class Laoban extends Component{
    componentDidMount(){
        this.props.getUserList('dashen')
    }
    render(){
        const {userList}=this.props
        return(
            <div>
               <UserList userList={userList}/>
            </div>
        )
    }
}
export default connect(
    state=>({userList:state.userList}),
    {getUserList}
)(Laoban)