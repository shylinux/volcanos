const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码"],
        field: {},
        insert: [],
    },
    action: {
        "扫码": function(event, page, data, name) {
            app.scans(function(res) {
                res["sess.river"] = page.data.river
                res["sess.storm"] = page.data.storm
                app.request("mp/login/scan", res)
                page.onaction(event, res, res.name)
            })
        },
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "action", name)
        this.action[name](event, this, data)
    },

    onInput: function(event) {var page = this, data = event.target.dataset
        app.data.insert[data.index].value = event.detail.value
    },
    onFocus: function(event) {},
    onConfirm: function (event) { var page = this
        kit.List(page.data.insert, function(item) {
            app.data.insert.data[item.name] = item.value
        })
        app.data.insert.cb(app.data.insert.data)
        wx.navigateBack()
    },
    onLoad: function (options) {
        this.data.insert = app.data.insert.list

        var p = app.data.insert.input.action
        if (p.startsWith("@")) {
            var cb = this.plugin[p.slice(1,-1)]; cb && cb(this)
        }
        var cb = this.plugin[p]; cb && cb(this)
        kit.List(app.data.insert.list, function(item) {
            item.action = item.action || item.value
            item.value && item.value.startsWith("@") && (item.value = "")
            app.data.insert.data[item.name] = item.value
        })
        console.log("page", "insert", options)
        app.title(options.title)
        this.setData(this.data)
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},

    plugin: {
        getLocation: function(page, data) { app.location({success: function(res) {
            res.latitude = parseInt(res.latitude * 100000)
            res.longitude = parseInt(res.longitude * 100000)
            kit.List(page.data.insert, function(item) {
                res[item.name] && (item.value = res[item.name])
            }), page.setData(page.data)
        }}) },
        scanQRCode: function(page) { app.scans(function(res) {
            kit.List(page.data.insert, function(item) {
                res[item.name] && (item.value = res[item.name])
            }), page.setData(page.data)
        }) },
        paste: function(page, data) { wx.getClipboardData({success: function(res) {
            kit.List(page.data.insert, function(item) {
                res[item.name] && (item.value = res[item.name])
            }), page.setData(page.data)
        }}) },
    },
})
