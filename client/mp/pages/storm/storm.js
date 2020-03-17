const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码", "刷新", "登录"],
        msg: {append: ["key", "name"]},
        river: "",
    },
    action: {
        "扫码": function(event, page, data, name) {
            app.scans(function(res) {
                app.toast()
            })
        },
        "刷新": function(event, page, data, name) {
            app.request("storm", {cmds: [data.river||page.data.river]}, function(msg) {
                page.setData({msg: msg}), msg.nRow() == 1 && page.ondetail(event, data, 0)
            })
        },
        "登录": function(event, page, data, name) {
            app.conf.sessid = "", app.usercode(function() {
                page.onaction(event, data, "刷新")
            })
        },
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "storm", name)
        this.action[name](event, this, data)
    },
    ondetail: function(event, data, index) {
        data = data || event.target.dataset, index = index||data.index||0
        console.log("detail", "storm", index)
        app.jumps("action/action", {river: data.river||this.data.river, storm: this.data.msg.key[index]})
    },


    onLoad: function (options) {
        console.log("page", "storm", options)
        app.conf.sessid = options.sessid || app.conf.sessid
        this.data.river = options.river
        this.onaction({}, options, "刷新")
    },
    onReady: function () {},
    onShow: function (args) {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {
        this.onaction({}, {}, "刷新")
    },
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
