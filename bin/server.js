//应用启动的入口文件
//#!/usr/bin/env node
'use strict';

var app      = require('../app'),
    graceful = require('graceful'),
    logger   = require('../app/helpers/logger').getLogger('server');

var port = process.env.PORT || 6001;

//给应用上下文注入方法
var context = require('../app/helpers/context');
context(app);

var router = require('../app/routes/routers');
router(app);

var server = app.listen(port, function(){
    logger.info('kos server listening on port ' + port);
});

graceful({
    server: server,
    killTimeout: 30 * 1000,
    error: function(err, throwErrorCount){
        if(err.message){
            err.message +=
                ' (uncaughtException throw ' + throwErrorCount +
                ' times on pid:' + process.pid + ')';
        }
        logger.error(err);
    }
});

module.exports = server;