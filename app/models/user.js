//用户相关的模型
var data = require('../helpers/data');

module.exports = {
    //必须登录
    userId: function *(uid) {
        var item = yield data.fetch.bind(this)('user.userId', {userId: uid});
        return data.output(item,'userId');
    },
    //检验用户是否已经登录
    //可以检验到登录是否超时
    checkLogin: function *(){
        var checkLogin = yield data.fetch.bind(this)('checkLogin');
        if(checkLogin.status !== 200) return false;
        return checkLogin.data.login;
    }
};