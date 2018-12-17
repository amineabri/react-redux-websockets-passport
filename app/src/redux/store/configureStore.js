if (process.env.NODE_ENV === "development") {
    module.exports = require("./configureStore.dev");
} else {
    module.exports = require("./configureStore.prod");
}

/**
  This is based on which environment you are running on,
  because in development you should get access to Redux DevTools,
  in production you should be not allowed to use Redux dev tools
 */