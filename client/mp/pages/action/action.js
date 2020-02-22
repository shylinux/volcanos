const utils = require("../../utils/util.js")
const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码", "清屏", "刷新", "串行", "并行", "共享"],
        res: [], his: {}, inputs: {},
        river: "", storm: "",
    },
    action: {
        "扫码": function(event, page, data, name) {
            // app.jumps("scans/scans")
            app.scans(function(res) {
                page.onaction(event, res, res.name)
            })
        },
        "刷新": function(event, page, data, name) {
            var list = []; app.data[page.data.river+page.data.storm] = page.data.res = list
            app.request("action", {cmds: [page.data.river, page.data.storm]}, function(msg) {
                msg.Table(function(line, index) {
                    page.data.his[index] = []
                    line.inputs = JSON.parse(line.inputs)
                    line.feature = JSON.parse(line.feature)
                    if (!line.inputs || line.inputs.length === 0) {
                        line.inputs = [{_input: "text"}, {_input: "button", value: "执行"}]
                    }
                    list.push(line), line.inputs.forEach(function(input) {
                        input._input == "button" && input.action == "auto" && page.run(event, index)
                    })
                })
                page.setData({res: list})
            })
        },
        "串行": function(event, page, data, name) {
            function cb(i) {
                page.run(event, i, null, function() {i < page.data.res.length - 1&& cb(i+1)})
            }
            cb(0)
        },
        "并行": function(event, page, data, name) {
            kit.List(page.data.res, function(field, index) {
                page.run(event, index)
            })
        },
        "清屏": function(event, page, data, name) {
            kit.List(page.data.res, function(field, index) {
                delete(field.msg)
            })
            page.setData({res: page.data.res})
        },
        "共享": function(event, page, data, name) {
        },
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "river", name)
        this.action[name](event, this, data)
    },
    onfigure: {
        key: {click: function(event, page, data, cmd, field) {
            page.run(event, data.order, ["action", "input", data.item.name, data.item.value])
        }},
        location: {click: function(event, page, data, cmd, field) {
            wx.chooseLocation({success: function(res) {
                field.inputs[data.index].value = res.name
                page.setData({res: page.data.res})
                page.run(event, data.order, ["action", "location", res.name, res.address, res.latitude*100000, res.longitude*100000])
            }})
        }}
    },

    run: function(event, order, cmd, cb) {var page = this, field = page.data.res[order]
        var cmds = [page.data.river, page.data.storm, order]
        cmds = cmds.concat(cmd||kit.List(field.inputs, function(input) {
            if (["text", "textarea", "select"].indexOf(input._input) > -1) {
                return input.value || ""
            }
        }))

        for (var i = cmds.length-1; i > 0; i--) {
            if (cmds[i] === "") {cmds.pop()} else {break}
        }

        app.request("action", {cmds: cmds}, function(msg) {
            page.data.res[order].msg = msg
            page.setData({res: page.data.res})
            typeof cb == "function" && cb(msg)
        })
    },

    onBlur: function(event) {var page = this, data = event.target.dataset
    },
    onFocus: function(event) {},
    onInput: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs[data.index].value = event.detail.value
        page.setData({res: page.data.res})
    },
    onChange: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs[data.index].index = parseInt(event.detail.value)
        page.data.res[data.order].inputs[data.index].value = data.input.values[parseInt(event.detail.value)]
        page.setData({res: page.data.res})
    },
    onEnter: function(event) {var page = this, data = event.target.dataset
        page.data.res[data.order].inputs[data.index].value = event.detail.value
    },

    onClick: function(event) {var page = this, data = event.target.dataset
        var field = page.data.res[data.order]
        if (data && data.item && data.item._input == "text") {
            // 输入补全
            var figure = page.onfigure[data.item.cb||data.item.figure||data.item.name]
            figure && figure.click(event, page, data, "what", field)
            return
        }

        switch (data.input.cb) {
            case "Last":
                // 恢复命令
                page.data.his[data.order].pop()
                var line = page.data.his[data.order].pop()
                kit.List(field.inputs, function(input, index) {
                    input.value = line && line[index] || ""
                })
            default:
                // 执行命令
                page.data.his[data.order].push(kit.List(field.inputs, function(input) {
                    return input.value
                })) && page.run(event, data.order)
        }
    },
    onWhich: function(event) {var page = this, data = event.target.dataset
        var field = page.data.res[data.order]
        field.inputs.forEach(function(input, index) {
            if (input.name == data.field) {
                // 导入参数
                page.data.res[data.order].inputs[index].value = data.value
                page.setData({res: page.data.res})
                // 执行命令
                input.action == "auto" && page.data.his[data.order].push(kit.List(field.inputs, function(input) {
                    return input.value
                })) && page.run(event, data.order)
            }
        })
    },

    onLoad: function (options) {
        console.log("page", "action", options)
        app.conf.sessid = options.sessid || app.conf.sessid
        this.data.river = options.river
        this.data.storm = options.storm

        var data = app.data[options.river+options.storm]
        if (data) {return this.setData({res: this.data.res = data})}
        this.onaction({}, {}, "刷新")
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
