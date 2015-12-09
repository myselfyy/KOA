var device= require('device');
//前置执行的业务中间件

function deviceCheck(req) {
    var useragent = req.headers['user-agent'];
    var mydevice = device(useragent);

    if (!useragent || useragent === '') {
        if (req.headers['cloudfront-is-mobile-viewer'] === 'true') return 'phone';
        if (req.headers['cloudfront-is-tablet-viewer'] === 'true') return 'tablet';
        if (req.headers['cloudfront-is-desktop-viewer'] === 'true') return 'desktop';
        // No user agent.
        return mydevice.parser.options.emptyUserAgentDeviceType;
    }

    return {
        //parser: mydevice.parser,
        type: mydevice.type,
        name: mydevice.model
    };
}

module.exports = {
    pageData: function *(next){
        var cookies = this.cookies;
        this.nick = cookies.get('nick');
        this.token = cookies.get('token_');
        this.userId = cookies.get('uid');
        this.ip = this.ip || '';
        this.ua = deviceCheck(this.req);
        //当前页面业务线[list,detail,comment]

        // x-response-time
        var start = new Date;
        yield next;
        var ms = new Date - start;
        this.set('X-Response-Time', ms + 'ms');
    }
};