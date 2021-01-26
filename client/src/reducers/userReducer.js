export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'USER_LOGIN':
                return action.payload;
            case 'ADD_USER':
                return action.payload;
            case 'USER_LOGOUT':
                return {login: '', email: ''};
            case 'GET_USER':
                return action.payload;
            case 'USER_REGISTER':
                return state;
            case 'UPDATE_USER':
                return action.payload;
            case 'UPDATE_PASSWORD':
                return action.payload;
            case 'APPOINT_ADMIN':
                return action.payload;
            case 'GET_USER_BY_ID':
                return action.payload;
            case 'ACTIVATE_ACCOUNT':
                return action.payload;
            case 'RESEND_ACTIVATION':
                return action.payload;
            case 'PASSWORD_REMINDER':
                return action.payload;
            case 'RESET_PASSWORD':
                return action.payload;
            default: 
                return state;
        }
    };