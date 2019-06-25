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

const Item = Menu.Item;
const stateToProps = state => ({
    user: state.user,
    activeItem: [state.activeItem],
    isLoggedIn: state.isLoggedIn
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
        this.state = {logOutVisible: false};
    }
    changeItem = key => {
        this.props.doChangeItem(key);
    }
    handleClick = e => {
        this.setState({logOutVisible: true});
    }
    handleOK = e => {
        this.props.doLogOut();
        localStorage.removeItem("user");
        this.setState({logOutVisible: false});
    }
    handleCancel = e => {
        this.setState({logOutVisible: false});
    }
    render() {
        return (
            <Row style={{marginBottom: 'calc(48px + 1em)'}}>
                <Col span={24} style={{width: '100%', height: '300px'}}>
                    <div className="header-img"/>
                    <Menu
                        mode="horizontal"
                        selectedKeys={this.props.activeItem}
                        onClick={(item) => this.changeItem(item.key)}
                    >
                        {
                            this.props.isLoggedIn ?
                            (<Item key="avatar" style={{marginLeft: '3%'}}>
                                <Avatar onClick={this.handleClick} src={this.props.user.avatar}/>
                            </Item>)
                            :
                            (<Item key="login" style={{marginLeft: '3%'}}>
                                <Link to="/login">登陆</Link>
                            </Item>)
                        }
                        {
                            this.props.isLoggedIn ? <span>{this.props.user.name}</span> : null
                        }
                        <Item className="header-menu-item" key="message">
                            <Link to="/message">
                                <Icon type="message"/>留言
                            </Link>
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
                    <Modal
                        title="退出登录"
                        visible={this.state.logOutVisible}
                        onOk={this.handleOK}
                        onCancel={this.handleCancel}
                    >
                        <p>确定退出登录吗?</p>
                    </Modal>
                </Col>
            </Row>
        );
    }
}

export default connect(stateToProps, stateToDispatch)(Header);
