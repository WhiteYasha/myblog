import React, {Component} from 'react';
import './Header.css';
import {connect} from 'react-redux';
import {changeItem, logOut} from './../../actions/reducer.js';
import {Row, Col, Menu, Icon, Avatar, Modal} from 'antd';
import 'antd/lib/avatar/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/row/style/css';
import {Link} from 'react-router-dom';
import EditAvatar from './../EditAvatar/EditAvatar';

const Item = Menu.Item;
const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    activeItem: [state.activeItem],
});
const stateToDispatch = dispatch => {
    return {
        doChangeItem: (item) => {
            dispatch(changeItem(item));
        },
        doLogOut: () => {
            dispatch(logOut());
        }
    }
};

class Header extends Component {
    constructor(props) {
        super(props);
        let pathname = window.location.pathname,
            activeItem;
        if (pathname === "/login")
            activeItem = "login";
        else if (pathname === "/message")
            activeItem = "message";
        else if (pathname === "/picture")
            activeItem = "picture";
        else
            activeItem = "article";
        this.props.doChangeItem(activeItem);
        this.state = {logOutVisible: false, editAvatarVisible: false};
    }
    changeItem = key => {
        this.props.doChangeItem(key);
    }
    handleOK = e => {
        this.props.doLogOut();
        localStorage.removeItem("user");
        this.setState({logOutVisible: false});
    }
    handleLogOut = () => {
        Modal.confirm({
            title: "退出登录",
            content: "你确定要退出登录吗?",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                this.props.doLogOut();
            }
        });
    }
    render() {
        return (
            <div>
                <Row style={{marginBottom: 'calc(48px + 1em)'}}>
                    <Col span={24} style={{width: '100%', height: '300px'}}>
                        <div className="header-img"/>
                        <Menu
                            mode="horizontal"
                            selectedKeys={this.props.activeItem}
                        >
                            {
                                this.props.isLoggedIn ?
                                (<Menu.SubMenu
                                    style={{marginLeft: 'calc(100% / 24)'}}
                                    title={
                                        <div>
                                            <Avatar src={this.props.user.avatar}/>
                                            <span style={{marginLeft: '16px'}}>{this.props.user.name}</span>
                                        </div>
                                    }
                                >
                                    <Item onClick={() => this.setState({editAvatarVisible: true})}>修改头像</Item>
                                    {
                                        this.props.user.type === "ADMIN" ? 
                                            (<Item key="add" onClick={(item) => this.changeItem(item.key)}>
                                                <Link to="/addarticle">添加文章</Link>
                                            </Item>) : null
                                    }
                                    <Item onClick={this.handleLogOut}>退出登录</Item>
                                </Menu.SubMenu>)
                                :
                                (<Item key="login" style={{marginLeft: '3%'}}>
                                    <Link to="/login">登陆</Link>
                                </Item>)
                            }
                            <Item className="header-menu-item" key="message" onClick={(item) => this.changeItem(item.key)}>
                                <Link to="/message">
                                    <Icon type="message"/>留言
                                </Link>
                            </Item>
                            <Item className="header-menu-item" key="picture" disabled >
                                <Icon type="picture"/>相册
                            </Item>
                            <Item className="header-menu-item" key="article" onClick={(item) => this.changeItem(item.key)}>
                                <Link to="/">
                                    <Icon type="book"/>文章
                                </Link>
                            </Item>
                        </Menu>
                    </Col>
                </Row>
                {
                    this.props.isLoggedIn ? (
                    <EditAvatar
                        visible={this.state.editAvatarVisible}
                        onCancel={() => this.setState({editAvatarVisible: false})}
                    />) : null
                }
            </div>
        );
    }
}

export default connect(stateToProps, stateToDispatch)(Header);
