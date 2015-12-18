
/*
* 列表推荐
* */
exports.item = function *() {
    var data = {
        "title": "今日头条"
    };
    var view = this.rpsPage + '/index';
    yield this.html(view, {
        data: data
    });
};

/*
 * 相关推荐
 * */
exports.recommend = function *() {
    var data = {
        "title": "相关推荐"
    };

    this.api(this.params);
};