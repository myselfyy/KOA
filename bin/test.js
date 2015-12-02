var path = require('path');
var app = require('koa')();
var routes = require('../app/routes/routers');
var logger = require('../app/helpers/logger').getLogger('server');

//模版预编译缓存
process._templates_ = {};

//给应用上下文注入方法
var context = require('../app/helpers/context');
context(app);

//前置执行的业务中间件
var beforeMiddleware = require('../app/helpers/before-middleware');
app.use(beforeMiddleware.pageData);

//后置执行的业务中间件
var afterMiddleware = require('../app/helpers/after-middleware');
app.use(afterMiddleware.inject);

// x-response-time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger.info('woha');

// response
routes(app);

app.listen(3000);
logger.info('Begin.');