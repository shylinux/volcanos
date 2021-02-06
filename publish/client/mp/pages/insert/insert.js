const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        insert: [],
        action: ["扫码"],
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
        console.log("action", "river", data.name)
        this.action[data.name](event, this)
    },

    onInput: function(event) {var page = this, data = event.target.dataset
        app.data.insert.list[data.index].value = event.detail.value
    },
    onChange: function(event) { var page = this, data = event.target.dataset
        var input = app.data.insert[data.index]
        input.value = input.values[parseInt(event.detail.value)]
    },
    onConfirm: function (event) { var page = this
        kit.List(page.data.insert, function(item) {
            app.data.insert.data[item.name] = item.value
        })
        app.data.insert.cb(app.data.insert.data)
        wx.navigateBack()
    },
    onLoad: function (options) { app.title(options.title)
        console.log("page", "insert", options)

        kit.List(app.data.insert.list, function(item) {
            item.value && item.value.indexOf("@") == 0 && (item.value = "")
            app.data.insert.data[item.name] = item.value
            item.action = item.action || item.value
        })

        this.data.insert = app.data.insert.list
        this.setData(this.data)
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onPullDownRefresh: function () {},
})
