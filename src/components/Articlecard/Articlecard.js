import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Typography, Card, Tag, Icon, Tooltip} from 'antd';
import 'antd/lib/typography/style/css';
import 'antd/lib/tooltip/style/css';
import 'antd/lib/card/style/css';
import 'antd/lib/tag/style/css';
import {changeWatchArticle} from './../../actions/reducer.js';
import {connect} from 'react-redux';
import axios from 'axios';

const {Paragraph} = Typography;
const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    watchArticle: state.watchArticle
});
const stateToDispatch = dispatch => {
    return {
        doChangeWatchArticle: (id) => {
            dispatch(changeWatchArticle(id));
        }
    }
};

class Articlecard extends Component {
    tagColor = (tagName) => {
        switch (tagName) {
            case "技术":
                return "blue";
            case "前端":
                return "volcano";
            case "后端":
                return "gold";
            case "题解":
                return "purple";
            case "模拟":
                return "magenta";
            case "算法":
                return "geekblue";
            case "数据结构":
                return "cyan";
            case "随笔":
                return "orange";
            case "日记":
                return "lime";
            case "转载":
                return "green";
            case "心得":
                return "red";
            default:
                return "";
        }
    }
    handleClick = (id) => {
        let data = {
            params: {id: id}
        };
        axios.get("http://localhost:9000/view", data)
        .then((response) => {
            if (!response.data.error) this.props.doChangeWatchArticle(id);
        });
    }
    render() {
        return (
            <Card
                title={this.props.article.title}
                extra={
                    (
                        (this.props.isLoggedIn && this.props.user.type === "NORMAL" && this.props.article.type === "PRIVATE") ||
                        (!this.props.isLoggedIn && this.props.article.type === "PRIVATE")
                    ) ?
                    <Tooltip title="这是一篇私密文章"><Icon type="lock" /></Tooltip>
                    :
                    <Link to="/article" onClick={() => this.handleClick(this.props.article.id)}>More</Link>
                }
            >
                <Paragraph style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {this.props.article.intro}
                </Paragraph>
                <div style={{clear: 'both'}}>
                    {
                        this.props.article.tags === null ? null : this.props.article.tags.map((item, key) => {
                            return <Tag color={this.tagColor(item)} key={`tag${key}`}>{item}</Tag>;
                        })
                    }
                </div>
                <small>
                    <span><Icon type="eye" style={{paddingRight: '0.5em'}}/>{this.props.article.views}</span>
                    <span><Icon type="like" style={{padding: '0 0.5em 0 1em'}}/>{this.props.article.likes}</span>
                </small>
                <small style={{float: 'right'}}>{this.props.article.publishTime}</small>
            </Card>
        );
    }
}

export default connect(stateToProps, stateToDispatch)(Articlecard);
