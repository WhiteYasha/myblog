import React, {Component} from 'react';
import './Footer.css';
import {Layout, Icon} from 'antd';
import 'antd/lib/layout/style/css';

class Footer extends Component {
    render() {
        return (
            <Layout.Footer style={{textAlign: 'center'}}>
                <h1 id="footer-contact">Contact me</h1>
                <p>Now is Better than never.</p>
                <div className="footer-info">
                    <Icon type="environment" style={{fontSize: '24px'}} />
                    <p>Hangzhou, CHINA</p>
                </div>
                <div className="footer-info">
                    <Icon type="mail" style={{fontSize: '24px'}} />
                    <p>white_yasha@163.com</p>
                </div>
                <div className="footer-info">
                    <Icon type="qq" style={{fontSize: '24px'}} />
                    <p>845133178</p>
                </div>
                <div className="footer-info">
                    <Icon type="github" style={{fontSize: '24px'}}/>
                    <p>WhiteYasha</p>
                </div>
                <p>Copyright ©2019 Created by wyasha</p>
            </Layout.Footer>
        );
    }
}

export default Footer;
