export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_UNAPR':
                return action.payload;
            case 'GET_APP_CROSSWORDS':
                return action.payload;
            case 'GET_ADDED_CROSSWORDS':
                return action.payload;
            case 'GET_SOLVED_CROSSWORDS':
                return action.payload;
            case 'GET_PROGRESS_CROSSWORDS':
                return action.payload;
            default: 
                return state;
        }
    };