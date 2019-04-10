import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Typography, Card, Tag, Icon} from 'antd';
import 'antd/lib/typography/style/css';
import 'antd/lib/card/style/css';
import 'antd/lib/tag/style/css';
import {changeWatchArticle} from './../../actions/reducer.js';
import {connect} from 'react-redux';

const {Paragraph} = Typography;
const stateToProps = state => ({watchArticle: state.watchArticle});
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
    handleClick = () => {
        this.props.doChangeWatchArticle(this.props.article.id);
    }
    render() {
        return (<Card title={this.props.article.title} extra={<Link to = "/article" onClick = {
                this.handleClick
            } > More</Link>}>
            <Paragraph style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                {this.props.article.intro}
            </Paragraph>
            <div style={{
                    clear: 'both'
                }}>
                {
                    this.props.article.tags === null ? null : this.props.article.tags.map((item, key) => {
                        return <Tag color={this.tagColor(item)} key={`tag${key}`}>{item}</Tag>;
                    })
                }
            </div>
            <small>
                <span>
                    <Icon type="eye" style={{paddingRight: '0.5em'}}/>{this.props.article.views}
                </span>
                <span>
                    <Icon type="like" style={{padding: '0 0.5em 0 1em'}}/>{this.props.article.likes}
                </span>
            </small>
            <small style={{
                    float: 'right'
                }}>
                {this.props.article.publishtime}
            </small>
        </Card>);
    }
}

export default connect(stateToProps, stateToDispatch)(Articlecard);
