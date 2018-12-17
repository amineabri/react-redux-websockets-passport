import axios from "axios";

let _apiService = null;

/*
	Service that manages HTTP communication with API
*/
class ApiService {
    /*
            Retrieve data
        */
    get(endpoint, options = null) {
        return axios.get(endpoint, options);
    }

    /*
            Post data
        */
    post(endpoint = "", data = {}, options) {
        return axios.post(endpoint, data, options);
    }
}

_apiService = new ApiService();
export default _apiService;
