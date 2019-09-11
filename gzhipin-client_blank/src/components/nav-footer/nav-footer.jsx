import React from "react" 
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
const Item=TabBar.Item 
class NavFooter extends React.Component { 
    static propTypes={
        NavList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render() {
        let {NavList,unReadCount}=this.props
        let navlist=NavList.filter(nav=>!nav.hide)
        const path=this.props.location.pathname 
        
        return (
            <TabBar>
                {
                    navlist.map((nav)=>(<Item key={nav.path} 
                        badge={nav.path==='/message'? unReadCount :0}
                        title={nav.title}
                        icon={{uri:require(`./images/${nav.icon}.png`)}}
                        selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                        selected={path===nav.path}
                        onPress={()=>{this.props.history.replace(nav.path)}}/>))
                }
            </TabBar>
        ) 
    } 
}
export default withRouter(NavFooter)