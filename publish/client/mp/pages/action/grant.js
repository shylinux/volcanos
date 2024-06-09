const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) {
		can.page.setData(can, msg.TableDetail())
	},
})
Volcanos(chat.ONACTION, {
	refresh: function(event, can) {
		can.run(event, [can.db.space], function(msg) {
			can.onimport._init(can, msg)
		})
	},
	onConfirm: function(event, can) {
		can.run(can.request(event, {space: can.db.space}), [ctx.ACTION, "confirm"], function(msg) {
			can.user.switchTab(can, web.DREAM)
		})
	},
})
Volcanos._init()
