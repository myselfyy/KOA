var rps = require('../lib/rps');

module.exports = function (router){
    router.get('/', function *(next){
    	
        yield this.html('page/index', {
            "data": {
                "title": "index page"
            }
        });

        yield next;
    });

    router.get('/check', rps('index','index','pc'));
};