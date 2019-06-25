const INIT_ARTICLES = "INIT_ARTICLES";
const INIT_MESSAGES = "INIT_MESSAGES";
const INIT_LIKE_ARTICLES = "INIT_LIKE_ARTICLES";
const CHANGE_ITEM = "CHANGE_ITEM";
const CHANGE_WATCH_ARTICLE = "CHANGE_WATCH_ARTICLE";
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const ADD_MESSAGE = "ADD_MESSAGE";
const SORT_ARTICLES = "SORT_ARTICLES";
const TOGGLE_LIKE_ARTICLE = "TOGGLE_LIKE_ARTICLE";

const initialState = ({
    user: null,
    isLoggedIn: false,
    watchArticle: -1,
    activeItem: null,
    articles: [],
    showArticles: [],
    likeArticles: [],
    messages: [],
    initState: {
        initArticles: false,
        initMessages: false
    },
    showState: "publishTime",
    signVisible: false
});

export const initArticles = articles => ({
    type: INIT_ARTICLES,
    articles
});
export const initMessages = messages => ({
    type: INIT_MESSAGES,
    messages
});
export const initLikeArticles = articles => ({
    type: INIT_LIKE_ARTICLES,
    articles
});
export const changeItem = item => ({
    type: CHANGE_ITEM,
    item
});
export const changeWatchArticle = id => ({
    type: CHANGE_WATCH_ARTICLE,
    id
});
export const logIn = (user) => ({
    type: LOG_IN,
    user
});
export const logOut = () => ({
    type: LOG_OUT
});
export const addMessage = message => ({
    type: ADD_MESSAGE,
    message
});
export const sortArticles = state => ({
    type: SORT_ARTICLES,
    state
});
export const toggleLikeArticle = articleID => ({
    type: TOGGLE_LIKE_ARTICLE,
    articleID
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_ARTICLES:
            {
                return Object.assign({}, state, {
                    articles: action.articles,
                    showArticles: action.articles,
                    initState: Object.assign({}, state.initState, {
                        initArticles: true
                    })
                });
            }
        case INIT_LIKE_ARTICLES:
            {
                return Object.assign({}, state, {
                    likeArticles: action.articles
                });
            }
        case INIT_MESSAGES:
            {
                return Object.assign({}, state, {
                    messages: action.messages,
                    initState: Object.assign({}, state.initState, {
                        initMessages: true
                    })
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
        case LOG_IN:
            {
                return Object.assign({}, state, {
                    user: action.user,
                    isLoggedIn: true
                });
            }
        case LOG_OUT:
            {
                return Object.assign({}, state, {
                    user: null,
                    isLoggedIn: false
                });
            }
        case ADD_MESSAGE:
            {
                return Object.assign({}, state, {
                    messages: [action.message].concat(state.messages)
                });
            }
        case SORT_ARTICLES:
            {
                if (action.state === "publishTime") {
                    return Object.assign({}, state, {
                        showState: action.state,
                        showArticles: state.articles.sort((a, b) => {
                            return b.publishTime.localeCompare(a.publishTime);
                        })
                    });
                }
                else if (action.state === "likes") {
                    return Object.assign({}, state, {
                        showState: action.state,
                        showArticles: state.articles.sort((a, b) => {
                            return b.likes - a.likes;
                        })
                    });
                }
                else {
                    return Object.assign({}, state, {
                        showState: action.state,
                        showArticles: state.articles.sort((a, b) => {
                            return b.views - a.views;
                        })
                    });
                }
            }
        case TOGGLE_LIKE_ARTICLE:
            {
                const id = action.articleID;
                if (state.likeArticles.indexOf(id) !== -1) {
                    // 取消喜欢
                    return Object.assign({}, state, {
                        articles: state.articles.map((item) => {
                            return item.id === id ? Object.assign({}, item, {likes: item.likes - 1}) : item;
                        }),
                        showArticles: state.showArticles.map((item) => {
                            return item.id === id ? Object.assign({}, item, {likes: item.likes - 1}) : item
                        }),
                        likeArticles: state.likeArticles.filter((item) => item !== id)
                    });
                }
                else {
                    // 喜欢文章
                    return Object.assign({}, state, {
                        articles: state.articles.map((item) => {
                            return item.id === id ? Object.assign({}, item, {likes: item.likes + 1}) : item;
                        }),
                        showArticles: state.showArticles.map((item) => {
                            return item.id === id ? Object.assign({}, item, {likes: item.likes + 1}) : item
                        }),
                        likeArticles: state.likeArticles.concat([id])
                    });
                }
            }
        default:
            return state;
    }
}

export default appReducer;
