import React, {Component} from 'react';
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
        : state.articles[state.watchArticle - 1]
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
            <Markdown source={this.props.article.content}/>
        </Content>);
    }
}

export default connect(stateToProps)(Articlepage);
