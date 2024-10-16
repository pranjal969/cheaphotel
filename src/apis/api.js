// src/api.js
import axios from 'axios';
import { APIENDPOINT } from '../utils/constants';

export const apiCall = async (endpoint, method, data) => {
    try {
        const response = await axios({
            url: `${APIENDPOINT}${endpoint}`, // Use the base URL and append the endpoint
            method: method,
            data: data,
        });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error.response ? error.response.data : 'Network Error' };
    }
};
