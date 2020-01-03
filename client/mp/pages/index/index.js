const app = getApp()

var utils = require("../../utils/util.js")
Page({
    data: {
        picture: "",
        content: "",
        comment: "",
        list: [],
    },
    show() {var page = this
        page.setData({list: (wx.getStorageSync("qrcode")||[]).reverse()})
    },
    onScan(event) {var page = this
        wx.scanCode({success(res) {
            page.setData({content: res.result})
            app.download("login?type="+encodeURIComponent(res.scanType)+"&scan="+encodeURIComponent(res.result), {}, function(res) {
                page.setData({picture: res.tempFilePath})
            })
        }})
    },
    onCopy(event) {var page = this
        wx.setClipboardData({data: page.data.content, success(res) {
            app.toast("复制成功")
        }})
    },
    onSave(event) {var page = this
        wx.saveImageToPhotosAlbum({filePath: page.data.picture, success(res) {
            app.toast("保存成功")
        }})
    },
    onList(event) {var page = this
        wx.saveFile({tempFilePath: page.data.picture, success(res) {
            var list = wx.getStorageSync("qrcode") || []
            list.push({time: utils.Time(), index: list.length,
                path: res.savedFilePath, content: page.data.content, comment: page.data.comment,
            })
            wx.setStorageSync("qrcode", list)
            app.toast("保存成功")
            page.show()
        }})
    },
    onClear(event) {var page = this
        var list = wx.getStorageSync("qrcode") || []
        for (var i = 0; i < list.length; i++) {
            wx.removeSavedFile({filePath: list[i].path, success(res) {}})
        }
        wx.setStorageSync("qrcode", [])
        app.toast("删除成功")
        page.show()
    },
    onClick(event) {var page = this, data = event.target.dataset
        wx.showActionSheet({itemList:["显示", "删除", "复制文本", "保存图片"], success(res) {
            switch (res.tapIndex) {
                case 0: page.setData({picture: data.picture, content: data.content, comment: data.comment}); break
                case 1: wx.removeSavedFile({filePath: data.picture, success(res) {app.toast("删除成功")}}); break
                case 1: wx.setClipboardData({data: data.content, success(res) {app.toast("复制成功")}}); break
                case 2: wx.saveImageToPhotosAlbum({filePath: data.picture, success(res) {app.toast("保存成功")}}); break
                case 3:
            }
        }})
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
