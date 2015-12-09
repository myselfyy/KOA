exports.index = function *() {
    var data = {"title":"珍品拍"};
    var view = this.rpsPage + '/index';
    this.graver = true;
    yield this.html(view, data);
};