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
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {logIn} from './../../actions/reducer.js';

const stateToProps = state => ({user: state.user, isLoggedIn: state.isLoggedIn});
const stateToDispatch = dispatch => {
    return {
        doLogIn: (user) => {
            dispatch(logIn(user));
        }
    }
};

class Loginpage extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let userName = this.props.form.getFieldValue('userName');
                let password = this.props.form.getFieldValue('password');
                let data = {
                    params: {
                        userName: userName,
                        password: password
                    }
                };
                axios.get("http://localhost:9000/login", data)
                .then((response) => {
                    let user = response.data;
                    if (user.length === 0)
                        message.error("没有此用户!");
                    else if (user[0].password !== password)
                        message.error("密码错误!");
                    else {
                        axios.get("http://localhost:9000/loginsuccess", data)
                        .then((res) => {
                            let token = res.data;
                            axios.defaults.headers.common.authorization = token;
                        });
                        message.success("登录成功!");
                        this.props.doLogIn(user[0]);
                    }
                });
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.props.isLoggedIn)
            return <Redirect to="/"/>
        else
            return (<Row align="middle">
                <Col span={8} offset={8}>
                    <Form style={{
                            padding: '2em 0'
                        }} onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {
                                getFieldDecorator("userName", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入用户名!"
                                        }
                                    ]
                                })(<Input prefix={<Icon type = "user" style = {{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用户名"/>)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator("password", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入密码!"
                                        }
                                    ]
                                })(<Input.Password prefix={<Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} placeholder="密码"/>)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{
                                    width: "100%"
                                }}>登录</Button>
                            或<Link to="/">马上注册!</Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>);
        }
    }

export default Form.create()(connect(stateToProps, stateToDispatch)(Loginpage));
