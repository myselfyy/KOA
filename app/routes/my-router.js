var check = require('../helpers/check-middleware');

module.exports = function (router){
    router.param('personalHomePage', check.checkLogin).get('/my', function *(next){
        this.body = 'This is PH.'
        yield next;
    });
};