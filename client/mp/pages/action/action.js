const utils = require("../../utils/util.js")
const app = getApp()

Page({
    data: {
        button: [
            {name: "串行", bind: "action"},
            {name: "并行", bind: "action"},
            {name: "清屏", bind: "refresh"},
            {name: "清空", bind: "refresh"},
            {name: "共享", bind: "refresh"},
        ],
        msg: {append: ["hi", "he"], hi: [1, 2], he: [3, 4]},
        res: [],
    },
    run: function(order, cb) {var page = this
        app.request("action", {cmds: [page.data.river, page.data.storm, order]}, function(msg) {
            page.data.res[order].msg = msg
            typeof cb == "function" && cb(msg)
            page.setData({res: page.data.res})
        })
    },
    action: function(event) {var page = this, name = event.target.dataset.name
        switch (name) {
            case "串行":
                function cb(i) {
                    page.run(i, function() {i < page.data.res.length && cb(i+1)})
                }
                cb(0)
                break
            case "并行":
                for (var i = 0; i < page.data.res.length; i++) {page.run(i)}
                break
        }
    },
    refresh: function() {var page = this, data = []
        app.userinfo(function(userinfo) {
            app.request("action", {cmds: [page.data.river, page.data.storm]}, function(msg) {
                msg.Table(function(line) {
                    line.feature = JSON.parse(line.feature)
                    line.inputs = JSON.parse(line.inputs)
                    if (!line.inputs || line.inputs.length === 0) {
                        line.inputs = [{_input: "text"}, {_input: "button", value: "执行"}]
                    }
                    data.push(line)
                })
                page.setData({res: app.data[page.data.river+page.data.storm] = page.data.res = data})
            })
        })
    },

    onFocus: function(event) {},
    onInput: function(event) {},
    onEnter: function(event) {var page = this, data = event.target.dataset
        console.log(event)
    },
    onClick: function(event) {this.run(event.target.dataset.order)},

    onLoad: function (options) {var page = this
        page.data.river = options.river
        page.data.storm = options.storm
        var data = app.data[options.river+options.storm]
        if (data) {return page.setData({res: page.data.res = data})}
        this.refresh()
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {this.refresh()},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})
