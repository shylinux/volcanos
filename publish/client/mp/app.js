const kit = require("utils/kit.js")

App({
    data: {}, conf: {serve: "https://shylinux.com/chat", space: ""},
    requests: function(cmd, data, cb) { wx.showLoading()
        this.request(cmd, data, function(msg) { wx.hideLoading(), typeof cb == "function" && cb(msg) })
    },
    request: function(cmd, data, cb) { var app = this; data.sessid = app.conf.sessid, data.pod = app.conf.space
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success: function(res) { var msg = res.data
            if (res.statusCode == 401) { return app.usercode(function() { app.request(cmd, data, cb) }) }
            console.log("POST", cmd, msg)

            var proto = {
                Result: function() { return msg.result && msg.result.length > 0 && msg.result.join("") || "" },
                Length: function() { var max = 0; if (!msg.append) { return max }
                    for (var i = 0; i < msg.append.length; i++) {
                        var len = msg[msg.append[i]].length; len > max && (max = len)
                    }; return max
                },
                Table: function(cb) { var res = []
                    for (var i = 0; i < msg.Length(); i++) { var line = {}
                        for (var k in msg.append) { line[msg.append[k]] = msg[msg.append[k]][i] }
                        typeof cb == "function" && cb(line, i, msg.Length())
                        res.push(line)
                    }; return res
                },
                Data: function(item, index) {
                    var text = msg[item]&&msg[item][index]||""
                    var data = {_type: "text", _text: text}
                    if (text.indexOf("<") != 0) { return [data] }

                    var res = [], list = kit.Split(text, " ", "<=/>")
                    for (var i = 0; i < list.length; i++) {
                        if (list[i] == "<") { data = {}
                            if (list[i] == "/") { i++ } else { res.push(data) }
                            data._type = list[i+1], data._text = text, i++
                            continue
                        } else if (list[i] == ">") {
                            continue
                        }

                        if (list[i+1] == "=") {
                            data[list[i]] = list[i+2], i += 2
                        } else {
                            data[list[i]] = list[i]
                        }
                    }
                    return res.length == 0? [data]: res
                },
            }; for (var k in proto) { msg[k] = proto[k] }

            msg._index = []; for (var i = 0; i < msg.Length(); i++) { msg._index.push(i) }
            msg._view = {}, msg["append"] && kit.List(msg["append"], function(k) { msg._view[k] = {}
                for (var i in msg[k]) { msg._view[k][i] = msg.Data(k, i) }
            })
            typeof cb == "function" && cb(msg)
        }})
    },
    download: function(cmd, data, cb) { var app = this; data.sessid = app.conf.sessid
        wx.downloadFile({url: app.conf.serve+"/"+cmd, data: data, success: cb})
    },

    usercode: function(cb) { var app = this
        wx.login({success: function(res) { app.request("mp/login/sess", {code: res.code}, function(msg) {
            wx.setStorage({key: "sessid", data: app.conf.sessid = msg.Result()})
            typeof cb == "function" && cb()
        })}})
    },
    userinfo: function(cb) { var app = this
        app.conf.userInfo? app.request("mp/login/user", app.conf.userInfo, function(msg) {
            typeof cb == "function" && cb(app.conf.userInfo)
        }): app.usercode(function() { wx.getSetting({success: function(res) {
            res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
                app.request("mp/login/user", app.conf.userInfo = res.userInfo, function(msg) {
                    typeof cb == "function" && cb(app.conf.userInfo)
                })
            }})
        }}) })
    },

    title: function(title) { wx.setNavigationBarTitle({title: title, success: function() {}})},
    modal: function(title, content, cb) { wx.showModal({title: title||"", content: content||"", success: cb})},
    toast: function(title, content) { wx.showToast({title: title, content: content||""})},
    jumps: function(url, args, cb) { var next = "/pages/"+kit.Args(url, args)
        console.log("jump", next), wx.navigateTo({url: next, success: cb})
    },
    scans: function(cb) { var app = this
        wx.scanCode({success: function(res) { var data = kit.parseJSON(res.result)
            if (typeof cb == "function" && cb(data)) { return }

            switch (data.type) {
                case "auth":
                    app.userinfo(function(userInfo) {
                        app.modal("授权登录", data.name, function(res) {
                            res.confirm && app.request("mp/login/scan", data, function(msg) {
                                app.toast("授权成功")
                            })
                        })
                    })
                    break
                default: app.request("mp/login/scan", data)
            }
        }})
    },
    clipboard: function(cb) { wx.getClipboardData({success: function(res) {
        typeof cb == "function" && cb(kit.parseJSON(res.data))
    }}) },
    location: function(cb) { wx.chooseLocation({success: function(res) {
        typeof cb == "function" && cb({
            name: res.name, text: res.address,
            latitude: parseInt(res.latitude * 100000),
            longitude: parseInt(res.longitude * 100000),
        })
    }}) },

    onLaunch: function() {
        this.conf.sessid = wx.getStorageSync("sessid")
        console.log("load", "sessid", this.conf.sessid)
    },
})
