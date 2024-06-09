const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can, list) { var _list = []
		can.core.List(list, function(msg) { _list = _list.concat(can.misc.table(can, msg)) }), can.page.setData(can, _list)
	},
})
Volcanos(chat.ONACTION, {list: ["刷新", "扫码"],
	refresh: function(event, can) { can.onaction._cmds = []
		var list = [], _list = can.misc.serveList(can)
		can.core.Next(_list, function(serve, next) { var msg = can.request(); msg._serve = serve.serve, msg._sessid = serve.sessid; var done = false
			can.run(msg._event, [ctx.ACTION, ctx.RUN, web.SPACE, ctx.ACTION, "info"], function(msg) {
				msg.Push("title", serve.serve.split("://")[1]), msg.Push("sessid", serve.sessid)
				msg.Push(ctx.STYLE, msg._serve == can.db.serve? "current": "")
				msg.Push(web.SERVE, msg._serve), list.push(msg), can.onimport._init(can, list), done || next(), done = true
			}), can.onmotion.delay(can, function() { done || next(), done = true }, 3000)
		})
	},
	onSelect: function(event, can, button, data) {
		can.user.switchTab(can, web.DREAM, data.item, true)
	},
})
Volcanos._init()
