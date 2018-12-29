const axios = require("axios");
const API_URL = require("./config").API_URL;
const CATEGORIES_METHOD = require("./config").CATEGORIES_METHOD;
const QUESTIONS_METHOD = require("./config").QUESTIONS_METHOD;

const get = (method, options = {}) => {
    return axios.get(`${API_URL}/${method}`, options);
};

const getCategories = () => {
    return get(CATEGORIES_METHOD).then(({ data }) => {
        return data.trivia_categories;
    });
};

const getQuestions = (options = {}) => {
    return get(QUESTIONS_METHOD, options).then(({ data }) => {
        return data.results;
    });
};

module.exports = {
    get,
    getCategories,
    getQuestions
};
