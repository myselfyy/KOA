//前置执行的业务中间件
module.exports = {
    pageData: function*(next){
        var cookies = this.cookies;
        this.nick = cookies.get('nick');
        this.token = cookies.get('token_');
        this.userId = cookies.get('uid');
        this.ip = this.ip || '';
        this.ua = this.req.headers["user-agent"] || '';
        //当前页面业务线[list,detail,comment]

        // x-response-time
        var start = new Date;
        yield next;
        var ms = new Date - start;
        this.set('X-Response-Time', ms + 'ms');
    }
};