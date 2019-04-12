import React, {Component} from 'react';
import Articlecard from "./../../components/Articlecard/Articlecard";
import {connect} from 'react-redux';
import axios from 'axios';
import {initArticles, changeShowArticles} from './../../actions/reducer.js';
import {Row, Col, Radio} from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/radio/style/css';

const stateToProps = state => ({showArticles: state.showArticles, showState: state.showState, initState: state.initState.initArticles});
const stateToDispatch = dispatch => {
    return {
        doInitArticles: () => {
            axios.get("http://localhost:9000/initarticles").then((response) => {
                dispatch(initArticles(response.data));
            });
        },
        doChangeShowArticles: (state) => {
            axios.get("http://localhost:9000/sort", {
                params: {
                    type: state
                }
            }).then((response) => {
                dispatch(changeShowArticles(state, response.data));
            });
        }
    }
};

class Mainpage extends Component {
    constructor(props) {
        super(props);
        if (this.props.initState === false) {
            this.props.doInitArticles();
        }
    }
    handleChange = (e) => {
        let newState = e.target.value;
        if (newState !== this.props.showState) {
            this.props.doChangeShowArticles(newState);
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
            {
                this.props.showArticles.map((item, key) => {
                    return (<div style={{
                            margin: '1em',
                            width: 'calc((100% - 6em) / 3)',
                            display: 'inline-block'
                        }} key={`article-div${key}`}>
                        <Articlecard key={`article${key}`} article={item}/>
                    </div>);
                })
            }
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Mainpage);
