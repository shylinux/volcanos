const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("../const.js")
const {shy, Volcanos} = require("../proto.js")
module.exports =
Volcanos("page", {
	setData: function(can, list) { can.ui.setData({list: list||can.ui.data.list}) },
})
