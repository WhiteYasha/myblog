import React, {Component} from 'react';
import {Form, Button, Input, message} from 'antd';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/message/style/css';
import {connect} from 'react-redux';
import axios from 'axios';
import {addMessage} from './../../actions/reducer.js';
import moment from 'moment';

const datetimeFormat = "YYYY-MM-DD HH:mm:ss";
const {TextArea} = Input;
const stateToProps = state => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user
});
const stateToDispatch = dispatch => {
    return {
        doAddMessage: (message) => {
            dispatch(addMessage(message));
        }
    }
};

class Messageform extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!this.props.isLoggedIn) message.info("请登录后才可以留言!");
                else {
                    let message = {
                            name: this.props.user.name,
                            avatar: this.props.user.avatar,
                            content: this.props.form.getFieldValue("content"),
                            messageTime: moment().format(datetimeFormat)
                        };
                    this.setState({loading: true});
                    axios.get("http://localhost:9000/postMessage", {params: message})
                    .then((response) => {
                        if (response.data.err) {
                            message.error("发表留言失败!");
                            this.setState({loading: false});
                        }
                        else {
                            this.props.doAddMessage(message);
                            this.props.form.resetFields();
                            this.setState({loading: false});
                        }
                    });
                }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        return (<Form onSubmit={this.handleSubmit}>
            <Form.Item>
                {
                    getFieldDecorator("content", {
                        rules: [
                            {required: true, message: "内容不能为空!"},
                            {max: 140, message: "内容长度不能大于140字!"}
                        ]
                    })(
                        <TextArea rows={4} style={{maxHeight: '200px'}} />
                    )
                }
            </Form.Item>
            <Form.Item>
                <Button
                    style={{float: 'right'}}
                    htmlType="submit"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                >
                    留言
                </Button>
            </Form.Item>
        </Form>);
    }
}

export default Form.create()(connect(stateToProps, stateToDispatch)(Messageform));
