import apis from '../apis/index';
import { setCookie } from '../js';
import { baseURL } from '../apis'

export const getUser = (id, token) => async dispatch => {
    let response = await apis.get(`user/singleuser/${id}`, {headers: {token: token}});
    dispatch({type: 'GET_USER', payload: response.data});
}

export const getUserById = (id, token) => async dispatch => {
    let response = await apis.get(`user/id/${id}`, {headers: {token: token}});
    dispatch({type: 'GET_USER_BY_ID', payload: response.data});
}

export const getAdmins = (token) => async dispatch => {
    let response = await apis.get('user/admins', {headers: {token: token}});
    dispatch({type: 'GET_ADMINS', payload: response.data});
}

export const getUsersByQuery = (query, token) => async dispatch => {
    let response = await apis.get(`user/query/${query}`, {headers: {token: token}});
    dispatch({type: 'GET_USERS_BY_QUERY', payload: response.data})
}

export const userLogin = (login, password) => async dispatch => {
    let response = await apis.post('user/login', {login, password});
    setCookie('customerID', response.data._id, 240);
    setCookie('jwt_access', response.data.jwt_access, 240);
    dispatch({type: 'USER_LOGIN', payload: response.data});
}

export const userSignOut = () => async dispatch => {
    setCookie('customerID', "", 0.00001);
    setCookie('jwt_access', "", 0.00001);
}

export const userUpdate = (login, email, currentPassword, id, token) => async dispatch => {
    let response = await apis.put(`user/update/${id}`, {login, email, currentPassword}, {headers: {token: token}});
    dispatch({type: 'UPDATE_USER', payload: response.data});
}

export const activateAccount = (id, token) => async dispatch => {
    let response = await apis.put(`user/activate/${id}`, {token});
    dispatch({type: 'ACTIVATE_ACCOUNT', payload: response.data});
}

export const resendActivation = (id) => async dispatch => {
    let response = await apis.post(`user/resend/${id}`);
    dispatch({type: 'RESEND_ACTIVATION', payload: response.data});
}

export const passwordReminder = (email) => async dispatch => {
    let response = await apis.post('user/reminder', {email});
    dispatch({type: 'PASSWORD_REMINDER', payload: response.data});
}

export const resetPassword = (_id, token, password, confirmPassword) => async dispatch => {
    let response = await apis.put(`user/reset-password/${_id}`, {password, confirmPassword}, {headers: {token: token}});
    dispatch({type: 'RESET_PASSWORD', payload: response.data})
}

export const manageAdmin = (userID, password, token, action) => async dispatch => {
    let response = await apis.put('user/appoint', {userID, password, action}, {headers: {token: token}});
    dispatch({type: 'APPOINT_ADMIN', payload: response.data});
}

export const passwordUpdate = (newPassword, confirmNewPassword, currentPassword, id, token) => async dispatch => {
    let response = await apis.put(`user/password/update/${id}`, {newPassword, confirmNewPassword, currentPassword}, {headers: {token: token}});
    dispatch({type: 'UPDATE_PASSWORD', payload: response.data});
}

export const addUser = (login, password, confirmPassword, email) => async dispatch => {
    let response = await apis.post('user/register', {login, password, confirmPassword, email});
    dispatch({type: 'ADD_USER', payload: response.data});
}

export const getCrossword = (ID) => async dispatch => {
    let response = await apis.get(`crossword/${ID}`);
    dispatch({type: 'GET_CROSSWORD', payload: response.data});
}

export const getRandomCrossword = () => async dispatch => {
    let response = await apis.get(`crossword/r/random`);
    dispatch({type: 'GET_RANDOM_CROSSWORD', payload: response.data});
}

export const addTry = (id) => async dispatch => {
    let response = await apis.put(`crossword/try/${id}`);
    dispatch({type: 'ADD_TRY', payload: response.data});
}

export const getAppCrosswords = (token) => async dispatch => {
    let response = await apis.get('crossword/a/approved', {headers: {token: token}});
    dispatch({type: 'GET_APP_CROSSWORDS', payload: response.data});
}

export const getAddedCrosswords = (id, page) => async dispatch => {
    let response = await apis.get(`crossword/addedby/${id}/${page}`);
    dispatch({type: 'GET_ADDED_CROSSWORDS', payload: response.data});
}

export const getSolvedCrosswords = (id, page) => async dispatch => {
    let response = await apis.get(`crossword/solvedby/${id}/${page}`);
    dispatch({type: 'GET_SOLVED_CROSSWORDS', payload: response.data});
}

export const getProgressCrosswords = (id, page) => async dispatch => {
    let response = await apis.get(`crossword/inprogress/${id}/${page}`);
    dispatch({type: 'GET_PROGRESS_CROSSWORDS', payload: response.data});
}

export const getUnapprovedCrosswords = (token) => async dispatch => {
    let response = await apis.get('crossword/u/unapproved', {headers: {token: token}});
    dispatch({type: 'GET_UNAPR', payload: response.data});
}

export const addCrossword = (values, questions, solution, addedBy, token) => async dispatch => {
    let response = await apis.post(`crossword/add/${addedBy}`, {values, questions, solution, addedBy}, {headers: {token: token}});
    dispatch({type: 'ADD_CROSSWORD', payload: response.data});
}

export const approveCrossword = (id, action, message, token) => async dispatch => {
    let response = await apis.post(`crossword/approve/${id}`, {action, message, token});
    dispatch({type: 'APPROVE_CROSSWORD', payload: response.data});
}

export const reviewCrossword = (id, rating, token) => async dispatch => {
    let response = await apis.post(`crossword/review/${id}`, {rating}, {headers: { token: token}});
    dispatch({type: 'REVIEW_CROSSWORD', payload: response.data});
}

export const saveCrossword = (_id, crossword, userId, token) => async dispatch => {
    let response = await apis.post(`crossword/tries/save/${userId}`, {_id, crossword}, {headers: {token: token}})
    dispatch({type: 'SAVE_CROSSWORD', payload: response.data});
}

export const solveCrossword = (_id, crossword, userId, token) => async dispatch => {
    let response = await apis.post(`crossword/solve/${userId}/${_id}`, {crossword}, {headers: {token: token}});
    dispatch({type: 'SOLVE_CROSSWORD', payload: response.data})
}

export const sendMail = (name, email, message) => async dispatch => {
    let response = await apis.post('mail/send', {name, email, message});
    dispatch({type: 'SEND_MAIL', payload: response.data});
}
