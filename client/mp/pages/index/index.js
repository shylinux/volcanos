const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        qrcode: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onscan: function(event) {var page = this
        wx.scanCode({success: function(res) {
            app.request("login", {scan: res.result, type: res.scanType})
            page.setData({qrcode: res.result})
        }})
    },
    onLoad: function () {},
})
