import axios from 'axios';
export default axios.create({
    baseURL:'http://localhost:3000',
    headers: {"Access-Control-Allow-Origin": "*"}

});

export const baseURL='http://localhost:8000'

export const serverbaseURL='http://localhost:3000'