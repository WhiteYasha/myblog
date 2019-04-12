import React, {Component} from 'react';
import Mainpage from './pages/Mainpage/Mainpage';
import Articlepage from './pages/Articlepage/Articlepage';
import Messagepage from './pages/Messagepage/Messagepage';
import Loginpage from './pages/Loginpage/Loginpage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {Route} from 'react-router-dom';
import appReducer from './actions/reducer.js';

const store = createStore(appReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {
    componentWillMount() {
        document.title = "wYasha";
    }
    render() {
        return (<Provider store={store}>
            <Header />
            <Route exact path="/" component={Mainpage} />
            <Route path="/article" component={Articlepage} />
            <Route path="/message" component={Messagepage} />
            <Route path="/login" component={Loginpage} />
            <Footer />
        </Provider>);
    }
}

export default App;
