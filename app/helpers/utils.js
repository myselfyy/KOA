var fs = require('fs');
module.exports = {
    /**
     * 随机生成min~max之间的整数，包括min、max；
     * @param {number} min
     * @param {numver} max
     * @returns {number}
     */
    randomIntFromInterval: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    //缓存模版预编译结果
    /*
    * @param {Error} err
    * @param {String} path
    * @param {Object} res
    **/
    registerTpl: function (view, res) {
        view = view.replace(/.*\/app\/views\//, '');
        if (view != '') global.templates[view] = res;
    },
    readUTF8File: function (file, fn, done){
        fs.readFile(file, 'utf8', function(err, str){
            if (err) return fn(err);
            // remove extraneous utf8 BOM marker
            str = str.replace(/^\uFEFF/, '');
            return fn(null, str);
        });
    }
};