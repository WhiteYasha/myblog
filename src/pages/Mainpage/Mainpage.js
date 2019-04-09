import React, {Component} from 'react';
import Articlecard from "./../../components/Articlecard/Articlecard";
import {connect} from 'react-redux';
import axios from 'axios';
import {init} from './../../actions/reducer.js';

const stateToProps = state => ({articles: state.articles});
const stateToDispatch = dispatch => {
    return {
        doInit: () => {
            axios.get("http://localhost:9000/init").then((response) => {
                dispatch(init(response.data));
            })
        }
    }
};

class Mainpage extends Component {
    componentWillMount() {
        this.props.doInit();
    }
    render() {
        return (<div>
            {
                this.props.articles.map((item, key) => {
                    return (<div style={{
                            margin: '1em',
                            width: 'calc((100% - 6em) / 3)',
                            display: 'inline-block'
                        }} key={`article-div${key}`}>
                        <Articlecard key={`article${key}`} article={item}/>
                    </div>);
                })
            }
        </div>);
    }
}

export default connect(stateToProps, stateToDispatch)(Mainpage);
