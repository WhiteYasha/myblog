import React, {Component} from 'react';
import Articlecard from "./../../components/Articlecard/Articlecard";
import {connect} from 'react-redux';
import axios from 'axios';
import {initArticles, logIn, sortArticles, initLikeArticles} from './../../actions/reducer.js';
import {Row, Col, Radio, List} from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/list/style/css';
import 'antd/lib/radio/style/css';

const stateToProps = state => ({
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
                this.props.doInitArticles(response.data);
                this.setState({loading: false});
            });
        }
    }
    componentWillMount() {
        var user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            let name = user.name;
            let data = {
                params: {name: name}
            };
            axios.all([
                axios.get("http://localhost:9000/loginSuccess", data),
                axios.get("http://localhost:9000/getLikeArticles", data)
            ]).then(axios.spread((firstResp, secondResp) => {
                let token = firstResp.data,
                    likeArticles = secondResp.data;
                axios.defaults.headers.common.authorization = token;

                this.setState({loading: false});
                this.props.doLogIn(user);
                this.props.doInitLikeArticles(likeArticles);
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
