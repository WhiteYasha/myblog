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

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let name = this.props.form.getFieldValue("name"),
                    password = this.props.form.getFieldValue("password"),
                    confirmPassword = this.props.form.getFieldValue("confirmPassword");
                if (password !== confirmPassword)
                    message.error("确认密码与密码不一致!");
                else {
                    this.setState({loading: true});
                    axios.get("http://localhost:9000/findUser", {params: {name: name}})
                    .then((response) => {
                        if (response.data.error) {
                            message.error("注册失败!");
                            this.setState({loading: false});
                        }
                        else {
                            let exists = response.data.result.length > 0;
                            if (exists) message.info("该用户名已存在!");
                            else {
                                let data = {
                                    params: {
                                        name: name,
                                        password: password
                                    }
                                };
                                axios.get("http://localhost:9000/sign", data).then((response) => {
                                    if (response.data.error) {
                                        message.error("注册失败!");
                                        this.setState({loading: false});
                                    }
                                    else {
                                        message.success("注册成功!");
                                        this.props.form.resetFields();
                                        this.setState({loading: false});
                                        this.props.onCancel();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                visible={this.props.visible}
                title="注册"
                footer={null}
                onCancel={this.props.onCancel}
                destroyOnClose
            >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item>
                        {
                            getFieldDecorator("name", {
                                rules: [
                                    {required: true, message: "请输入用户名!"},
                                    {max: 15, messgae: "用户名最长不能大于15字!"}
                                ]
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用户名"/>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator("password", {
                                rules: [
                                    {required: true, message: "请输入密码!"},
                                    {max: 20, message: "密码长度不能大于30位!"},
                                    {min: 6, message: "密码长度不能小于6位!"}
                                ]
                            })(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="密码"/>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator("confirmPassword", {
                                rules: [
                                    {required: true, message: "请确认密码!"},
                                    {max: 20, message: "密码长度不能大于30位!"}
                                ]
                            })(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="确认密码"/>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>注册</Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(Signup);
