var Path = require("path");

//函数是否是generatorFunction的判断方法
function isGeneratorFunction(obj) {
    return obj && obj.constructor && 'GeneratorFunction' === obj.constructor.name;
}

var TYPE = ['pc','hd','ph'];
//获取设备类型
function ua(use){
    var type = this.ua && this.ua.type || '';
    if(!type){
        throw new Error('缺少 this.ua 变量，缺少 ua 插件 ');
    }
    //设置类型简写
    switch(type){
        case 'desktop':
            type = 'pc';
            break;
        case 'tablet':
            type = 'hd';
            break;
        case 'phone':
            type = 'ph';
            break;
        default:
            type = 'pc';
            break;
    }

    if(typeof use === 'string' && TYPE.indexOf(use) > -1){
        type = use;
    }else if(typeof use === 'function'){
        //自定义设备
        //demo rps('detail','pmpItem',function(type){return 'pc';})
        type = use.call(this,type);
    }

    return type;
}

//根据终端加载不同的controller
module.exports  = function (fileName, actionName, use){
    var self = this;
    return function *(){
        //终端类型
        var type = ua.bind(this)(use);
        var rootPath = this.$global && this.$global.ROOT_PATH || process.cwd();
        var root = rootPath + '/app';
        var path = Path.join(root, "controllers",type, fileName);
        var controller;

        try {
            controller = require(path);
        }
        catch (e) {
            throw e;
        }
        this.rpsType = type;
        this.rpsPage = Path.join('page', type);

        var action = controller[actionName];
        if(!action) throw new Error('controller cannot find method '+ actionName);
        if(!isGeneratorFunction(action)) throw new Error("method of controller isn't generator function "+ actionName);

        return yield action.bind(this)();
    }
};