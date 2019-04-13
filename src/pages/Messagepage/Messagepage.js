import React, {Component} from 'react';
import {Comment, List, Avatar} from 'antd';
import 'antd/lib/comment/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/avatar/style/css';
import Messageform from './../../components/Messageform/Messageform';
import axios from 'axios';
import {connect} from 'react-redux';
import {initMessages, changeLoading} from './../../actions/reducer.js';

const stateToProps = state => ({messages: state.messages, loading: state.loading});
const stateToDispatch = dispatch => {
    return {
        doInitMessages: () => {
            axios.get("http://47.111.165.97:9000/initmessages").then((response) => {
                dispatch(initMessages(response.data));
            });
        },
        doChangeLoading: (loading) => {
            dispatch(changeLoading(loading));
        }
    }
};

class Messagepage extends Component {
    constructor(props) {
        super(props);
        this.props.doChangeLoading(Object.assign({}, this.props.loading, {messageLoading: true}));
        this.props.doInitMessages();
    }
    componentDidMount() {
        this.props.doChangeLoading(Object.assign({}, this.props.loading, {messageLoading: false}));
    }
    render() {
        return (<div style={{
                padding: '0 10%'
            }}>
            <Messageform/>
            <List loading={this.props.loading.messageLoading} pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 10
                }} itemLayout="vertical" dataSource={this.props.messages} style={{
                    padding: '1em 2em'
                }} renderItem={item => (<Comment avatar={<Avatar> {
                        item.user_name.substring(0, 3)
                    }
                    </Avatar>} author={item.user_name} datetime={item.messagetime} content={<p> {
                        item.message
                    }
                    </p>}/>)}/>
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Messagepage);
