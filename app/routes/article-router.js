var render = require('../helpers/render'),
    utils = require('../helpers/utils'),
    myUser = require('../models/user');

//检查Id是否存在
function *checkObjectId(objectId,next){
    if(!objectId){
        this.redirectError('缺少Id');
    }else{
        this.objectId = objectId;
        yield next;
    }
}

//检查是否已经登录
function*checkLogin(next){
    var isLogin = yield myUser.checkLogin.bind(this)();
    this.isLogin = isLogin;
    if(!isLogin){
        this.redirectError('请先登录后再操作');
        return false;
    }
    yield next;
}

module.exports = function (router){
    router.get('/item', function *(next){
        yield next;
    });

    router.param('objectId', checkObjectId).get('/art/:objectId/item', checkLogin, function *(next) {
        this.body = utils.extend(this.params, this.ua);
        yield next;
    });

    router.param('objectId', checkObjectId).get('/art/:objectId/recommend', checkLogin, function *(next) {
        this.body = '<h1>相关</h1>';
        this.body += JSON.stringify(this.params);
        yield next;
    });
};