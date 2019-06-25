import React, {Component} from 'react';
import {Comment, List, Avatar} from 'antd';
import 'antd/lib/comment/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/avatar/style/css';
import Messageform from './../../components/Messageform/Messageform';
import axios from 'axios';
import {connect} from 'react-redux';
import {initMessages} from './../../actions/reducer.js';

const stateToProps = state => ({
    messages: state.messages,
    initState: state.initState.initMessages
});
const stateToDispatch = dispatch => {
    return {
        doInitMessages: (messages) => {
            dispatch(initMessages(messages));
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
                this.props.doInitMessages(response.data);
                this.setState({loading: false});
            });
        }
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
