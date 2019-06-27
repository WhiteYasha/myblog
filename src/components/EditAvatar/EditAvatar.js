import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Upload, message, Icon} from 'antd';
import 'antd/lib/upload/style/css';
import {connect} from 'react-redux';
import {changeAvatar} from './../../actions/reducer';

const stateToProps = state => ({
    user: state.user
});
const stateToDispatch = dispatch => {
    return {
        doChangeAvatar: (name, avatar) => {
            dispatch(changeAvatar(name, avatar));
        }
    };
};

const beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJPG) {
        message.error('仅支持JPG/JPEG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片必须小于2MB!');
    }
    return isJPG && isLt2M;
}

class EditAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {avatar: this.props.user.avatar, loading: false};
    }
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            console.log(info.file.response);
            this.setState({avatar: info.file.response.result[0], loading: false});
        }
    }
    handleSubmit = () => {
        let avatar = this.state.avatar,
            name = this.props.user.name;
        let data = {
            params: {
                name: name,
                avatar: avatar
            }
        }
        this.setState({loading: true});
        axios.get("http://localhost:9000/changeAvatar", data)
        .then((response) => {
            if (response.data.error) {
                message.error("修改头像失败!");
                this.setState({loading: false});
            }
            else {
                this.props.doChangeAvatar(name, avatar);
                message.success("头像修改成功!");
                localStorage.setItem("user", JSON.stringify(this.props.user));
                this.setState({loading: false});
                this.props.onCancel();
            }
        });
    }
    render() {
        return (
            <Modal
                title="修改头像"
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}
                confirmLoading={this.state.loading}
                okText="确认"
                cancelText="取消"
                bodyStyle={{paddingLeft: 'calc(50% - 100px)', textAlign: 'center'}}
                destroyOnClose
            >
                <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    action="http://localhost:9000/uploadAvatar"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    {
                        this.state.loading ? (
                            <div style={{height: '200px', width: '200px'}}>
                                <Icon type="loading"/>
                                <div>上传中</div>
                            </div>
                        ) : (<img src={this.state.avatar} style={{height: '200px', width: '200px'}} alt="" />)
                    }
                </Upload>
                点击上传图片
            </Modal>
        );
    }
};

export default connect(stateToProps, stateToDispatch)(EditAvatar);
