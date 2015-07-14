var render = {'api': function(params){
    console.log('check-middleware');
    this.body = params.msg;
    return this;
}};
var data = require('./data');
var mUser = require('../models/user');

//用来校验参数与登录的通用中间件
module.exports = {
    //是否带有商品ID
    apiItemId: function *(next){
        var itemId = this.params.id;
        if(!itemId){
            return render.api.bind(this)({status: false, msg: '商品id不存在'});
        }else{
            this.itemId = itemId;
            yield next;
        }
    },
    //是否长登录状态
    isLongLogin: function *(){
        var isLogin = true;
        render.api.bind(this)({
            isLogin: isLogin
        },true);
    },
    //是否短登录状态
    isLogin: function *(){
        var isLogin = yield mUser.checkLogin.bind(this)();
        render.api.bind(this)({
            isLogin:isLogin
        },true);
    },
};