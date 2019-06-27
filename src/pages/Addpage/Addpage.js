import React, {Component} from 'react';
import Editor from 'for-editor';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Row, Col, Modal, Button, Input, Radio, Tag, Tooltip, Icon, message} from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/radio/style/css';
import 'antd/lib/col/style/css';
import axios from 'axios';

const stateToProps = state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn
});

class Addpage extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            type: "NORMAL",
            intro: "",
            content: "",
            tags: [],
            loading: false,
            inputVisible: false,
            inputTagValue: ""
        };
    }
    handleChange = (value) => {
        this.setState({content: value});
    }
    handleSubmit = () => {
        Modal.confirm({
            title: "发表文章",
            content: "确定要发表吗?",
            okText: "确定",
            cancelText: "取消",
            okButtonProps: {
                loading: this.state.loading
            },
            onOk: () => {
                let {title, type, intro, content, tags} = this.state;
                let data = {
                    params: {
                        title: title,
                        tags: tags,
                        intro: intro,
                        type: type,
                        content: content
                    }
                }
                this.setState({loading: true});
                axios.get("http://localhost:9000/postArticle", data)
                .then((response) => {
                    if (response.data.error) {
                        message.error("发表失败!");
                        this.setState({loading: false});
                    }
                    else {
                        message.success("发表成功!");
                        this.setState({
                            title: "",
                            tags: [],
                            intro: "",
                            content: "",
                            loading: false
                        });
                    }
                });
            }
        });
    }
    handleInputConfirm = () => {
        let inputTagValue = this.state.inputTagValue;
        this.setState({
            tags: this.state.tags.concat([inputTagValue]),
            inputTagValue: "",
            inputVisible: false
        });
    }
    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({tags: tags});
      };
    render() {
        if (!this.props.isLoggedIn || this.props.user.type !== "ADMIN") return <Redirect to="/" />
        else return (
            <div style={{padding: '16px calc(100% / 12)'}}>
                <Row gutter={16}>
                    <Col span={12} offset={1}>
                        <Input value={this.state.title} placeholder="请输入文章标题" onChange={(e) => this.setState({title: e.target.value})}/>
                    </Col>
                    <Col span={6} offset={2}>
                        <Radio.Group value={this.state.type} onChange={(e) => this.setState({type: e.target.value})}>
                            <Radio value="NORMAL">普通文章</Radio>
                            <Radio value="PRIVATE">私密文章</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '16px'}}>
                    <Col span={22} offset={1}>
                        <Input value={this.state.intro} placeholder="请输入文章简介" onChange={(e) => this.setState({intro: e.target.value})} />
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '16px'}}>
                    <Col span={20} offset={1}>
                        {
                            this.state.tags.map((item, key) => {
                                const isLongTag = item.length > 20;
                                const tagElem = (
                                    <Tag key={`tag${key}`} closable onClose={() => this.handleClose(item)}>
                                        {isLongTag ? `${item.slice(0, 20)}...` : item}
                                    </Tag>
                                );
                                return isLongTag ? (
                                    <Tooltip title={item} key={item}>
                                        {tagElem}
                                    </Tooltip>
                                ) : (tagElem);
                            })
                        }
                        {
                            this.state.inputVisible ?
                            (
                                <Input
                                    ref="tagInput"
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    value={this.state.inputTagValue}
                                    onChange={(e) => this.setState({inputTagValue: e.target.value})}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            ) :
                            (
                                <Tag onClick={() => this.setState({inputVisible: true})} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                    <Icon type="plus" />新标签
                                </Tag>
                            )
                        }
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '16px'}}>
                    <Col span={22} offset={1}>
                        <Editor value={this.state.content} onChange={this.handleChange.bind(this)} />
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '16px'}}>
                    <Col span={2} offset={22}>
                        <Button type="primary" icon="edit" onClick={this.handleSubmit}>发表</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(stateToProps)(Addpage);