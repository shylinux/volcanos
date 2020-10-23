const kit = require("utils/kit.js")

App({
    // data: {}, conf: {serve: "https://shylinux.com/chat", space: "mac"},
    data: {}, conf: {serve: "https://shylinux.com/chat", space: ""},
    request: function(cmd, data, cb) { var app = this; data.sessid = app.conf.sessid, data.pod = app.conf.space
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success: function(res) { var msg = res.data
            if (res.statusCode == 401) { return app.usercode(function() {app.request(cmd, data, cb)}) }
            console.log("POST", cmd, msg)

            msg.__proto__ = {
                nRow: function() { return msg.append && msg.append[0] && msg[msg.append[0]].length || 0 },
                Result: function() { return msg.result && msg.result.length > 0 && msg.result.join("") || "" },
                Table: function(cb) { var row = 0
                    for (var i = 0; i < msg.append.length; i++) {
                        row = msg[msg.append[i]].length > row? msg[msg.append[i]].length: row
                    }
                    for (var i = 0; i < row; i++) { var line = {}
                        for (var k in msg.append) {
                            line[msg.append[k]] = msg[msg.append[k]][i]
                        }
                        typeof cb == "function" && cb(line, i, row)
                    }
                },
            }
            var row = 0
            var index = []
            if (msg.append) {
                for (var i = 0; i < msg.append.length; i++) {
                    row = msg[msg.append[i]].length > row? msg[msg.append[i]].length: row
                }
                for (var i = 0; i < row; i++) {
                    index.push(i)
                }
            }
            msg._index = index

            typeof cb == "function" && cb(msg)
        }})
    },
    download: function(cmd, data, cb) { var app = this; data.sessid = app.conf.sessid
        wx.downloadFile({url: app.conf.serve+"/"+cmd, data: data, success: cb})
    },
    usercode: function(cb) { var app = this
        wx.login({success: function(res) { app.request("mp/login/sess", {code: res.code}, function(msg) {
            wx.setStorage({key: "sessid", data: msg.Result()})
            app.conf.sessid = msg.Result(), typeof cb == "function" && cb()
        })}})
    },
    userinfo: function(cb) { var app = this
        if (app.conf.userInfo) {
            app.request("mp/login/user", app.conf.userInfo, function(msg) {
                typeof cb == "function" && cb(app.conf.userInfo)
            })
            return
        }
        app.usercode(function() {
            wx.getSetting({ success: function(res) { res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
                app.request("mp/login/user", res.userInfo, function(msg) { app.conf.userInfo = res.userInfo
                    typeof cb == "function" && cb(res.userInfo)
                })
            }})}})
        })
    },
    location: function(arg) { wx.chooseLocation(arg) },

    title: function(title) { wx.setNavigationBarTitle({title: title, success: function() {}})},
    modal: function(title, content, cb) { wx.showModal({title: title||"", content: content||"", success: cb})},
    toast: function(title, content) { wx.showToast({title: title, content: content||""})},
    jumps: function(url, args, cb) { var next = "/pages/"+kit.Args(url, args)
        console.log("jump", next), wx.navigateTo({url: next, success: cb})
    },
    scans: function(cb) { var app = this
        wx.scanCode({success: function(res) { console.log("scan", res)
            try {
                var value = JSON.parse(res.result)
            } catch(e) {
                try {
                    var value = {"type": "url", "text": res.result}
                    var ls = res.result.split("?"); if (ls.length > 1) { ls = ls[1].split("&")
                        for (var i = 0; i < ls.length; i++) { var vs = ls[i].split("=")
                            value[vs[0]] = decodeURIComponent(vs[1])
                        }
                    }
                } catch(e) {
                    typeof cb == "function" && cb({type: "", text: res.result})
                    return
                }
            }

            switch (value.type) {
                case "share":
                    switch (value.name) {
                        case "invite":
                            app.userinfo(function(userInfo) {
                                app.modal("接受邀请", value.name, function(res) {
                                    res.confirm && app.request("mp/login/auth", value, function(msg) {
                                        app.toast("回执成功")
                                    })
                                })
                            })
                            break
                    }
                    break

                case "login":
                    app.userinfo(function(userInfo) {
                        app.modal("授权登录", value.name, function(res) {
                            res.confirm && app.request("mp/login/auth", value, function(msg) {
                                app.toast("授权成功")
                            })
                        })
                    })
                    break
                case "active":
                    app.userinfo(function(userInfo) {
                        app.modal("授权登录", value.name, function(res) {
                            res.confirm && app.request("mp/login/auth", value, function(msg) {
                                app.toast("授权成功")
                            })
                        })
                    })
                    break
                default:
                    typeof cb == "function" && cb(value)
            }
        }})
    },

    onLaunch: function() {
        this.conf.sessid = wx.getStorageSync("sessid")
        console.log("load", "sessid", this.conf.sessid)
    },
})
