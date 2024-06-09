const {kit, ice, ctx, mdb, web, aaa, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can) {
		can.ui.setData({info: can.user.info, action: can.onaction.list})
	},
})
Volcanos(chat.ONACTION, {list: ["扫码", "登录", "清空"],
	"登录": function(event, can) {
		can.onaction.onLogin(event, can)
	},
	"清空": function(event, can) {
		can.misc.serveList(can, "")
	},
	refresh: function(event, can) {
		can.onaction.onLogin(event, can)
	},
	onLogin: function(event, can) {
		can.user.login(can, function() {
			can.misc.POST(can, can.request(), "/chat/header/", {}, function(msg) {
				can.user.info.username = msg.Option(ice.MSG_USERNAME)
				can.user.info.usernick = msg.Option(aaa.USERNICK)
				can.user.info.avatar = msg.Option(aaa.AVATAR)
				can.misc.serveList(can, {serve: can.db.serve, username: msg.Option(ice.MSG_USERNAME), usernick: msg.Option(aaa.USERNICK), avatar: msg.Option(aaa.AVATAR)})
				wx.getUserInfo({success: function(res) { var userInfo = res.userInfo
					can.user.info.avatar = can.user.info.avatar||userInfo.avatarUrl
					can.user.info.gender = userInfo.gender
					can.user.info.city = userInfo.city
					can.user.info.country = userInfo.country
					can.user.info.province = userInfo.province
					can.onimport._init(can), wx.stopPullDownRefresh()
				}})
			})
		})
	},
	onChooseAvatar(event, can, button, data) {
		can.user.info.avatar = event.detail.avatarUrl
		can.onimport._init(can), can.onexport.info(can)
	},
	onBlur: function(event, can) {
		can.user.info.usernick = event.detail.value
		can.onimport._init(can), can.onexport.info(can)
	},
})
Volcanos(chat.ONEXPORT, {
	info: function(can) {
		can.misc.POST(can, can.request(), "/chat/wx/login/action/user", can.user.info, function(msg) {})
	},
})
Volcanos._init()
