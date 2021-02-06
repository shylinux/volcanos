const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    name: "river",
    data: {
        action: ["刷新", "扫码", "登录"],
        list: [],
    },
    action: {
        "刷新": function(event, page) {
            app.requests(page.name, {}, function(msg) {
                page.setData({list: msg.Table()})
            })
        },
        "扫码": function(event, page) {
            app.scans(function(res) {
                switch (res.type) {
                    case "button": res.name && page.onaction(event, res); break
                    default: return false
                } return true
            })
        },
        "登录": function(event, page) { app.conf.sessid = ""
            app.userinfo(function(res) { page.onaction(event, {name: "刷新"}) })
        },
    },
    onaction: function(event, data) { data = data || event.target.dataset
        console.log("action", this.name, data.name)
        this.action[data.name](event, this)
    },
    ondetail: function(event, data) { data = data || event.target.dataset
        var page = this, item = page.data.list[data.index]
        item._show = !item._show; if (item.list) {
            return page.setData({list: page.data.list})
        }

        app.requests(page.name, {cmds: [item.hash, "tool"]}, function(msg) {
            item.list = msg.Table(), page.setData({list: page.data.list})
        })
    },
    onchange: function(event, data) { data = data || event.target.dataset
        var item = this.data.list[data.index]; var tool = item.list[data.i]
        app.jumps("action/action", {river: item.hash, storm: tool.hash, title: item.name+"."+tool.name})
    },

    onLoad: function (options) { this.onaction({}, {name: "刷新"}) },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onPullDownRefresh: function () { this.onaction({}, {name: "刷新"}) },
    onShareAppMessage: function () {}
})
