const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        river: {},
        action: ["刷新", "扫码", "登录"],
    },
    action: {
        "刷新": function(event, page) { wx.showLoading()
            app.request("river", {}, function(msg) { wx.hideLoading()
                page.setData({river: msg.Table()})
            })
        },
        "扫码": function(event, page) { app.scans(function(res) {
            switch (res.type) {
                case "button": res.name && page.onaction(event, res); break
                default: return false
            } return true
        }) },
        "登录": function(event, page) { app.conf.sessid = ""
            app.userinfo(function(res) { page.onaction(event, {name: "刷新"}) })
        },
    },
    onaction: function(event, data) { data = data || event.target.dataset
        console.log("action", "river", data.name)
        this.action[data.name](event, this)
    },
    ondetail: function(event, data) { data = data || event.target.dataset
        var page = this, river = page.data.river[data.index]
        river._show = !river._show; if (river.list) {
            return page.setData({river: page.data.river})
        }

        wx.showLoading()
        app.request("river", {cmds: [river.hash, "tool"]}, function(msg) { wx.hideLoading()
            river.list = msg.Table(), page.setData({river: page.data.river})
        })
    },
    onchange: function(event, data) { data = data || event.target.dataset
        var river = this.data.river[data.index]; var storm = river.list[data.i]
        app.jumps("action/action", {river: river.hash, storm: storm.hash, title: river.name+"."+storm.name})
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
