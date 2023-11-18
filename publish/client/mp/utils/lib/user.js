const {ice, mdb, nfs, code, http} = require("../const.js")
const {Volcanos} = require("../proto.js")
module.exports =
Volcanos("user", {
	agent: {
		getLocation: function(can, cb) {
			wx.chooseLocation({success: function(res) {
				cb && cb({
					latitude: parseInt(res.latitude * 100000),
					longitude: parseInt(res.longitude * 100000),
					type: "gcj02", name: res.name, text: res.address,
				})
			}})
		},
		getClipboard: function(can, cb) {
			wx.getClipboardData({success: function(res) {
				cb && cb(can.base.ParseJSON(res.data))
			}})
		},
		scanQRCode: function(can, cb) {
			wx.scanCode({success: function(res) { var data = can.base.ParseJSON(res.result)
				if (cb && cb(data)) { return }
				switch (data.type) {
					case "auth":
						can.user.userinfo(can, function() {
							can.user.modal(can, "授权登录", data.name, function(res) {
								res.confirm && can.misc.request(can, can.request(), "/chat/wx/login/action/scan", data, function(msg) {
									can.user.toast(can, "授权成功")
								})
							})
						})
						break
					default: can.misc.request(can, can.request(), "/chat/wx/login/action/scan", data)
				}
			}})
		},
	}, info: {},
	jumps: function(url, cb) {
		wx.navigateTo({url: url, success: cb})
	},
	title: function(text, cb) {
		text && wx.setNavigationBarTitle({title: text, success: cb})
	},
	toast: function(can, content, title) {
		wx.showToast({title: title, content: content||""})
	},
	modal: function(can, content, title, cb) {
		wx.showModal({title: title||"", content: content||"", success: cb})
	},
	login: function(can, cb) {
		can.conf.sessid = can.conf.sessid||can.misc.localStorage(can, ice.MSG_SESSID)
		if (can.conf.sessid) { return cb && cb() }
		wx.login({success: function(res) { can.misc.request(can, can.request(), "/chat/wx/login/action/sess", {code: res.code}, function(msg) {
			wx.setStorage({key: ice.MSG_SESSID, data: can.conf.sessid = msg.Result()}), cb && cb()
		}) }})
	},
	userinfo: function(can, cb) {
		can.user.info.userNick? can.misc.request(can, can.request(), "/chat/wx/login/action/user", {}, function(msg) {
			cb && cb(can.user.info)
		}): can.user.login(can, function() { wx.getSetting({success: function(res) {
			res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
				can.misc.request(can, can.request(), "/chat/wx/login/action/user", can.user.info = res.userInfo, function(msg) {
					cb && cb(can.user.info)
				})
			}})
		}}) })
	},
})
