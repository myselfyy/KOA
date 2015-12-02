//模版预编译缓存
var path = require('path');
var render = require('./render');

//增加文件扫描
var viewList = ['layout/defaultNotFound','common/defaultNotFound','home/welcome'];

module.exports = function (){
    for (view of viewList) {
        console.log(view);
        render.compile(view);
    }
};