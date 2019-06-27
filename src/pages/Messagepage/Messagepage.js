import React, {Component} from 'react';
import {Comment, List, Avatar, message, Modal} from 'antd';
import 'antd/lib/comment/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/avatar/style/css';
import Messageform from './../../components/Messageform/Messageform';
import axios from 'axios';
import {connect} from 'react-redux';
import {initMessages, deleteMessage} from './../../actions/reducer.js';

const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    messages: state.messages,
    initState: state.initState.initMessages
});
const stateToDispatch = dispatch => {
    return {
        doInitMessages: (messages) => {
            dispatch(initMessages(messages));
        },
        doDeleteMessage: (id) => {
            dispatch(deleteMessage(id));
        }
    }
};

class Messagepage extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: this.props.initState ? false : true};
        if (!this.props.initState) {
            axios.get("http://localhost:9000/getMessages")
            .then((response) => {
                if (response.data.error) {
                    message.error("初始化留言数据失败!");
                    this.setState({loading: false});
                }
                else {
                    this.props.doInitMessages(response.data.result);
                    this.setState({loading: false});
                }
            });
        }
    }
    handleDelete = (id) => {
        Modal.confirm({
            title: "删除留言",
            content: "确定要删除这条留言吗?",
            okText: "确定",
            cancelText: "取消",
            okButtonProps: {
                loading: this.state.loading
            },
            onOk: () => {
                this.setState({loading: true});
                axios.get("http://localhost:9000/deleteMessage", {params: {id: id}})
                .then((response) => {
                    if (response.data.error) {
                        message.error("删除失败!");
                        this.setState({loading: false});
                    }
                    else {
                        this.props.doDeleteMessage(id);
                        message.success("删除成功!");
                        this.setState({loading: false});
                    }
                });
            }
        });
    }
    render() {
        return (
            <div style={{padding: '0 10%'}}>
                <Messageform/>
                <List
                    loading={this.state.loading}
                    pagination={{pageSize: 10}}
                    itemLayout="vertical"
                    dataSource={this.props.messages}
                    style={{padding: '1em 2em'}}
                    renderItem={
                        item => (
                            <Comment
                                avatar={<Avatar src={item.avatar} />}
                                actions={
                                    this.props.isLoggedIn && this.props.user.type === "ADMIN" ? 
                                    [
                                        <a onClick={() => this.handleDelete(item.id)}>删除</a>
                                    ] : null
                                }
                                author={item.name}
                                datetime={item.messageTime}
                                content={<p>{item.content}</p>}
                            />
                        )
                    }
                />
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Messagepage);
