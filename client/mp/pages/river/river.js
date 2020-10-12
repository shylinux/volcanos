const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码", "刷新", "登录"],
        river: {},
    },
    action: {
        "扫码": function(event, page, data) { app.scans(function(res) {
            switch (res.type) {
                case "url":
                    app.request("mp/login/scan", res, function(msg) {
                        page.onaction({}, {}, "刷新")
                    })
                    break
                default:
                    res.name && page.onaction(event, res, res.name)
            }
        }) },
        "刷新": function(event, page, data) {
            wx.showLoading()
            app.request("river", {}, function(msg) {
                wx.hideLoading()
                var river = {}; msg.Table(function(value) {
                    river[value.hash] = value
                })
                page.setData({river: river})
            })
        },
        "登录": function(event, page, data) { app.conf.sessid = "",
            app.userinfo(function(res) {
                page.onaction(event, data, "刷新")
            })
        },
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "river", name)
        this.action[name](event, this, data)
    },
    ondetail: function(event, data) { var page = this
        data = data || event.target.dataset.item
        console.log("detail", "river", data)

        var river = page.data.river[data.hash]
        if (river.tool) {
            river.hidetool = !river.hidetool
            page.setData({river: page.data.river})
            return
        }

        wx.showLoading()
        app.request("river", {cmds: [data.hash, "tool"]}, function(msg) {
            wx.hideLoading()
            river.tool = {}; msg.Table(function(value) {
                river.tool[value.hash] = value
                value.river = data
            })
            page.setData({river: page.data.river})
        })
    },
    onchange: function(event, data) { var page = this
        data = data || event.target.dataset.item
        app.jumps("action/action", {river: data.river.hash, storm: data.hash, title: data.river.name+"."+data.name})
    },

    onLoad: function (options) { var page = this
        console.log("page", "river", options)
        app.conf.sessid = options.sessid || app.conf.sessid
        app.usercode(function() {
            page.onaction({}, options, "刷新")
        })
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
