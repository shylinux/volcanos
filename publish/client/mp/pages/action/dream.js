const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONACTION, {
	onSelect: function(event, can, button, data) {
		can.user.switchTab(can, "desktop")
	},
})
Volcanos._init()
