import React, {Component} from 'react';
import {
    Row,
    Col,
    Form,
    Icon,
    Input,
    Button,
    message
} from 'antd';
import 'antd/lib/message/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import Signup from './../../components/Signup/Signup';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {logIn, initLikeArticles} from './../../actions/reducer.js';

const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    activeItem: state.activeItem
});
const stateToDispatch = dispatch => {
    return {
        doLogIn: (user) => {
            dispatch(logIn(user));
        },
        doInitLikeArticles: (articles) => {
            dispatch(initLikeArticles(articles));
        }
    };
};

class Loginpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signVisible: false,
            loading: false
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let name = this.props.form.getFieldValue('name'),
                    password = this.props.form.getFieldValue('password');
                let data = {
                    params: {name: name}
                };
                this.setState({loading: true});
                axios.get("http://localhost:9000/findUser", data)
                .then((response) => {
                    if (response.data.error) {
                        message.error("登录失败!");
                        this.setState({loading: false});
                    }
                    else {
                        let user = response.data.result;
                        if (user.length === 0) {
                            message.error("没有此用户!");
                            this.setState({loading: false});
                        }
                        else if (user[0].password !== password) {
                            message.error("密码错误!");
                            this.setState({loading: false});
                        }
                        else {
                            axios.all([
                                axios.get("http://localhost:9000/loginSuccess", data),
                                axios.get("http://localhost:9000/getLikeArticles", data)
                            ]).then(axios.spread((firstResp, secondResp) => {
                                if (firstResp.data.error || secondResp.data.error) {
                                    message.error("登录失败!");
                                    this.setState({loading: false});
                                }
                                else {
                                    let token = firstResp.data.result,
                                    likeArticles = secondResp.data.result;
                                    axios.defaults.headers.common.authorization = token;
                                    localStorage.setItem("user", JSON.stringify(user[0]));
                                    message.success("登录成功!");
                                    this.setState({loading: false});
                                    this.props.doLogIn(user[0]);
                                    this.props.doInitLikeArticles(likeArticles);
                                }
                            }));
                        }
                    }
                });
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.props.isLoggedIn) {
            if (this.props.activeItem === "message") return <Redirect to="/message" />
            else return <Redirect to="/" />;
        }
        else return (
            <Row align="middle">
                <Col span={8} offset={8}>
                    <Form style={{padding: '2em 0'}} onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {
                                getFieldDecorator("name", {
                                    rules: [
                                        {required: true, message: "请输入用户名!"},
                                        {max: 15, message: "用户名最长不能超过15个字!"}
                                    ]
                                })(<Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"
                                />)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator("password", {
                                    rules: [
                                        {required: true, message: "请输入密码!"}
                                    ]
                                })(<Input.Password
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="密码"
                                />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={this.state.loading}
                                type="primary"
                                htmlType="submit"
                                style={{width: "100%"}}
                            >
                                登录
                            </Button>
                            或<a onClick={() => this.setState({signVisible: true})}>马上注册!</a>
                        </Form.Item>
                    </Form>
                </Col>
                <Signup visible={this.state.signVisible} onCancel={() => this.setState({signVisible: false})}/>
            </Row>);
        }
    }

export default Form.create()(connect(stateToProps, stateToDispatch)(Loginpage));
