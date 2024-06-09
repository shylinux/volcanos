const {
	kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto-wx.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) {
		msg.Echo("hello world")
	},
})
Volcanos(chat.ONACTION, {
	list: ["刷新", "扫码", "清屏", "登录"],
})
Volcanos._init()
