const {shy, Volcanos} = require("../../utils/proto.js")
const {ice, chat, html} = require("../../utils/const.js")
Volcanos._page = {}
Volcanos("onimport", {
	_init: function(can, msg) { msg.Dump(can) },
})
Volcanos("onaction", {list: ["刷新", "扫码", "登录"],
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	"登录": function(event, can) {
		can.user.info = {}, can.misc.localStorage(can, ice.MSG_SESSID, can.conf.sessid = "")
		can.user.userinfo(can, function() { can.onaction.refresh(event, can) })
	},
	refresh: function(event, can) { can.run(event, [], function(msg) { can.onimport._init(can, msg) }) },
	onaction: function(event, can, msg) { var name = msg.Option("name")
		(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
	},
	ondetail: function(event, can, msg) { var index = msg.Option("index")||"0"
		var item = can.ui.data.list[index]; item._show = !item._show
		if (item.list) { return can.page.setData(can) }
		can.run(event, [item.hash, chat.STORM], function(msg) {
			item.list = msg.Table(), can.page.setData(can)
		})
	},
	onchange: function(event, can, msg) { var index = msg.Option("index")||0, i = msg.Option("i")||0
		var river = can.ui.data.list[index], storm = river.list[i]
		can.user.jumps(can.base.MergeURL("/pages/action/action", {river: river.hash, storm: storm.hash, title: river.name+"."+storm.name}))
	},
	_name: "river/",
})
Volcanos._init()
