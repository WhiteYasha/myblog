const INIT = "INIT";
const CHANGE_ITEM = "CHANGE_ITEM";
const CHANGE_WATCH_ARTICLE = "CHANGE_WATCH_ARTICLE";
const CHANGE_SHOW_ARTICLES = "CHANGE_SHOW_ARTICLES";
const LOG_IN = "LOG_IN";

const initialState = ({
    user: null,
    isLoggedIn: false,
    home: {
        activeItem: "article"
    },
    watchArticle: -1,
    articles: [],
    showArticles: [],
    initState: false,
    showState: "publishtime"
});

export const init = articles => ({
    type: INIT,
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
export const changeShowArticles = (sorttype, articles) => ({
    type: CHANGE_SHOW_ARTICLES,
    sorttype,
    articles
});
export const logIn = (user) => ({
    type: LOG_IN,
    user
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT:
            {
                return Object.assign({}, state, {
                    articles: action.articles,
                    showArticles: action.articles,
                    initState: true
                });
            }
        case CHANGE_ITEM:
            {
                return Object.assign({}, state, {
                    home: {
                        activeItem: action.item
                    }
                });
            }
        case CHANGE_WATCH_ARTICLE:
            {
                return Object.assign({}, state, {
                    watchArticle: action.id,
                    articles: state.articles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {views: item.views + 1}) : item;
                    }),
                    showArticles: state.articles.map((item) => {
                        return item.id === action.id ? Object.assign({}, item, {views: item.views + 1}) : item;
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
        default:
            return state;
    }
}

export default appReducer;
