import { combineReducers } from 'redux';
import crosswordReducer from './crosswordReducer';
import userReducer from './userReducer';
import fetchCrosswords from './fetchCrosswords';
import fetchUsers from './fetchUsers';
import mailReducer from './mailReducer';

export default combineReducers({
    crossword: crosswordReducer,
    user: userReducer,
    crosswords: fetchCrosswords,
    users: fetchUsers,
    mail: mailReducer
});