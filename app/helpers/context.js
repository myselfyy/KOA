//向应用上下文注入方法
var logger = require('./logger').getLogger('request');
var render = require('./render');

//context专用log，注入访问者信息
function log(type,info){
    var msg = info;
    if(typeof info !== 'object'){
        var userId = this.userId && '[userId] '+ this.userId + ' '  || '';
        var ip = this.ip || '';
        if(ip){
            var ips = ip.split(':');
            ip = ips[ips.length-1];
            ip = '[ip] '+ ip + ' ';
        }
        msg = userId + ip + info;
    }
    logger[type](msg);
    return this;
}

module.exports = function(app){
    //应用专用的渲染方法
    process._templates_ = {};
    app.context.render = render.render;
    app.context.html = render.html;
    app.context.api = render.api;

    //覆写错误输出
    if(process.env.NODE_ENV === 'production') {
        app.context.onerror = render.redirectError;
    }

    //打印log
    app.context.info = function(info){
        return log.bind(this)('info',info);
    };
    app.context.error = function(info){
        return log.bind(this)('error',info);
    };
};