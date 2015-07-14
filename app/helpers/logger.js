var log4js = require("log4js");

log4js.configure('config/log_configuration.json')

module.exports = {
    getLogger: function (name){
        var logger = log4js.getLogger(name);
        logger.setLevel('DEBUG');
        return logger;
    }
};