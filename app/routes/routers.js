var fileServer = require('koa-static');
var path = require('path');
var router = new ( require('koa-router') )();

var maxAge = 24 * 60 * 60 * 1000;

function *notFound(next) {
    if (this.status == 404) {
        yield this.render('common/defaultNotFound', {
            "data": {
                "name": 'Chris',
                "value": 10000,
                "taxed_value": 0.9,
                "in_ca": true,
                "title": 'xxxxxxx'
            },
            partial: {
                welcome: 'home/welcome',
                layout: 'layout/defaultNotFound'
            }
        });
    }
    yield next;
}

function *favicon(next){
    if ('/favicon.ico' != this.path) return yield next;
    if (!path) return;

    if ('GET' !== this.method && 'HEAD' !== this.method) {
      this.status = 'OPTIONS' == this.method ? 200 : 405;
      this.set('Allow', 'GET, HEAD, OPTIONS');
      return;
    }

    this.redirect('https://assets-cdn.github.com/favicon.ico');
};

var publicFiles = fileServer(path.join(__dirname.split('/app/')[0]+'/public'), {index: true, maxage: maxAge});

require('./home-router')(router);
require('./item-router')(router);
require('./my-router')(router);

module.exports = function (app){
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(favicon);
    app.use(publicFiles);
    app.use(notFound);
};