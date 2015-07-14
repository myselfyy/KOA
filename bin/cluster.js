#!/usr/bin/env node
'use strict';

/*
* host-reload with cmd $kill -s SIGUSR2 <cluster_pid>
**/
var recluster = require('recluster'),
    path = require('path'),
    logger = require('../app/helpers/logger').getLogger('server');

var cluster = recluster(path.join(__dirname, 'server.js'));
cluster.run();

process.on('SIGUSR2', function() {
    logger.warn('Got SIGUSR2, reloading cluster...');
    cluster.reload();
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");