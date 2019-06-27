import React, {Component} from 'react';
import "github-markdown-css/github-markdown.css";
import './Articlepage.css';
import Markdown from 'react-markdown';
import {Divider, Icon, Empty, message, Spin, Button} from 'antd';
import 'antd/lib/layout/style/css';
import 'antd/lib/message/style/css';
import 'antd/lib/empty/style/css';
import 'antd/lib/divider/style/css';
import axios from 'axios';
import {connect} from 'react-redux';
import {toggleLikeArticle, changeArticleType} from './../../actions/reducer';

const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    likeState: state.likeArticles.indexOf(state.watchArticle) !== -1,
    watchArticle: state.watchArticle,
    article: state.watchArticle === -1
        ? null
        : state.articles.filter((item) => item.id === state.watchArticle)[0]
});
const stateToDispatch = dispatch => {
    return {
        doToggleLikeArticle: (articleID) => {
            dispatch(toggleLikeArticle(articleID));
        },
        doChangeArticleType: (id, articleType) => {
            dispatch(changeArticleType(id, articleType));
        }
    };
};

class Articlepage extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, lockLoading: false};
    }
    componentWillMount() {
        this.setState({loading: false});
    }
    handleClick = () => {
        if (this.props.user === null) message.info("请先登录!");
        else {
            let id = this.props.article.id,
                name = this.props.user.name;
            let data = {
                params: {id: id, name: name}
            };
            this.setState({loading: true});
            if (!this.props.likeState) {
                axios.get("http://localhost:9000/likeArticle", data)
                .then((response) => {
                    if (response.data.error) {
                        message.error("点赞失败!");
                        this.setState({loading: false});
                    }
                    else {
                        this.props.doToggleLikeArticle(id);
                        this.setState({loading: false});
                    }
                });
            }
            else {
                axios.get("http://localhost:9000/dislikeArticle", data)
                .then((response) => {
                    if (response.data.error) {
                        message.error("取消点赞失败!");
                        this.setState({loading: false});
                    }
                    else {
                        this.props.doToggleLikeArticle(id);
                        this.setState({loading: false});
                    }
                });
            }
        }
    }
    handleLock = () => {
        let id = this.props.article.id,
            articleType = this.props.article.type === "NORMAL" ? "PRIVATE" : "NORMAL";
        this.setState({lockLoading: true});
        axios.get("http://localhost:9000/changeArticleType", {params: {id: id}})
        .then((response) => {
            if (response.data.error) {
                message.error("设置文章类型失败!");
                this.setState({lockLoading: false});
            }
            else {
                this.props.doChangeArticleType(id, articleType);
                message.success(articleType === "NORMAL" ? "已设置为普通文章!" : "已设置为私密文章!");
                this.setState({lockLoading: false});
            }
        });
    }
    render() {
        if (this.props.watchArticle === -1) return <Empty />;
        else
            return (
                <Spin spinning={this.state.loading}>
                    <div style={{padding: '2em'}}>
                        <h1 className="article-title">{this.props.article.title}</h1>
                        <div className="article-info">
                            {
                                this.props.isLoggedIn && this.props.user.type === "ADMIN" ? (
                                    <Button
                                        style={{float: 'left', textAlign: 'center'}}
                                        type="primary"
                                        shape="circle"
                                        loading={this.state.lockLoading}
                                        icon={this.props.article.type !== "NORMAL" ? "lock" : "unlock"}
                                        size="large"
                                        onClick={this.handleLock}
                                    />
                                ) : null
                            }
                            <span><Icon type="eye"/>{this.props.article.views}</span>
                            <span>
                                <Icon
                                    type="like"
                                    onClick={this.handleClick}
                                    theme={this.props.likeState ? "filled" : "outlined"}
                                />
                                {this.props.article.likes}
                            </span>
                        </div>
                        <Divider/>
                        <Markdown source={this.props.article.content} className="markdown-body"/>
                        <div className="article-control">
                            <small>{this.props.article.publishTime}</small>
                        </div>
                    </div>
                </Spin>
            );
        }
    }

export default connect(stateToProps, stateToDispatch)(Articlepage);
