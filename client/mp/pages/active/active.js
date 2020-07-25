const utils = require("../../utils/util.js")
const app = getApp()

Page({
    data: {
        cmd: "",
        msg: {append: ["hi", "he"], hi: [1, 2], he: [3, 4]},
    },

    onFocus: function(event) {},
    onInput: function(event) {},
    onEnter: function(event) {var page = this
        app.userinfo(function(user) {
            app.request("mp/login/", {cmds: ["cmds", event.detail.value]}, function(msg) {
                page.setData({cmd: "", msg: msg})
            })
        })
    },
    onLoad: function (options) {},
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
