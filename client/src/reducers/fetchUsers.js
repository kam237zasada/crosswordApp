export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_ADMINS':
                return action.payload;
            case 'GET_USERS_BY_QUERY':
                return action.payload;
            default: 
                return state;
        }
    };