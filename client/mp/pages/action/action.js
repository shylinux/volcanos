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
        location: {click: function(event, page, data, cmd, field) {
            wx.chooseLocation({success: function(res) {
                if (data.input._input != "button") {
                    field.inputs[data.index].value = res.name
                    page.setData({res: page.data.res})
                }
                page.run(event, data.order, ["action", "device", "location", res.name, res.address, "latitude", res.latitude*100000, "longitude", res.longitude*100000])
            }})
        }},
        battery: {click: function(event, page, data, cmd, field) {
            wx.getBatteryInfo({success: function(res) {
                if (data.input._input != "button") {
                    field.inputs[data.index].value = res.level
                    page.setData({res: page.data.res})
                }
                page.run(event, data.order, ["action", "device", "battery", res.level, res.isCharging])
            }})
        }},
        paste: {click: function(event, page, data, cmd, field) {
            wx.getClipboardData({success: function(res) {
                if (data.input._input != "button") {
                    field.inputs[data.index].value = res.data
                    page.setData({res: page.data.res})
                }
                page.run(event, data.order, ["action", "device", "paste", res.data, res.data])
            }})
        }},
        scan: {click: function(event, page, data, cmd, field) {
            app.scans(function(res) {
                if (data.input._input != "button") {
                    field.inputs[data.index].value = res.text || res.name 
                    page.setData({res: page.data.res})
                }
                page.run(event, data.order, ["action", "device", res.type||"spide", res.name||"", res.text||"", JSON.stringify(res.extra||"")])
            })
        }},
        album: {click: function(event, page, data, cmd, field) {
            wx.chooseImage({success: function(res) {
                console.log(res)
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app.conf.serve+"/mp/login/upload",
                    filePath: tempFilePaths[0],
                    name: 'upload', formData: {'user': 'test'},
                    success: function(msg) {
                        console.log(msg)
                        if (data.input._input != "button") {
                            field.inputs[data.index].value = msg.data
                            page.setData({res: page.data.res})
                        }
                    },
                    fail: function(res) {
                        console.log(res)
                    },
                })
            }})
        }},
        finger: {click: function(event, page, data, cmd, field) {
            wx.startSoterAuthentication({
                requestAuthModes: ['fingerPrint'], authContent: '请用指纹解锁',
                challenge: '123456', success(res) {
                    console.log(res)
                    res = JSON.parse(res.resultJSON)
                    if (data.input._input != "button") {
                        field.inputs[data.index].value = res.cpu_id
                        page.setData({res: page.data.res})
                    }
                    page.run(event, data.order, ["action", "device", "finger", res.uid, res.cpu_id, "counter", res.counter, "raw", res.raw])
                }
            })
        }},
        wifi: {click: function(event, page, data, cmd, field) {
            wx.getConnectedWifi({success: function(res) {
                console.log(res)
                if (data.input._input != "button") {
                    field.inputs[data.index].value = res.wifi.SSID
                    page.setData({res: page.data.res})
                }
                page.run(event, data.order, ["action", "device", "wifi", res.wifi.SSID, res.wifi.signalStrength])
            }})
        }},
        wifiConn: {click: function(event, page, data, cmd, field) {
            wx.connectWifi({
                SSID: data.SSID, password: data.password,
                success: function(res) {
                    console.log(res)
                },
                fail: function(res) {
                    console.log(res)
                },
            })
        }},
        vibrate: {click: function(event, page, data, cmd, field) {
            wx.vibrateShort()
        }},
        key: {click: function(event, page, data, cmd, field) {
            page.run(event, data.order, ["action", "input", data.input.name, data.input.value])
        }},
        share: {click: function(event, page, data, cmd, field) {
            wx.showShareMenu({
                  withShareTicket: true
            })
        }},
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
            // 输入补全
        var figure = data && data.input && page.onfigure[data.input.cb||data.input.figure||data.input.name]
        if (figure) {
            return figure.click(event, page, data, data.input.name, field)
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
    onShareAppMessage: function (res) {
        console.log(res)
        return {
            title: "some",
            path: "pages/action/action?river="+this.data.river+"&storm="+this.data.storm,
            success: function(res) {
                console.log(res)
            },
        }
    }
})
