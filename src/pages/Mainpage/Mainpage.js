import React, {Component} from 'react';
import Articlecard from "./../../components/Articlecard/Articlecard";
import {connect} from 'react-redux';
import axios from 'axios';
import {initArticles, logIn, sortArticles, initLikeArticles} from './../../actions/reducer.js';
import {Row, Col, Radio, List, message} from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/radio/style/css';

const stateToProps = state => ({
    isLoggedIn: state.isLoggedIn,
    showArticles: state.showArticles,
    showState: state.showState,
    initState: state.initState.initArticles
});
const stateToDispatch = dispatch => {
    return {
        doInitArticles: (articles) => {
            dispatch(initArticles(articles));
        },
        doLogIn: (user) => {
            dispatch(logIn(user));
        },
        doSortArticles: (state) => {
            dispatch(sortArticles(state));
        },
        doInitLikeArticles: (articles) => {
            dispatch(initLikeArticles(articles));
        }
    }
};

class Mainpage extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: this.props.initState ? false : true};
        if (!this.props.initState) {
            axios.get("http://localhost:9000/getArticles")
            .then((response) => {
                if (response.data.error) {
                    message.error("初始化文章数据失败!");
                    this.setState({loading: false});
                }
                else {
                    this.props.doInitArticles(response.data.result);
                    this.setState({loading: false});
                }
            });
        }
    }
    componentWillMount() {
        var user = JSON.parse(localStorage.getItem("user"));
        if (user && !this.props.isLoggedIn) {
            let name = user.name;
            let data = {
                params: {name: name}
            };
            this.setState({loading: true});
            axios.all([
                axios.get("http://localhost:9000/loginSuccess", data),
                axios.get("http://localhost:9000/getLikeArticles", data)
            ]).then(axios.spread((firstResp, secondResp) => {
                if (firstResp.data.error || secondResp.data.error) {
                    message.error("自动登录失败!");
                    localStorage.removeItem("user");
                    this.setState({loading: false});
                }
                else {
                    let token = firstResp.data.result,
                    likeArticles = secondResp.data.result;
                    axios.defaults.headers.common.authorization = token;
                    this.setState({loading: false});
                    this.props.doLogIn(user);
                    this.props.doInitLikeArticles(likeArticles);
                }
            }));
        }
    }
    handleChange = (e) => {
        let newState = e.target.value;
        if (newState !== this.props.showState) {
            this.setState({loading: true});
            this.props.doSortArticles(newState);
            this.setState({loading: false});
        }
    }
    render() {
        return (<div>
            <Row style={{
                    padding: "0 1em"
                }} align="middle">
                <Col span={8} offset={16}>
                    <Radio.Group defaultValue="publishTime" onChange={this.handleChange}>
                        <Radio.Button value="publishTime" icon="clock-circle">最新</Radio.Button>
                        <Radio.Button value="likes" icon="heart">最多点赞</Radio.Button>
                        <Radio.Button value="views" icon="fire">最多浏览</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <List
                style={{ margin: '1em auto'}}
                loading={this.state.loading}
                dataSource={this.props.showArticles}
                pagination={{
                    pageSize: 15,
                    hideOnSinglePage: true,
                    showQuickJumper: true
                }}
                renderItem={(item, key) => (
                    <div
                        style={{margin: '1em', width: 'calc((100% - 6em) / 3)', display: 'inline-block'}} key={`article-div${key}`}
                    >
                        <Articlecard key={`article${key}`} article={item}/>
                    </div>)
                }/>
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Mainpage);
