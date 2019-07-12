import React, {Component} from 'react';
import './Footer.css';
import {Layout, Icon, Row, Col} from 'antd';
import 'antd/lib/layout/style/css';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1291324_r39jpha0b9a.js',
});

class Footer extends Component {
    share = (shareSite) => {
        let shareLink = "",
            url = "http://www.wyasha.top",
            title = "这是wyasha的博客",
            description = "应该不会有人点这个分享键吧（谁会知道这几个图标居然是分享功能呢）";
        switch (shareSite) {
            case "douban": {
                shareLink = `http://shuo.douban.com/!service/share?href=${url}&name=${title}&text=${description}`;
                break;
            }
            case "renren": {
                shareLink = `http://widget.renren.com/dialog/share?resourceUrl=${url}&title=${title}&description=${description}`;
                break;
            }
            case "qzone": {
                shareLink = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&desc=${description}&title=${title}&site=假面骑士`;
                break;
            }
            case "weibo": {
                shareLink = `http://service.weibo.com/share/share.php?url=${url}&appkey=Yasha&title=${title}`;
                break;
            }
            default:
                return ;
        }
        window.open(shareLink);
    }
    render() {
        return (
            <Layout.Footer style={{textAlign: 'center'}}>
                <Row>
                    <Col span={6} offset={9}>
                        <h1 className="footer-contact">Contact me</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={9}>
                        <p>Now is Better than never.</p>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={4} offset={4}>
                        <Icon type="environment" style={{fontSize: '24px'}} />
                        <p>Hangzhou, CHINA</p>
                    </Col>
                    <Col span={4}>
                        <Icon type="mail" style={{fontSize: '24px'}} />
                        <p>white_yasha@163.com</p>
                    </Col>
                    <Col span={4}>
                        <Icon type="qq" style={{fontSize: '24px'}} />
                        <p>845133178</p>
                    </Col>
                    <Col span={4}>
                        <Icon type="github" style={{fontSize: '24px'}}/>
                        <p>WhiteYasha</p>
                    </Col>
                </Row>
                <Row gutter={10} style={{marginTop: '16px'}}>
                    <Col span={6} offset={9}>
                        <p>Copyright ©2019 Created by wyasha</p>
                    </Col>
                    <Col span={3} offset={6}>
                        <IconFont className="shareicon" type="icondouban" style={{color: 'rgb(0, 146, 52)'}} onClick={() => this.share("douban")} />
                        <IconFont className="shareicon" type="iconqzone02" style={{color: 'rgb(255, 210, 0)'}} onClick={() => this.share("qzone")} />
                        <IconFont className="shareicon" type="iconrenren" style={{color: 'rgb(0, 120, 201)'}} onClick={() => this.share("renren")} />
                        <Icon className="shareicon" type="weibo" style={{color: 'rgb(253, 0, 0)'}} onClick={() => this.share("weibo")} />
                    </Col>
                </Row>
            </Layout.Footer>
        );
    }
}

export default Footer;
