var render = require('../helpers/render');

module.exports = function (router){
    router.get('/item', function *(next){
        yield next;
    });

    router.get('/item/:id', function *(next){
        this.body = this.params;
        yield next;
    });
    router.get('/item/:id/recommend', function *(next){
        this.body = '<h1>相关</h1>';
        this.body += JSON.stringify(this.params);
        yield next;
    });
};