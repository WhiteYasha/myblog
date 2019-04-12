import React, {Component} from 'react';
import {Form, Button, Input, message} from 'antd';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/message/style/css';
import {connect} from 'react-redux';
import axios from 'axios';
import {initMessages, changeLoading, addMessage} from './../../actions/reducer.js';

const {TextArea} = Input;
const stateToProps = state => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    loading: state.loading
});
const stateToDispatch = dispatch => {
    return {
        doInitMessage: (messages) => {
            dispatch(initMessages(messages));
        },
        doChangeLoading: (loading) => {
            dispatch(changeLoading(loading));
        }
    }
};

class Messageform extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!this.props.isLoggedIn)
                    message.info("请登录后才可以留言!");
                else {
                    this.props.doChangeLoading(Object.assign({}, this.props.loading, {messageLoading: true}));
                    let data = {
                            params: {
                                userName: this.props.user.user_name,
                                message: this.props.form.getFieldValue("message")
                            }
                        };
                }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (<Form onSubmit={this.handleSubmit}>
            <Form.Item>
                {
                    getFieldDecorator("message", {
                        rules: [
                            {
                                required: true,
                                message: "内容不能为空!"
                            }, {
                                max: 140,
                                message: "内容长度不能大于140字!"
                            }
                        ]
                    })(<TextArea rows={4} style={{
                            maxHeight: '200px'
                        }}/>)
                }
            </Form.Item>
            <Form.Item>
                <Button style={{
                        float: 'right'
                    }} htmlType="submit" onClick={this.handleSubmit} loading={this.props.loading.messageLoading}>
                    留言
                </Button>
            </Form.Item>
        </Form>);
    }
}

export default Form.create()(connect(stateToProps, stateToDispatch)(Messageform));
