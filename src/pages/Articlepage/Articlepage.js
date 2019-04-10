import React, {Component} from 'react';
import "github-markdown-css/github-markdown.css";
import './Articlepage.css';
import Markdown from 'react-markdown';
import {Layout, Divider, Icon} from 'antd';
import 'antd/lib/layout/style/css';
import 'antd/lib/divider/style/css';
import {connect} from 'react-redux';

const {Content} = Layout;
const stateToProps = state => ({
    article: state.watchArticle === -1
        ? null
        : state.articles[state.articles.length - state.watchArticle]
});

class Articlepage extends Component {
    render() {
        return (<Content style={{
                padding: '2em'
            }}>
            <h1 className="article-title">{this.props.article.title}</h1>
            <div className="article-info">
                <span>
                    <Icon type="eye"/>{this.props.article.views}
                </span>
                <span>
                    <Icon type="like"/>{this.props.article.likes}
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

export default connect(stateToProps)(Articlepage);
