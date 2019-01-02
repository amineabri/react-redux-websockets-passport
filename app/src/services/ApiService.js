import axios from "axios";

let _apiService = null;

class ApiService {
    get(endpoint, options = null) {
        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve(axios.get(endpoint, options));
            }, 3000);
        });
    }

    post(endpoint = "", data = {}, options) {
        return axios.post(endpoint, data, options);
    }
}

_apiService = new ApiService();
export default _apiService;
