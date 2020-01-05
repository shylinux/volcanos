const utils = require("utils/util.js")

App({
    data: {},
    conf: {serve: "https://shylinux.com/chat"},
    request: function(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success(res) {var msg = res.data
            console.log(msg)
            if (res.statusCode == 401) {
                app.usercode(function() {app.request(cmd, data, cb)})
                return
            }
            msg.__proto__ = {
                nRow() {return msg.append && msg.append[0] && msg[msg.append[0]].length || 0},
                Result() {return msg.result && msg.result.length > 0 && msg.result.join("") || ""},
                Table(cb) {var row = 0
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
            typeof cb == "function" && cb(msg)
        }})
    },
    download: function(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.downloadFile({url: app.conf.serve+"/"+cmd, data: data, success(res) {
            typeof cb == "function" && cb(res)
        }})
    },
    usercode: function(cb) {var app = this
        wx.login({success(res) {app.request("mp/login/code", {code: res.code}, function(msg) {
            wx.setStorage({key: "sessid", data: msg.Result()})
            app.conf.sessid = msg.Result(), typeof cb == "function" && cb()
        })}})
    },
    userinfo: function(cb) {var app = this
        if (app.conf.userInfo) {return typeof cb == "function" && cb(app.conf.userInfo)}
        app.usercode(function() {
            wx.getSetting({success(res) {res.authSetting['scope.userInfo'] && wx.getUserInfo({success(res) {
                app.request("mp/login/info", res.userInfo, function(msg) {app.conf.userInfo = res.userInfo, typeof cb == "function" && cb(res.userInfo)})
            }})}})
        })
    },
    jumps: function(url, args, cb) {
        wx.navigateTo({url: "/pages/"+utils.Args(url, args), success: cb})
    },
    toast: function(title) {wx.showToast({title: title})},
    onLaunch: function() {
        this.conf.sessid = wx.getStorageSync("sessid")
    },
})
