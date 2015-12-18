var rps = require('../lib/rps');

module.exports = function (router){
    router.get('/', rps('index', 'index', 'pc'));
    router.get('/index', rps('index','index','pc'));
};