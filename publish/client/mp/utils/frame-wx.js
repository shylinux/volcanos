const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html,
} = require("const.js")
const {shy, Volcanos} = require("proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) {
		can.page.setData(can, can.misc.table(can, msg))
	},
})
Volcanos(chat.ONACTION, {list: ["刷新", "扫码"],
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	refresh: function(event, can) {
		can.run(event, [], function(msg) { can.onimport._init(can, msg) })
	},
	onButton: function(event, can, button, data) { var name = data.name;
		(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
	},
})
module.exports = Volcanos._page
