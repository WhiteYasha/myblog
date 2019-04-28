import React, {Component} from 'react';
import Articlecard from "./../../components/Articlecard/Articlecard";
import {connect} from 'react-redux';
import axios from 'axios';
import {initArticles, changeShowArticles, changeLoading, logIn} from './../../actions/reducer.js';
import {Row, Col, Radio, List} from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/radio/style/css';

const stateToProps = state => ({showArticles: state.showArticles, showState: state.showState, initState: state.initState.initArticles, loading: state.loading});
const stateToDispatch = dispatch => {
    return {
        doInitArticles: () => {
            axios.get("http://47.111.165.97:9000/initarticles").then((response) => {
                dispatch(initArticles(response.data));
            });
        },
        doChangeShowArticles: (state, articles) => {
            dispatch(changeShowArticles(state, articles));
        },
        doChangeLoading: (loading) => {
            dispatch(changeLoading(loading));
        },
        doLogIn: (user) => {
            dispatch(logIn(user));
        }
    }
};

class Mainpage extends Component {
    constructor(props) {
        super(props);
        if (this.props.initState === false) {
            this.props.doChangeLoading(Object.assign({}, this.props.loading, {articleLoading: true}));
            this.props.doInitArticles();
        }
    }
    componentDidMount() {
        var user = JSON.parse(localStorage.getItem("user"));
        if (user !== null) {
            let userName = user.user_name,
                password = user.password;
            let data = {
                params: {
                    userName: userName,
                    password: password
                }
            };
            this.props.doChangeLoading(Object.assign({}, this.props.loading, {logLoading: true}));
            axios.get("http://47.111.165.97:9000/loginsuccess", data)
            .then((res) => {
                let token = res.data;
                axios.defaults.headers.common.authorization = token;
            })
            .then(() => {
                this.props.doLogIn(user);
                this.props.doChangeLoading(Object.assign({}, this.props.loading, {logLoading: false}));
            });
        }
        this.props.doChangeLoading(Object.assign({}, this.props.loading, {articleLoading: false}));
    }
    handleChange = (e) => {
        let newState = e.target.value;
        if (newState !== this.props.showState) {
            this.props.doChangeLoading(Object.assign({}, this.props.loading, {articleLoading: true}));
            axios.get("http://47.111.165.97:9000/sort", {
                params: {
                    type: newState
                }
            }).then((response) => {
                this.props.doChangeShowArticles(newState, response.data);
            }).then(() => {
                this.props.doChangeLoading(Object.assign({}, this.props.loading, {articleLoading: false}));
            });
        }
    }
    render() {
        return (<div>
            <Row style={{
                    padding: "0 1em"
                }} align="middle">
                <Col span={8} offset={16}>
                    <Radio.Group defaultValue="publishtime" onChange={this.handleChange}>
                        <Radio.Button value="publishtime" icon="clock-circle">最新</Radio.Button>
                        <Radio.Button value="likes" icon="heart">最多点赞</Radio.Button>
                        <Radio.Button value="views" icon="fire">最多浏览</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <List
                style={{ margin: '1em auto'}}
                loading={this.props.loading.articleLoading}
                dataSource={this.props.showArticles}
                pagination={{
                    pageSize: 15,
                    hideOnSinglePage: true,
                    showQuickJumper: true
                }} renderItem={(item, key) => (<div style={{
                        margin: '1em',
                        width: 'calc((100% - 6em) / 3)',
                        display: 'inline-block'
                    }} key={`article-div${key}`}>
                    <Articlecard key={`article${key}`} article={item}/>
                </div>)}/>
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Mainpage);
