import React, {Component} from 'react';
import './Header.css';
import {connect} from 'react-redux';
import {Row, Col, Menu, Icon, Avatar} from 'antd';
import {changeItem} from './../../actions/reducer.js';
import avatarimg from './../../img/avatar.JPG';
import 'antd/lib/avatar/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/row/style/css';
import {Link} from 'react-router-dom';

const Item = Menu.Item;
const stateToProps = state => ({
    activeItem: [state.home.activeItem]
});
const stateToDispatch = dispatch => {
    return {
        doChangeItem: (item) => {
            dispatch(changeItem(item));
        }
    }
}

class Header extends Component {
    changePage = key => {
        this.props.doChangeItem(key);
    }
    render() {
        return (<Row style={{
                marginBottom: 'calc(48px + 1em)'
            }}>
            <Col span={24} style={{
                    width: '100%',
                    height: '300px'
                }}>
                <img className="header-img"/>
                <Menu mode="horizontal" selectedKeys={this.props.activeItem} onClick={(item) => this.changePage(item.key)}>
                    <Item key="avatar" style={{
                            marginLeft: '3%'
                        }} disabled>
                        <Avatar src={avatarimg}/>
                    </Item>
                    <span>wYasha</span>
                    <Item className="header-menu-item" key="message" disabled>
                        <Icon type="message"/>留言
                    </Item>
                    <Item className="header-menu-item" key="picture" disabled>
                        <Icon type="picture"/>相册
                    </Item>
                    <Item className="header-menu-item" key="article">
                        <Link to="/">
                            <Icon type="book"/>文章
                        </Link>
                    </Item>
                </Menu>
            </Col>
        </Row>);
    }
}

export default connect(stateToProps, stateToDispatch)(Header);
