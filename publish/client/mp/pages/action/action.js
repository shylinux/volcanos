const kit = require("../../utils/kit.js")
const app = getApp()

Page({
    name: "action",
    data: {
        river: "", storm: "", title: "",
        action: ["刷新", "扫码", "清屏", "串行", "并行"],
        list: [], back: [],
    },
    action: {
        "刷新": function(event, page) { var list = []
            app.data[page.data.river+page.data.storm] = page.data.list = list, page.data.back = []
            app.requests("action", {cmds: [page.data.river, page.data.storm]}, function(msg) {
                msg.Table(function(line, index) {
                    list.push(line), page.data.back.push([])
                    line.feature = kit.parseJSON(line.meta, {})
                    line.inputs = kit.parseJSON(line.list,[])
                    line.name = line.name.split(" ")[0]

                    if (!line.inputs || line.inputs.length === 0) {
                        line.inputs = [{_input: "text"}, {_input: "button", value: "执行"}]
                    }

                    line.inputs.forEach(function(input) { input.action = input.action || input.value
                        input.value = kit.Value(line, "feature.trans."+input.name) || input.value
                        input.value == "auto" && (input.value = "")

                        if (input.value && input.value.indexOf("@") == 0) {
                            input.action = input.value.slice(1), input.value = ""
                        }
                        if (input._input == "select") {
                            input.values = input.values || kit.Split(input.value)
                        }

                        input._input == "button" && input.action == "auto" && kit.Timer(100, function() { page.run(event, index) })
                    })
                }), page.setData({list: list})
            })
        },
        "扫码": function(event, page) {
            app.scans(function(res) {
                switch (res.type) {
                    case "button": res.name && page.onaction(event, res); break
                    default: return false
                } return true
            }) 
        },
        "清屏": function(event, page) {
            kit.List(page.data.list, function(item) { delete(item.msg) })
            page.setData({list: page.data.list})
        },
        "串行": function(event, page) {
            function cb(i) {
                page.run(event, i, null, function() { i < page.data.list.length - 1 && cb(i+1) })
            }; cb(0)
        },
        "并行": function(event, page) {
            kit.List(page.data.list, function(item, index) { page.run(event, index) })
        },
    },
    onaction: function(event, data) { data = data || event.target.dataset
        console.log("action", this.name, data.name)
        this.action[data.name](event, this)
    },
    run: function(event, order, cmd, cb) { var page = this, field = page.data.list[order]
        var cmds = [page.data.river, page.data.storm, field.id||field.key]; if (!cmd) {
            var cmd = kit.List(field.inputs, function(input) { if (input._input != "button") { return input.value } })
            page.data.back[order].push(cmd)
        }; cmds = cmds.concat(cmd)

        for (var i = cmds.length-1; i > 0; i--) { if (cmds[i] === "") { cmds.pop() } else { break } }

        var option = event._option||{}; option.cmds = cmds
        app.requests("action?="+field.name, option, function(msg) {
            field.msg = msg, page.setData({list: page.data.list})
            typeof cb == "function" && cb(msg)
        })
    },
    plugin: {
        scanQRCode: function(event, order, page, cmd) { app.scans(function(res) {
            page.run(event, order, kit.Simple("action", cmd, res), function(msg) {
                app.toast("添加成功"), page.run(event, order)
            })
            return true
        }) },
        getClipboardData: function(event, order, page, cmd) { app.clipboard(function(res) {
            page.run(event, order, kit.Simple("action", cmd, res), function() {
                app.toast("添加成功"), page.run(event, order)
            })
        }) },
        getLocation: function(event, order, page, cmd) { app.location({success: function(res) {
            res.latitude = parseInt(res.latitude * 100000)
            res.longitude = parseInt(res.longitude * 100000)
            page.run(event, order, kit.Simple("action", cmd, res), function() {
                app.toast("添加成功"), page.run(event, order)
            })
        }}) },
    },

    onInput: function(event) { var page = this, data = event.target.dataset
        page.data.list[data.order].inputs[data.index].value = event.detail.value
    },
    onChange: function(event) { var page = this, data = event.target.dataset
        var input = page.data.list[data.order].inputs[data.index]
        input.value = input.values[parseInt(event.detail.value)]
    },
    onClick: function(event) { var page = this, data = event.target.dataset
        var field = page.data.list[data.order]
        var input = field.inputs[data.index]

        if (field.feature[input.name]) {
            app.data.insert = {field: field, input: input, cb: function(res) {
                page.run(event, data.order, kit.Simple("action", input.name, res))
            }}
            app.jumps("insert/insert", {river: page.data.river, storm: page.data.storm, title: field.name})
            return
        }

        switch (input.name) {
            case "返回": // 恢复命令
                page.data.back[data.order].pop(); var line = page.data.back[data.order].pop()
                kit.List(field.inputs, function(input, index) {
                    if (input._input != "button") { input.value = line&&line[index] || "" }
                })
            case "查看": // 执行命令
                page.run(event, data.order)
                break
            default:
                var cb = page.plugin[input.name]; if (typeof cb == "function") {
                    cb(event, data.order, page, input.name)
                } else {
                    var arg = kit.List(field.inputs, function(input) { if (input._input != "button") { return input.value } })
                    page.run(event, data.order, ["action", input.name].concat(arg))
                }
        }
    },
    onWhich: function(event) { var page = this, data = event.currentTarget.dataset
        var field = page.data.list[data.order]; if (!field) { return }

        var input = data.input && data.input[0]; if (input && input.type == "button") { var option = {}
            kit.List(field.inputs, function(input) { input._input != "button" && (option[input.name] = input.value) })
            if (field.msg.append[0] == "key" && field.msg.append[1] == "value") {
                kit.List(field.msg.key, function(key, index) { option[key] = field.msg.value[index] })
            } else {
                kit.List(field.msg.append, function(key) { option[key] = field.msg[key][data.index] })
            }
            event._option = option

            var cb = page.plugin[input.name]
            return typeof cb == "function"? cb(event, page, data, input):
                page.run(event, data.order, ["action", input.name])
        }

        field.inputs.forEach(function(inputs, index) {
            if (inputs.name == data.key) { inputs.value = data.value
                page.setData({list: page.data.list})
                inputs.action == "auto" && page.run(event, data.order)
            }
        })
    },

    onLoad: function (options) {
        console.log("page", "action", options)
        this.data.river = options.river
        this.data.storm = options.storm
        this.data.title = options.title
        app.title(options.title)

        var data = app.data[options.river+options.storm]
        if (data) { return this.setData({list: this.data.list = data}) }
        this.onaction({}, {name: "刷新"})
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onPullDownRefresh: function () { this.onaction({}, {name: "刷新"}) },
    onShareAppMessage: function (res) {
        return { title: this.data.title,
            path: "pages/action/action?river="+this.data.river+"&storm="+this.data.storm+"&title="+this.data.title,
        }
    },
})
