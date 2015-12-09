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
        if (view != '') process._templates_[view] = res;
    },
    readUTF8File: function (file, fn, done){
        fs.readFile(file, 'utf8', function(err, str){
            if (err) return fn(err);
            // remove extraneous utf8 BOM marker
            str = str.replace(/^\uFEFF/, '');
            return fn(null, str);
        });
    },
    extend: function (object) {
        // Takes an unlimited number of extenders.
        var args = Array.prototype.slice.call(arguments, 1);

        // For each extender, copy their properties on our object.
        for (var i = 0, source; source = args[i]; i++) {
            if (!source) continue;
            for (var property in source) {
                object[property] = source[property];
            }
        }

        return object;
    },

    extendDeep: function(a, b){
        if ("_" in window) {
            for (var k in b) {
                if ( _.isObj(b[k]) )
                    arguments.callee(a[k], b[k]);
                else
                    (a[k] = b[k]);
            }
            return a
        }
    }
};