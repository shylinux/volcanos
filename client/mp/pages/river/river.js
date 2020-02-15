const utils = require("../../utils/util.js")
const app = getApp()

Page({
    data: {
        msg: {append: ["key", "name"]},
    },
    refresh: function() {var page = this
        app.request("river", {}, function(msg) {page.setData({msg: msg})
            msg.nRow() == 1 && page.toStorm(0)
        })
    },

    toStorm: function(index) {app.jumps("storm/storm", {river: this.data.msg.key[index]})},

    onFocus: function(event) {},
    onInput: function(event) {},
    onEnter: function(event) {},
    onClick: function(event) {this.toStorm(event.currentTarget.dataset.index)},

    onLoad: function (options) {
        console.log("page", "river", options)
        app.conf.sessid = app.conf.sessid || options.sessid
        this.refresh()
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {this.refresh()},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
