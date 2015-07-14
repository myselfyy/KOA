//后置执行的业务中间件

//html性能优化、监测注入
module.exports = {
    //注入统计代码
    inject: function *(next){
        yield next;
        var html = this.body;
    }
};