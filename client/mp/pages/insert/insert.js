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
        app.data.insert[data.input.name] = event.detail.value
    },
    onFocus: function(event) {},
    onConfirm: function (event) {
        console.log(app.data.insert)
        app.data.insertCB(app.data.insert)
        wx.navigateBack()
    },
    onLoad: function (options) {
        app.data.insert = {}
        this.data.field = app.data.field
        this.data.field = app.data.field
        this.data.insert = app.data.field.feature.insert
        console.log("page", "insert", options)
        kit.List(this.data.insert, function(item) {
            item.action = item.action || item.value
            item.value && item.value.startsWith("@") && (item.value = "")
            app.data.insert[item.name] = item.value
        })
        app.title(options.title)
        this.setData(this.data)
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
})
