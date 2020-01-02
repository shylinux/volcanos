App({
    conf: {serve: "https://shylinux.com/chat/mp"},
    request(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success: function(res) {var msg = res.data
            msg.__proto__ = {
                Result: function() {return msg.result && msg.result.length > 0 && msg.result.join("") || ""},
            }
            typeof cb == "function" && cb(msg)
        }})
    },
    onLaunch: function () {var app = this
        wx.login({success: function(res) {app.request("login", {code: res.code}, function(msg) {app.conf.sessid = msg.Result()
            wx.getSetting({success: function(res) {res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
                app.request("login", res.userInfo, function(msg) {app.conf.userInfo = res.userInfo})
            }})}})
        })}})
    },
})
