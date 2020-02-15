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
            {name: "扫码", bind: "action"},
        ],
        res: [],
        his: {},
        inputs: {},
    },
    run: function(order, cmd, cb) {var page = this, field = page.data.res[order]
        // var his = page.data.his[order] || []
        var arg = []
        field.inputs.forEach(function(input) {
            if (input._input == "text") {
                arg.push(input.value||"")
            }
            if (input._input == "textarea") {
                arg.push(input.value||"")
            }
        })
        // his.push(arg)
        // page.data.his[order] = his

        var cmds = [page.data.river, page.data.storm, order]
        cmds = cmds.concat(cmd||arg||[])

        for (var i = cmds.length-1; i > 0; i--) {
            if (cmds[i] === "") {cmds.pop()} else {break}
        }
        app.request("action", {cmds: cmds}, function(msg) {
            page.data.res[order].msg = msg
            page.setData({res: page.data.res})
            console.log("update-----", page.data.res[order])
            typeof cb == "function" && cb(msg)
        })
    },
    action: function(event) {var page = this, name = event.target.dataset.name
        switch (name) {
            case "扫码":
                app.jumps("scans/scans")
                break
            case "串行":
                function cb(i) {
                    page.run(i, null, function() {i < page.data.res.length && cb(i+1)})
                }
                cb(0)
                break
            case "并行":
                for (var i = 0; i < page.data.res.length; i++) {page.run(i)}
                break
        }
    },
    refresh: function() {var page = this, data = []; page.data.his = {}
        app.data[page.data.river+page.data.storm] = page.data.res = data
        app.request("action", {cmds: [page.data.river, page.data.storm]}, function(msg) {
            msg.Table(function(line, index) {
                line.feature = JSON.parse(line.feature)
                line.inputs = JSON.parse(line.inputs)
                if (!line.inputs || line.inputs.length === 0) {
                    line.inputs = [{_input: "text"}, {_input: "button", value: "执行"}]
                }
                data.push(line), line.inputs.forEach(function(input) {
                    input._input == "button" && input.action == "auto" && page.run(index)
                })
            })
            page.setData({res: data})
        })
    },

    onBlur: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs[data.index].value = event.detail.value
    },
    onFocus: function(event) {},
    onInput: function(event) {},
    onEnter: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs[data.index].value = event.detail.value
    },
    onfigure: {
        key: {
            click: function(event, page, data, cmd, field) {
                page.run(data.order, ["action", "input", data.item.name, data.item.value], function(msg) {
                    console.log("onkey-----", page.data.res[data.order])
                })
            },
        },
        location: {
            click: function(event, page, data, cmd, field) {
                wx.chooseLocation({success: function(res) {
                    field.inputs[data.index].value = res.name
                    page.setData({res: page.data.res})
                    page.run(data.order, ["action", "location", res.name, res.address, res.latitude*100000, res.longitude*100000])
                }})
            },
        }
    },
    onClick: function(event) {var page = this, data = event.target.dataset
        var field = page.data.res[data.order]
        if (data && data.item && data.item._input == "text") {
            var figure = page.onfigure[data.item.cb||data.item.figure||data.item.name]
            figure && figure.click(event, page, data, "what", field)
            return
        }
        switch (data.input.cb) {
            case "Last":
                break
                var his = page.data.his[data.order] || []
                his.pop()
                var arg = his.pop()
                if (arg) {
                    field.inputs.forEach(function(input, i) {
                        if (input._input == "text") {
                            input.value = arg[i] || ""
                        }
                    })
                }
                page.data.his[data.order] = his
            default:
                this.run(event.target.dataset.order)
        }
    },
    onWhich: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs.forEach(function(input) {
            if (input.name == data.field) {
                input.value = data.value
                page.setData({res: page.data.res})
                page.data.inputs[data.order] = page.data.res[data.order].inputs

                if (input.action == "auto") {
                    page.run(data.order, null, function(msg) {
                        console.log("onwhich-----", page.data.res[data.order])

                    })
                }
            }
        })
    },

    onLoad: function (options) {var page = this
        console.log("page", "action", options)
        app.conf.sessid = app.conf.sessid || options.sessid
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
