module.exports = function (router){
    router.get('/', function *(next){
        var home = yield this.html('home/welcome', {
            "data": {
                "title": "home page"
            }
        });
        this.body = home;
        yield next;
    });
};