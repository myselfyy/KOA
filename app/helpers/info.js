var logger = require('./logger').getLogger('server'),
    expect = require('args-expect'),
    path   = require('path'),
    fs     = require('fs'),
    callerLookup = require('caller-lookup');

/**
*   Environment property keys
*   @constant
*/
var NODE_ENV_KEY  = 'NODE_ENV',
    ROOT_PATH_KEY = 'ROOT_PATH';

/**
*   Allowed NODE_ENV value
*   @constant
*/
var NODE_ENV = {
    LOCAL:  'local',  /** app is running on local computer         */
    PROD:   'production'   /** app is running on production server */
};
var NODE_ENV_INHERIT = {};

/** local config will inherit production config */
NODE_ENV_INHERIT[NODE_ENV.LOCAL] = NODE_ENV.PROD;

/**
*   Default NODE_ENV is 'prod'
*   @constant
*   @default
*/
var DEFAULT_NODE_ENV = NODE_ENV.PROD;

/**
*   Lookup caller, if this file is called by another module (such as: mocha)
*   @private
*/
function lookupThisFileCaller() {
    return callerLookup(__filename);
}

/**
*   Compute the current app path, and update to process.env.ROOT_PATH
*   @private
*/
function computeRootPath() {
    var callerFile, rootFile, rootPath;

    /*
    *   so that we can get the actual caller, on app user or mocha tester
    */
    callerFile = lookupThisFileCaller();

    rootFile = path.normalize(callerFile);
    rootPath = path.dirname(rootFile);

    return rootPath;
}

/**
*   Update value to process.env, if it is not exists
*   @private
*/
function updateProcessEnv(key, value) {
    expect(key).isString().notEmpty();

    if (process.env[key] !== value) {
        process.env[key] = value;
    }
}

/**
*   Get and verify node_env value from env. Reset to default if value is not allowed
*   @private
*/
function getNodeEnvFromProcess() {
    var nodeEnv   = (process.env[NODE_ENV_KEY] || '').toLowerCase(),
        available = false;

    if (nodeEnv) {
        /*  legacy-node-env check has been removed from midway 3.0
            if user still using midway@1.2.x,
            follow <http://gitlab.alibaba-inc.com/midway/midway/wikis/upgrade-nodeenv>
            to do the midway upgrade
        */

        /* make sure the nodeEnv is an available value */
        available = nodeEnv in NODE_ENV;

        if (!available) {
            logger.warn('[NODE_ENV] %s is not an available NODE_ENV value, ' +
                ', currently only accept the following values: %s', nodeEnv,
                Object.keys(NODE_ENV).map(function(key) {
                    return NODE_ENV[key];
                }).join(', '));

            /* if not known, fallback to original value. */
            nodeEnv = process.env[NODE_ENV_KEY];
        }
    } else {
        logger.warn('Failed to find NODE_ENV value' +
            ', fallback to default value: %s.', DEFAULT_NODE_ENV);

        nodeEnv = DEFAULT_NODE_ENV;
    }

    /* update prcoess.env with new value */
    updateProcessEnv(NODE_ENV_KEY, nodeEnv);

    return nodeEnv;
}

/**
*   The config file to describe all folder structure
*   @constant
*/

var APP_CONF_FOLDER    = 'config', //app config files: {{ROOT_PATH}}/config
    APP_BASE_CONF_NAME = 'base';   //app base config: {{ROOT_PATH}}/config/base

/**
*   Create meta path object from meta config
*   @private
*/
function getConfigPaths(nodeEnv, rootPath) {
    expect.all(nodeEnv, rootPath).isString().notEmpty();

    function makeAppConfigPath(fileName) {
        var filePath = path.join(rootPath, APP_CONF_FOLDER, fileName);
        return filePath;
    }

    return {
        appBaseConfig: makeAppConfigPath(APP_BASE_CONF_NAME),

        /* if NODE_ENV is "local" , add parent config is production.conf */
        appEnvParentConfig: NODE_ENV_INHERIT[nodeEnv] ? 
            makeAppConfigPath( NODE_ENV_INHERIT[nodeEnv] ) : '',

        appEnvConfig: makeAppConfigPath(nodeEnv)
    };
}

var ConfigureFiles = false;
/**
*   Read config file content
*/
function getConfigFiles() {
    if (ConfigureFiles) return ConfigureFiles;

    var configPaths = getConfigPaths();
    for (var prop in configPaths) {
        if (configPaths.hasOwnProperty(prop)) {
            fs.readFile(configPaths[prop], function (err, data) {
                if (err) {
                    logger.error('CONFIG file %s read failed', configPaths[prop]);
                    throw err;
                }
                ConfigureFiles[prop] = data;
            });
        }
    }
    return ConfigureFiles;
}

function Info() {
    var nodeEnv      = getNodeEnvFromProcess(),
        rootPath     = computeRootPath();

    logger.info('NODE_ENV is %s', nodeEnv);
    logger.info('ROOT_PATH is %s', rootPath);

    this.getEnvFields = function getEnvFields() {
        /* above fields will be mixin into config global */
        var fields = {};
        fields[NODE_ENV_KEY] = nodeEnv;
        fields[ROOT_PATH_KEY] = rootPath;

        return fields;
    };

    this.getConfigPaths = function() {
        return getConfigPaths(nodeEnv, rootPath);
    };

    this.getConfig = function getConfig() {
        return getConfigFiles();
    };

    this.getRootPath = function getRootPath() {
        return rootPath;
    };

    this.getInheritedNodeEnv = function getInheritedNodeEnv() {
        /* if NODE_ENV is "local" , add inherited env is "development" */
        /* if NODE_ENV is "prepub", add inherited env is "production" */
        return NODE_ENV_INHERIT[ this.getNodeEnv() ] || '';
    };

    this.getNodeEnv = function getNodeEnv() {
        return nodeEnv;
    };

    this.isProd = function isProd() {
        return nodeEnv === NODE_ENV.PROD;
    };

    this.isLocal = function isLocal() {
        return nodeEnv === NODE_ENV.LOCAL;
    };
}

/**
*   Create info object
*   @function
*/
function createInfo() {
    return new Info();
}

exports.create = createInfo;