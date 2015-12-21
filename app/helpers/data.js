/*
* 应用层models直接使用 data.func(params)
* 
*/
var mongoose = require('mongoose');
var logger = require('../helpers/logger').getLogger('server');
var PREFIX = 'NMDB:';//node db
var cacheMongo;
var Models = {};
module.exports = {
    //连接
    /*
    * @param {String} host
    * @param {Int} port
    * @param {String} db
    * @param {String} user 
    * @param {String} password
    *****缺省******
    * @param {String} collection 
    * @param {Boolean} ssl
    * @param {Int} ttl
    **/
    connect: function(options){
        mongoose.connect(options);

        var db = mongoose.connection;
        db.on('error', function(err){
            logger.error('mongo connection error: %s',err);
        });
        db.once('open', function(){
            logger.info('mongo connected.');
        });

        this.mongoose = mongoose;
    },
    //环境监察
    /*
    * @param {String} collection
    **/
    _check: function(collection){
        if(!mongoose) return false;
        
        var model = Models[PREFIX + collection];
        var ret = !!model ? model : false;
        return ret;
    },
    // 初始化model
    /*
    * @param {String} collection
    * @param {obj} schema
    **/
    addModel: function(collection, schema){
        var model = Models[PREFIX + collection];
        if(!!model) return false;

        model = mongoose.model(collection, schema);
        Models.push(model);
    },

    // 存储数据
    /*
    * @param {String} key
    * @param {Obj|String} value
    * @param {Int} expired
    **/
    save: function *(collection, data){
        var model = Models[PREFIX + collection];
        if(!model) return false;

        return yield mongoose.set(PREFIX + key,value,{expired:expired});
    },

    fetch: function *(collection, params){
        params = params || {};
        var model = Models[PREFIX + collection];
        if(!model) return false;

        var ret = yield model.find(params);
        return ret;
    }
};
