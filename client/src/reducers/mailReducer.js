export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'SEND_MAIL':
                return action.payload;
            default: 
                return state;
        }
    };