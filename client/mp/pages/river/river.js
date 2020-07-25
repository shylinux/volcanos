const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码", "刷新", "登录", "授权"],
        msg: {append: ["key", "name"]},
    },
    action: {
        "扫码": function(event, page, data, name) {
            app.scans(function(res) {
                page.onaction(event, res, res.name)
            })
        },
        "刷新": function(event, page, data, name) {
            app.request("river", {}, function(msg) {
                page.setData({msg: msg}), msg.nRow() == 1 && page.ondetail(event, data, 0)
            })
        },
        "登录": function(event, page, data, name) {
            app.conf.sessid = "", app.usercode(function() {
                page.onaction(event, data, "刷新")
            })
        },
        "授权": function(event, page, data, name) {
            app.userinfo(function(res) {
                page.onaction(event, res, res.name)
            })
        },
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "river", name)
        this.action[name](event, this, data)
    },
    ondetail: function(event, data, index) {
        data = data || event.target.dataset, index = index||data.index||0
        console.log("detail", "river", index)
        app.jumps("storm/storm", {river: this.data.msg.key[index], title: this.data.msg.name[index]})
    },

    onLoad: function (options) {
        console.log("page", "river", options)
        app.conf.sessid = options.sessid || app.conf.sessid
        this.onaction({}, options, "刷新")
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {
        this.onaction({}, {}, "刷新")
    },
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
