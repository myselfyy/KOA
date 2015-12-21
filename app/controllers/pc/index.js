exports.index = function *() {
    var view = this.rpsPage + '/index';
    this.graver = true;

    var session = this.session;
    session.count = session.count || 0;
    session.count += 1;

    yield this.html(view, {
        data: {
            title: "正品网" + session.count
        },
        partial: {
            welcome: 'common/welcome'
        }
    });
};