export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'GET_CROSSWORD':
                return action.payload;
            case 'GET_RANDOM_CROSSWORD':
                return action.payload;
            case 'ADD_CROSSWORD':
                return action.payload;
            case 'APPROVE_CROSSWORD':
                return action.payload;
            case 'SAVE_CROSSWORD':
                return action.payload;
            case 'SOLVE_CROSSWORD':
                return action.payload;
            case 'REVIEW_CROSSWORD':
                return action.payload;
            default: 
                return state;
        }
    };