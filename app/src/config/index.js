switch (process.env.NODE_ENV) {
    case "development": {
        module.exports = require("./config_dev");
        break;
    }
    default:
        break;
}
