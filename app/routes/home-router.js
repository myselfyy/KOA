module.exports = function (router){
    router.get('/', function *(next){
        var home = yield this.compile('home/welcome', {
            "data": {
                "title": "xxxxx"
            }
        });
        this.body = home;
        yield next;
    });
};