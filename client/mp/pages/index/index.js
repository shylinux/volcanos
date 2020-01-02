const app = getApp()

var utils = require("../../utils/util.js")
Page({
    data: {
        list: [],
    },
    show() {var page = this
        page.setData({list: (wx.getStorageSync("qrcode")||[]).reverse()})
    },
    click(event) {var page = this
        wx.showActionSheet({itemList:["保存"], success(res) {
            wx.saveImageToPhotosAlbum({filePath: event.target.dataset.path, success(res) {
                wx.showToast({title: "success"})
            }})
        }})
        console.log(event)
    },
    onscan(event) {var page = this
        wx.scanCode({success(res) {
            app.download("login?type="+encodeURIComponent(res.scanType)+"&scan="+encodeURIComponent(res.result), {}, function(res) {
                wx.saveFile({tempFilePath: res.tempFilePath, success(res) {
                    var list = wx.getStorageSync("qrcode") || []
                    list.push({path: res.savedFilePath, index: list.length, time: utils.Time()})
                    wx.setStorageSync("qrcode", list)
                    page.show()
                }})
            })
        }})
    },
    onLoad() {this.show()},
})
