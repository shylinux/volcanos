const utils = require("../../utils/util.js")
const app = getApp()

Page({
    data: {
        river: "", msg: {append: ["key", "name"]},
    },
    refresh: function() {var page = this
        app.request("storm", {cmds: [page.data.river]}, function(msg) {
            page.setData({msg: msg}), msg.nRow() == 1 && page.toAction(0)
        })
    },
    toAction: function(index) {app.jumps("action/action", {river: this.data.river, storm: this.data.msg.key[index]})},

    onFocus: function(event) {},
    onInput: function(event) {},
    onEnter: function(event) {},
    onClick: function(event) {this.toAction(event.currentTarget.dataset.index)},

    onLoad: function (options) {
        console.log("page", "storm", options)
        app.conf.sessid = app.conf.sessid || options.sessid
        this.data.river = options.river, this.refresh()
    },
    onReady: function () {},
    onShow: function (args) {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {this.refresh()},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
