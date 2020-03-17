const kit = require("utils/kit.js")

App({
    data: {}, conf: {serve: "https://shylinux.com/chat"},
    request: function(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success(res) {var msg = res.data
            console.log("POST", cmd, msg)
            if (res.statusCode == 401) {
                app.usercode(function() {app.request(cmd, data, cb)})
                return
            }
            msg.__proto__ = {
                nRow: function() {return msg.append && msg.append[0] && msg[msg.append[0]].length || 0},
                Result: function() {return msg.result && msg.result.length > 0 && msg.result.join("") || ""},
                Table: function(cb) {var row = 0
                    for (var i = 0; i < msg.append.length; i++) {
                        row = msg[msg.append[i]].length > row? msg[msg.append[i]].length: row
                    }
                    for (var i = 0; i < row; i++) {
                        var line = {}
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
    download: function(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.downloadFile({url: app.conf.serve+"/"+cmd, data: data, success: cb})
    },
    usercode: function(cb) {var app = this
        wx.login({success: function(res) {app.request("mp/login/code", {code: res.code}, function(msg) {
            wx.setStorage({key: "sessid", data: msg.Result()})
            app.conf.sessid = msg.Result(), typeof cb == "function" && cb()
        })}})
    },
    userinfo: function(cb) {var app = this
        if (app.conf.userInfo) {return typeof cb == "function" && cb(app.conf.userInfo)}
        app.usercode(function() {
            wx.getSetting({success: function(res) {res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
                app.request("mp/login/info", res.userInfo, function(msg) {app.conf.userInfo = res.userInfo
                    typeof cb == "function" && cb(res.userInfo)
                })
            }})}})
        })
    },

    modal: function(title, cb) {wx.showModal({title: title, success: cb})},
    toast: function(title) {wx.showToast({title: title})},
    jumps: function(url, args, cb) {var next = "/pages/"+kit.Args(url, args)
        console.log("jump", next), wx.navigateTo({url: next, success: cb})
    },
    scans: function(cb) {var app = this
        wx.scanCode({success(res) {console.log("scan", res)
            try {
                var value = JSON.parse(res.result)
                switch (value.type) {
                    case "active":
                        app.userinfo(function(userInfo) {
                            app.modal("授权登录", function(res) {
                                res.confirm && app.request("mp/login/auth", {auth: value.name}, function(msg) {
                                    app.toast("授权成功")
                                })
                            })
                        })
                    default:
                        typeof cb == "function" && cb(value)
                }
            } catch(e) {
                typeof cb == "function" && cb({type: "", text: res.result})
            }
        }})
    },

    onLaunch: function() {
        this.conf.sessid = wx.getStorageSync("sessid")
        console.log("load", "sessid", this.conf.sessid)
    },
})
