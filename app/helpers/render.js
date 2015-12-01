var Hogan = require('hogan.js');
var path = require('path');
var send = require('koa-send');

var logger = require('./logger').getLogger('server');
var utils = require('./utils');

var base = path.dirname(module.parent.filename);
var viewsRoot = __dirname.replace(/\/app\/.*/, '/app/views/');

function getPartials(partial){
    var partials = {};
    for (key in partial) {
        partials[key] = global.templates[partial[key]]
    }
    return partials;
}

var render = {
    //预编译模版
    /*
    * @param {String} view
    * @param {Object} options {reload, cache}
    * */
    _fncompile: function (view, options) {
        options = options || {cache: true};
        return function(done){
            var file = viewsRoot + view;
            var ext = path.extname(file);
            if (ext && ext !== 'hjs') throw('compile file type error: ' + file);
            if (!ext)
                file += '.hjs';
            var fn = function(err, str){
                if (err) throw('read file error: ' + err);
                var tpl = Hogan.compile(str);
                if (options.cache) utils.registerTpl(view, tpl);
                done();
            };

            if (view in global.templates || options.reload) {
                done();
            } else {
                utils.readUTF8File(file, fn);
            }
        }
    },
    //编译返回结果
    /*
    * @return {String} html
    * */
    compile: function (view, opts){
        return function *(){
            opts = opts || {};
            var ext = path.extname(view).slice(1);
            if (ext == 'html'){
                yield send(this, view);
            } else {
                yield render._fncompile(view);
                var partials = getPartials(opts.partial);
                return global.templates[view].render(opts.data, partials);
            }
        }
    },
    //渲染模版重新载入页面
    /**
     * @param {String} view
     * @param {Object} opts
     */
    _render: function *(view, opts) {
        opts = opts || {};
        var templates = global.templates;
        if (typeof view == 'object') {
            opts = view;
            view = opts.root || base;
        } else if(!view) {
            view = base;
        }

        var ext = path.extname(view).slice(1);
        if (ext == 'html') {
            yield send(this, view);
        } else {
            var arr = [view];
            for (key in opts.partial) {
                arr.push(opts.partial[key]);
            }

            for (v of arr) {
                yield render._fncompile(v);
            }

            var partials = getPartials(opts.partial);
            this.body = global.templates[view].render(opts.data, partials);
        }
    },
    //渲染html
    /*
    * @param {String} viewName
    * @param {Object} data
    **/
    html: function *(viewName, data){
        data.isLogin = util.isLogin.bind(this)();
        data.ip = this.ip || '';
        data.ua = this.$ua.type;
        data.userId = this.userId;
        data.token = this.token;
        data.nick = this.nick;

        try{
            yield this.render(viewName, data);
        }catch (e){
            var page = this.buPage + '/error/error-page';
            var message = e.message;
            logger.error(this.url + '-->' + message);
            yield this.render(page, {message: message, title: '页面模版错误'});
        }
    },
    //输出api接口数据
    /*
    * @param {Object} data
    * @param {Boolean} jsonp
    **/
    api: function(data,jsonp){
        this.type = 'application/json; charset=utf-8';
        var output = '{}';
        if(typeof data == 'object'){
            output = JSON.stringify(data);
        }
        if(jsonp){
            var callback = this.request.query.callback;
            if(callback){
                if(this.SecurityUtil){
                    callback = this.SecurityUtil.escapeHtml(callback);
                }
                //\r\n防止UTF7XSS
                output = "\r\n" + callback+'('+output+')';
            }
        }
        this.body = output;
        return this;
    },
    //发生错误，输出错误信息的json
    /*
    * @param {String} msg
    * @param {Boolean} jsonp
    **/
    errorApi: function(msg,jsonp){
        return render.api.bind(this)({success:false, msg:msg || ''},jsonp);
    },
    //发生异常重定向到错误页面
    /*
    * @param {}
    **/
    redirectError: function(err){
        //所有的路由都会触发error事件
        if(!err) return false;
        logger.error(JSON.stringify(err));

        if(process.env.NODE_ENV === 'production'){
            this.redirect('/error.html');
        }
        this.type = 'text/html; charset=utf-8';
        this.res.end(err.message || 'error page redirect.');
    }
};

module.exports = render;