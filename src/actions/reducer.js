const INIT = "INIT";
const CHANGE_ITEM = "CHANGE_ITEM";
const CHANGE_WATCH_ARTICLE = "CHANGE_WATCH_ARTICLE";
const CHANGE_SHOW_ARTICLES = "CHANGE_SHOW_ARTICLES";
const CHANGE_LIKES = "CHANGE_LIKES";

const initialState = ({
    home: {
        activeItem: "article"
    },
    watchArticle: -1,
    articles: [],
    showarticles: [],
    showState: "publishtime",
    initState: false
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
export const changeLikes = (number) => ({
    type: CHANGE_LIKES,
    number
});

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT:
            {
                return Object.assign({}, state, {
                    articles: action.articles,
                    showarticles: action.articles,
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
                    watchArticle: action.id
                });
            }
        case CHANGE_SHOW_ARTICLES:
            {
                return Object.assign({}, state, {
                    showarticles: action.articles,
                    showState: action.sorttype
                });
            }
        case CHANGE_LIKES:
            {
                return Object.assign({}, state, {
                    articles: state.articles.map((item) => {
                        if (item.id === state.watchArticle) {
                            item.likes += action.number;
                            return item;
                        }
                        else return item;
                    })
                });
            }
        default:
            return state;
    }
}

export default appReducer;
