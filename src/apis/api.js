// src/api.js
import axios from 'axios';

export const apiCall = async (url, method, data) => {
    try {
        const response = await axios({
            url: url,
            method: method,
            data: data
        });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error.response ? error.response.data : 'Network Error' };
    }
};
