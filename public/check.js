var lib = {};
lib.check = (function(win){
    return 'lib' in win;
})(window);