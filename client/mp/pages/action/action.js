const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    data: {
        action: ["扫码", "刷新", "清屏", "串行", "并行"],
        river: "", storm: "", title: "",
        res: [], his: {}, inputs: {},
    },
    action: {
        "扫码": function(event, page, data, name) {
            // app.jumps("scans/scans")
            app.scans(function(res) {
                res["sess.river"] = page.data.river
                res["sess.storm"] = page.data.storm
                app.request("mp/login/scan", res)
                page.onaction(event, res, res.name)
            })
        },
        "刷新": function(event, page, data, name) {
            var list = []; app.data[page.data.river+page.data.storm] = page.data.res = list
            wx.showLoading()
            app.request("action", {cmds: [page.data.river, page.data.storm]}, function(msg) {
                wx.hideLoading()
                msg.Table(function(line, index) {
                    line.name = line.name.split(" ")[0]
                    page.data.his[index] = []
                    line.inputs = JSON.parse(line.list)
                    line.feature = JSON.parse(line.meta)
                    if (!line.inputs || line.inputs.length === 0) {
                        line.inputs = [{_input: "text"}, {_input: "button", value: "执行"}]
                    }
                    list.push(line), line.inputs.forEach(function(input) {
                        input.action = input.action || input.value
                        input.value == "auto" && (input.value = "")
                        if (input.value && input.value.startsWith("@")) {
                            input.value = ""
                        }
                        if (input._input == "select") {
                            input.values = input.values || input.value && input.value.split("|")
                        }
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
    },
    onaction: function(event, data, name) {
        data = data || event.target.dataset, name = name || data.name
        console.log("action", "action", name)
        this.action[name](event, this, data)
    },

    run: function(event, order, cmd, cb) {var page = this, field = page.data.res[order]
        var cmds = [page.data.river, page.data.storm, field.id || field.key]
        cmds = cmds.concat(cmd||kit.List(field.inputs, function(input) {
            if (["text", "textarea", "select"].indexOf(input._input) > -1) {
                return input.value || ""
            }
        }))

        for (var i = cmds.length-1; i > 0; i--) {
            if (cmds[i] === "") {cmds.pop()} else {break}
        }

        wx.showLoading()
        app.request("action?="+field.name, {cmds: cmds}, function(msg) {
            wx.hideLoading()
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

        if (field.feature[data.input.name]) {
            app.data.insert = {
                field: field, input: data.input,
                data: {}, list: field.feature[data.input.name], cb: function(res) {
                    var list = ["action", data.input.name]
                    kit.Item(res, function(key, value) {
                        key && value && list.push(key, value)
                    })
                    page.run(event, data.order, list)
                }
            }
            app.jumps("insert/insert", {river: page.data.river, storm: page.data.storm, title: field.name})
            return
        }

        switch (data.input.value) {
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
        this.data.title = options.title
        app.title(options.title)

        var data = app.data[options.river+options.storm]
        if (data) { return this.setData({res: this.data.res = data}) }
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
    onShareAppMessage: function (res) {
        console.log("action", "share", res)
        return {
            title: this.data.title,
            path: "pages/action/action?river="+this.data.river+"&storm="+this.data.storm+"&title="+this.data.title,
        }
    },
})
