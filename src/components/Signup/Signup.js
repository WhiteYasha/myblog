import React, {Component} from 'react';
import {
    Form,
    Input,
    Modal,
    Button,
    Icon,
    message
} from 'antd';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/message/style/css';
import axios from 'axios';
import {connect} from 'react-redux';
import {changeSignVisible, changeLoading} from './../../actions/reducer.js';

const stateToProps = state => ({signVisible: state.signVisible, loading: state.loading});
const stateToDispatch = dispatch => {
    return {
        doChangeSignVisible: (visible) => {
            dispatch(changeSignVisible(visible));
        },
        doChangeLoading: (loading) => {
            dispatch(changeLoading(loading));
        }
    }
};

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let userName = this.props.form.getFieldValue("userName"),
                    password = this.props.form.getFieldValue("password"),
                    confirmPassword = this.props.form.getFieldValue("confirmPassword");
                if (password !== confirmPassword)
                    message.error("确认密码与密码不一致!");
                else {
                    this.props.doChangeLoading(Object.assign({}, this.props.loading, {signLoading: true}));
                    axios.get("http://47.111.165.97:9000/finduser", {
                        params: {
                            user_name: userName
                        }
                    }).then((response) => {
                        let exists = response.data;
                        if (exists)
                            message.info("该用户名已存在!");
                        else {
                            let data = {
                                params: {
                                    user_name: userName,
                                    password: password
                                }
                            };
                            axios.get("http://47.111.165.97:9000/sign", data).then(() => {
                                message.success("注册成功!");
                                this.props.form.resetFields();
                                this.props.doChangeLoading(Object.assign({}, this.props.loading, {signLoading: false}));
                                this.props.doChangeSignVisible(false);
                            });
                        }
                    });
                }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (<Modal visible={this.props.signVisible} title="注册" footer={null} onCancel={() => this.props.doChangeSignVisible(false)}>
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {
                        getFieldDecorator("userName", {
                            rules: [
                            {
                                    required: true,
                                    message: "请输入用户名!"
                            }, {
                                    max: 15,
                                    messgae: "用户名不能大于15字!"
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
                            }, {
                                    max: 30,
                                    message: "密码长度不能大于30位!"
                            }, {
                                    min: 6,
                                    message: "密码长度不能小于6位!"
                            }
                            ]
                        })(<Input.Password prefix={<Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} placeholder="密码"/>)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator("confirmPassword", {
                            rules: [
                            {
                                    required: true,
                                    message: "请确认密码!"
                            }, {
                                    max: 30,
                                    message: "密码长度不能大于30位!"
                            }
                            ]
                        })(<Input.Password prefix={<Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} placeholder="确认密码"/>)
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        </Modal>);
    }
}

export default Form.create()(connect(stateToProps, stateToDispatch)(Signup));
