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
            app.data[[page.data.river, page.data.storm].join(".")] = page.data.list = list, page.data.back = []
            app.requests(page.name, {cmds: [page.data.river, page.data.storm]}, function(msg) {
                msg.Table(function(line, index) {
                    list.push(line), page.data.back.push([])
                    line.feature = kit.parseJSON(line.meta, {})
                    line.inputs = kit.parseJSON(line.list,[])
                    line.name = line.name.split(" ")[0]

                    if (!line.inputs || line.inputs.length === 0) {
                        line.inputs = [{type: "text"}, {type: "button", value: "执行"}]
                    }

                    line.inputs.forEach(function(input) { input.action = input.action || input.value
                        input.value = kit.Value(line, "feature._trans."+input.name) || input.value
                        input.value == "auto" && (input.value = "")

                        if (input.value && input.value.indexOf("@") == 0) {
                            input.action = input.value.slice(1), input.value = ""
                        }
                        if (input.type == "select") {
                            input.values = input.values || kit.Split(input.value)
                        }

                        input.type == "button" && input.action == "auto" && kit.Timer(100, function() { page.run(event, index) })
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
            var cmd = kit.List(field.inputs, function(input) { if (input.type != "button") { return input.value } })
            kit.EQ(page.data.back[page.data.back.length-1], cmd) || page.data.back[order].push(cmd)
        }; cmds = cmds.concat(cmd)

        for (var i = cmds.length-1; i > 0; i--) { if (cmds[i] === "") { cmds.pop() } else { break } }

        var option = event._option||{}; option.cmds = cmds
        app.requests("action?="+field.name, option, function(msg) {
            field.msg = msg, page.setData({list: page.data.list})
            can.base.isFunc(cb) && cb(msg)
        })
    },
    onInput: function(event) { var page = this, data = event.target.dataset
        var input = page.data.list[data.order].inputs[data.index]
        input.value = event.detail.value
    },
    onChange: function(event) { var page = this, data = event.target.dataset
        var input = page.data.list[data.order].inputs[data.index]
        input.value = input.values[parseInt(event.detail.value)]
    },
    onClick: function(event) { var page = this, data = event.target.dataset
        var field = page.data.list[data.order]; var input = field.inputs[data.index]

        if (field.feature[input.name]) {
            app.data.insert = {field: field, input: input, list: field.feature[input.name], cb: function(res) {
                page.run(event, data.order, kit.Simple("action", input.name, res))
            }}
            app.jumps("insert/insert", {river: page.data.river, storm: page.data.storm, title: field.name})
            return
        }

        switch (input.name) {
            case "back": // 恢复命令
                page.data.back[data.order].pop(); var line = page.data.back[data.order].pop()
                kit.List(field.inputs, function(input, index) {
                    if (input.type != "button") { input.value = line&&line[index] || "" }
                })
            case "run": // 执行命令
            case "刷新": // 执行命令
            case "list": page.run(event, data.order); break
            default:
                var cb = page.plugin[input.name]; typeof cb == "function"? cb(event, page, data.order, input.name):
                    page.run(event, data.order, ["action", input.name].concat(kit.List(field.inputs, function(input) {
                        if (input.type != "button") { return input.value }
                    })))
        }
    },
    onWhich: function(event) { var page = this, data = event.currentTarget.dataset
        var field = page.data.list[data.order]; if (!field) { return }

        var input = data.input; if (input && input.type == "button") { var option = {}
            kit.List(field.inputs, function(input) { input.type != "button" && (option[input.name] = input.value) })
            if (field.msg.append[0] == "key" && field.msg.append[1] == "value") {
                kit.List(field.msg.key, function(key, index) { option[key] = field.msg.value[index] })
            } else {
                kit.List(field.msg.append, function(key) { option[key] = field.msg[key][data.index] })
            }
            event._option = option

            var cb = page.plugin[input.name]; typeof cb == "function"? cb(event, page, data.order, input.name):
                page.run(event, data.order, ["action", input.name])
            return
        }

        field.inputs.forEach(function(input, index) {
            if (input.name == data.key) { input.value = data.value
                page.setData({list: page.data.list})
                input.action == "auto" && page.run(event, data.order)
            }
        })
    },
    plugin: {
        scanQRCode: function(event, page, order, cmd) { app.scans(function(res) {
            page.run(event, order, kit.Simple("action", cmd, res), function(msg) {
                app.toast("添加成功"), page.run(event, order)
            })
            return true
        }) },
        getClipboardData: function(event, page, order, cmd) { app.clipboard(function(res) {
            page.run(event, order, kit.Simple("action", cmd, res), function() {
                app.toast("添加成功"), page.run(event, order)
            })
        }) },
        startLocalServiceDiscovery: function(event, page, order, cmd) {
            wx.onLocalServiceFound(function(res) {
                console.log(res)
            })

            wx.showLoading()
            wx.startLocalServiceDiscovery({
                serviceType: '_http._tcp.',
                success: function(res) {
                    wx.hideLoading()
                    console.log(res)
                },
            })
        },

        getLocation: function(event, page, order, cmd) { app.location(function(res) {
            page.run(event, order, kit.Simple("action", cmd, res), function() {
                app.toast("添加成功"), page.run(event, order)
            })
        }) },
        chooseLocation: function(event, page, order, cmd) {
            wx.chooseLocation({success: function(res) { res.text = res.address, delete(res.address)
                page.run(event, order, kit.Simple("action", cmd, res), function() {
                    app.toast("添加成功"), page.run(event, order)
                })
            }})
        },

        getWifiList: function(event, page, order, cmd) {
            wx.onGetWifiList(function(res) {
                console.log(res)
            })

            wx.getWifiList(function(res) {
                console.log(res)
            })
        },
        openLocation: function(event, page, order, cmd) {
            var list = page.data.list[order].msg.Table()
            var data = list[event.currentTarget.dataset.index]||list[0]
            wx.openLocation({name: data.name, address: data.text, latitude: parseInt(data.latitude)/100000.0, longitude: parseInt(data.longitude)/100000.0})
        },
    },

    onReady: function () {},
    onLoad: function (options) {
        console.log("page", this.name, options)
        this.data.river = options.river
        this.data.storm = options.storm
        this.data.title = options.title
        app.title(options.title)

        var data = app.data[[options.river, options.storm].join(".")]
        data? this.setData({list: this.data.list = data}): this.onaction({}, {name: "刷新"})
    },
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onReachBottom: function () {},
    onPullDownRefresh: function () { this.onaction({}, {name: "刷新"}) },
    onShareAppMessage: function (res) {
        return {title: this.data.title, path: kit.Args("pages/action/action", {
            river: this.data.river, storm: this.data.storm, title: this.data.title,
        })}
    },
})
