const INIT_ARTICLES = "INIT_ARTICLES";
const INIT_MESSAGES = "INIT_MESSAGES";
const CHANGE_ITEM = "CHANGE_ITEM";
const CHANGE_WATCH_ARTICLE = "CHANGE_WATCH_ARTICLE";
const CHANGE_SHOW_ARTICLES = "CHANGE_SHOW_ARTICLES";
const CHANGE_LIKES = "CHANGE_LIKES";
const LOG_IN = "LOG_IN";
const CHANGE_LOADING = "CHANGE_LOADING";
const ADD_MESSAGE = "ADD_MESSAGE";

const initialState = ({
    user: null,
    isLoggedIn: false,
    watchArticle: -1,
    activeItem: null,
    articles: [],
    showArticles: [],
    messages: [],
    initState: {
        initArticles: false,
        initMessages: false
    },
    showState: "publishtime",
    loading: {
        messageLoading: false
    }
});

export const initArticles = articles => ({
    type: INIT_ARTICLES,
    articles
});
export const initMessages = messages => ({
    type: INIT_MESSAGES,
    messages
});
export const changeItem = item => ({
    type: CHANGE_ITEM,
    item
});
export const changeWatchArticle = id => ({
    type: CHANGE_WATCH_ARTICLE,
    id
});
export const changeShowArticles = (sorttype, articles) => ({
    type: CHANGE_SHOW_ARTICLES,
    sorttype,
    articles
});
export const logIn = (user) => ({
    type: LOG_IN,
    user
});
export const changeLikes = (id, likes, likeuser) => ({
    type: CHANGE_LIKES,
    id,
    likes,
    likeuser
});
export const changeLoading = (loading) => ({
    type: CHANGE_LOADING,
    loading
})
export const addMessage = message => ({
    type: ADD_MESSAGE,
    message
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_ARTICLES:
            {
                return Object.assign({}, state, {
                    articles: action.articles,
                    showArticles: action.articles,
                    initState: Object.assign({}, state.initState, {initArticles: true})
                });
            }
        case INIT_MESSAGES:
            {
                return Object.assign({}, state, {
                    messages: action.messages,
                    initState: Object.assign({}, state.initState, {initMessages: true})
                });
            }
        case CHANGE_ITEM:
            {
                return Object.assign({}, state, {
                    activeItem: action.item
                });
            }
        case CHANGE_WATCH_ARTICLE:
            {
                return Object.assign({}, state, {
                    watchArticle: action.id,
                    articles: state.articles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {
                            views: item.views + 1
                        }) : item;
                    }),
                    showArticles: state.articles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {
                            views: item.views + 1
                        }) : item;
                    })
                });
            }
        case CHANGE_SHOW_ARTICLES:
            {
                return Object.assign({}, state, {
                    showArticles: action.articles,
                    showState: action.sorttype
                });
            }
        case LOG_IN:
            {
                return Object.assign({}, state, {
                    user: action.user,
                    isLoggedIn: true
                });
            }
        case CHANGE_LIKES:
            {
                return Object.assign({}, state, {
                    articles: state.articles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {
                            likes: action.likes,
                            likeuser: action.likeuser
                        }) : item;
                    }),
                    showArticles: state.showArticles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {
                            likes: action.likes,
                            likeuser: action.likeuser
                        }) : item;
                    })
                });
            }
        case CHANGE_LOADING:
            {
                return Object.assign({}, state, {
                    loading: action.loading
                });
            }
        case ADD_MESSAGE:
            {
                var newState = Object.assign({}, state);
                newState.messages.unshift(action.message);
                console.log(newState);
                return newState;
            }
        default:
            return state;
    }
}

export default appReducer;
