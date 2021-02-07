const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    name: "insert",
    data: {
        action: ["扫码"],
        list: [],
    },
    action: {
        "扫码": function(event, page) { app.scans(function(res) {
            switch (res.type) {
                case "button": res.name && page.onaction(event, res); break
                default: return false
            } return true
        }) },
    },
    onaction: function(event, data) { data = data || event.target.dataset
        console.log("action", this.name, data.name)
        this.action[data.name](event, this)
    },

    onInput: function(event) { var page = this, data = event.target.dataset
        page.data.list[data.index].value = event.detail.value
    },
    onChange: function(event) { var page = this, data = event.target.dataset
        var input = page.data.list[data.index]
        input.value = input.values[parseInt(event.detail.value)]
    },
    onConfirm: function (event) { var page = this
        var res = {}; kit.List(page.data.list, function(item) { res[item.name] = item.value })
        app.data.insert.cb(res), wx.navigateBack()
    },

    onLoad: function (options) {
        console.log("page", this.name, options)
        app.title(options.title)

        kit.List(app.data.insert.list, function(input) {
            input.action = input.action || input.value
            input.value == "auto" && (input.value = "")

            if (input.value && input.value.indexOf("@") == 0) {
                input.action = input.value.slice(1), input.value = ""
            }
        })

        this.setData({list: this.data.list = app.data.insert.list})
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onPullDownRefresh: function () {},
})
