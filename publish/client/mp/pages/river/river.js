const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONACTION, {list: ["刷新", "扫码", "登录"], _apis: nfs.CHAT_RIVER,
	refresh: function(event, can) { can.run(event, [], function(msg) { msg.Dump(can), can.user.toast(can, "加载成功") }) },
	ondetail: function(event, can, button, data) { var index = data.index
		var item = can.ui.data.list[index]; item._show = !item._show
		if (item.list) { return can.page.setData(can) }
		can.run(event, [item.hash, chat.STORM], function(msg) { item.list = msg.Table(), can.page.setData(can) })
	},
	onchange: function(event, can, button, data) { var index = data.index, i = data.i
		var river = can.ui.data.list[index], storm = river.list[i]
		can.user.jumps(can.base.MergeURL(chat.PAGES_ACTION, {river: river.hash, storm: storm.hash, serve: can.db.serve, space: can.db.space}))
	},
})
Volcanos._init()
