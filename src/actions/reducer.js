const INIT = "INIT";
const CHANGE_ITEM = "CHANGE_ITEM";
const CHANGE_WATCH_ARTICLE = "CHANGE_WATCH_ARTICLE";

const initialState = ({
    home: {
        activeItem: "article"
    },
    watchArticle: -1,
    articles: []
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
})

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT:
            {
                action.articles.forEach((value) => {
                    if (value.tags !== null)
                        value.tags = value.tags.split(",");
                });
                return Object.assign({}, state, {
                    articles: action.articles
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
        default:
            return state;
    }
}

export default appReducer;
