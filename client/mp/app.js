App({
    conf: {serve: "https://shylinux.com/chat/mp"},
    request(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.request({method: "POST", url: app.conf.serve+"/"+cmd, data: data, success(res) {var msg = res.data
            msg.__proto__ = {
                Result() {return msg.result && msg.result.length > 0 && msg.result.join("") || ""},
            }
            typeof cb == "function" && cb(msg)
        }})
    },
    download(cmd, data, cb) {var app = this; data.sessid = app.conf.sessid
        wx.downloadFile({url: app.conf.serve+"/"+cmd, data: data, success(res) {
            typeof cb == "function" && cb(res)
        }})
    },
    toast(title) {wx.showToast({title: title})},
    onLaunch() {var app = this
        wx.login({success(res) {app.request("login", {code: res.code}, function(msg) {app.conf.sessid = msg.Result()
            wx.getSetting({success(res) {res.authSetting['scope.userInfo'] && wx.getUserInfo({success(res) {
                app.request("login", res.userInfo, function(msg) {app.conf.userInfo = res.userInfo})
            }})}})
        })}})
    },
})
