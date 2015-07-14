### Server handcraft with KOA,mongoose,hogan
* session\temp 数据处理
* 模版文件预编译、缓存、更新
* 站点埋点控制

### 目录
- app
    - apis: 服务借口
    - helpers: 工具型中间件
    - controllers: 业务逻辑逻辑操作单元
    - models: 应用层数据操作
    - views: 视图模版
    - routes: 路由
- bin
    * server.js
    * cluster.js
- config
    * interface.json
    * base.conf
    * dev.conf
    * pro.conf
- log
    * log files
- public
    * static store some shit