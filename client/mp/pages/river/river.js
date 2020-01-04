const utils = require("../../utils/util.js")
const app = getApp()

Page({
    data: {
        cmd: "",
        msg: {append: ["hi", "he"], hi: [1, 2], he: [3, 4]},
    },

    onClick: function(event) {var page = this, index = event.currentTarget.dataset.index
        app.jumps("/pages/storm/storm", {river: page.data.msg.key[index]})
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
    onLoad: function (options) {var page = this
        app.userinfo(function(userinfo) {
            app.request("river", {}, function(msg) {
                page.setData({msg: msg})
                if (msg[msg.append[0]].length == 1) {
                    app.jumps("/pages/storm/storm", {river: page.data.msg.key[0]})
                }
            })
        })
    },
    onReady: function () {},
    onShow: function () {
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
