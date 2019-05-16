import React, {Component} from 'react';
import "github-markdown-css/github-markdown.css";
import './Articlepage.css';
import Markdown from 'react-markdown';
import {Layout, Divider, Icon, Empty, message} from 'antd';
import 'antd/lib/layout/style/css';
import 'antd/lib/message/style/css';
import 'antd/lib/empty/style/css';
import 'antd/lib/divider/style/css';
import axios from 'axios';
import {connect} from 'react-redux';
import {changeLikes} from './../../actions/reducer.js';

const {Content} = Layout;
const stateToProps = state => ({
    user: state.user,
    watchArticle: state.watchArticle,
    article: state.watchArticle === -1
        ? null
        : state.articles.filter((item) => item.id === state.watchArticle)[0]
});
const stateToDispatch = dispatch => {
    return {
        doChangeLikes: (id, likes, likeuser) => {
            dispatch(changeLikes(id, likes, likeuser));
        }
    }
};

class Articlepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likeState: this.props.user === null
                ? false
                : (
                    this.props.article.likeuser.includes(this.props.user.user_name)
                    ? true
                    : false)
        };
    }
    handleClick = () => {
        if (this.props.user === null)
            message.info("请先登录!");
        else {
            let id = this.props.article.id,
                userName = this.props.user.user_name;
            var likes = this.props.article.likes,
                likeuser = this.props.article.likeuser;
            if (this.state.likeState) {
                likes--;
                likeuser = likeuser.replace(userName + " ", "");
                this.props.doChangeLikes(id, likes, likeuser);
                this.setState({likeState: false});
            } else {
                likes++;
                likeuser += userName + " ";
                this.props.doChangeLikes(id, likes, likeuser);
                this.setState({likeState: true});
            }
            let data = {
                params: {
                    id: id,
                    likes: likes,
                    likeuser: likeuser
                }
            };
            console.log(data);
            axios.get("http://47.111.165.97:9000/like", data);
        }
    }
    render() {
        console.log(this.props.article);
        if (this.props.watchArticle === -1)
            return <Empty/>;
        else
            return (<Content style={{
                    padding: '2em'
                }}>
                <h1 className="article-title">{this.props.article.title}</h1>
                <div className="article-info">
                    <span>
                        <Icon type="eye"/>{this.props.article.views}
                    </span>
                    <span>
                        <Icon type="like" onClick={this.handleClick} theme={this.state.likeState
                                ? "filled"
                                : "outlined"}/> {this.props.article.likes}
                    </span>
                </div>
                <Divider/>
                <Markdown source={this.props.article.content} className="markdown-body"/>
                <div className="article-control">
                    <small>{this.props.article.publishtime}</small>
                </div>
            </Content>);
        }
    }

export default connect(stateToProps, stateToDispatch)(Articlepage);
