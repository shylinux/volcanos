const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("const.js")
const {shy, Volcanos} = require("proto.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {})
Volcanos(chat.ONACTION, {
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	"清屏": function(event, can) { can.core.List(can.ui.data.list, function(item) { delete(item.msg) }), can.misc.setData(can) },
	"登录": function(event, can) {
		can.user.info = {}, can.misc.localStorage(can, ice.MSG_SESSID, can.conf.sessid = "")
		can.user.userinfo(can, function() { can.onaction.refresh(event, can) })
	},
	_refresh: function(event, can, order) { can.misc.setData(can)
		can.onaction.onAction({}, can, ice.LIST, {order: order, name: ice.LIST})
	},
	_reload: function(can, msg) {
		can.misc.ParseCmd(can, msg)
	},
	refresh: function(event, can) {
		can.onaction._apis = "", can.onaction._cmds = []
		if (can.db.share) { can.onaction._apis = "/share/"+can.db.share
			can.run(event, [ctx.ACTION, ctx.COMMAND], function(msg) {
				can.onaction._cmds = [ctx.ACTION, ctx.RUN], can.onaction._reload(can, msg)
			})
		} else if (can.db.river && can.db.storm) {
			can.onaction._cmds = [can.db.river, can.db.storm]
			can.run(event, [], function(msg) { can.onaction._reload(can, msg) })
		} else {
			can.run(event, [ctx.ACTION, ctx.COMMAND, can.db.cmd||can.db.index||"cli.qrcode"], function(msg) {
				can.onaction._cmds = [ctx.ACTION, ctx.RUN], can.onaction._reload(can, msg)
			})
		}
	},
	onaction: function(event, can, button, data) { var name = data.name;
		(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
	},
	onInputs: function(event, can, button, data) { var order = data.order, index = data.index
		var input = can.ui.data.list[order||0].inputs[index||0]
		input.value = event.detail.value
	},
	onChange: function(event, can, button, data) { var order = data.order, index = data.index
		var input = can.ui.data.list[order||0].inputs[index||0]
		input.value = input.values[parseInt(event.detail.value)]
		can.onaction._refresh(event, can, order)
	},
	onAction: function(event, can, button, data) { var order = data.order, name = data.name
		var field = can.ui.data.list[order||0], msg = can.request(event)
		if (field.feature[name]) { if (can.base.isIn(name, mdb.CREATE, mdb.INSERT)) { msg._method = http.PUT }
			return can.data.insert = {field: field, name: name, list: field.feature[name], cb: function(res) {
				can.run(event, can.base.Simple([field.id||field.index, ctx.ACTION, name], res), function(msg) {
					can.onaction._refresh(event, can, order)
				})
			}}, can.user.jumps(chat.PAGES_INSERT)
		} field._history = field._history||[]
		switch (name) {
			case ice.BACK: field._history.pop(); var ls = field._history.pop()||[], i = 0
				can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { input.value = ls[i++]||"" } })
				can.onaction._refresh(event, can, order); break
			case ctx.RUN: break
			case ice.LIST:
			case web.REFRESH: msg._method = http.GET; break
			default: msg.Option(ctx.ACTION, name)
		}
		var cmd = can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { return input.value } })
		for (var i = cmd.length-1; i > 0; i--) { if (cmd[i] === "") { cmd.pop() } else { break } }
		function eq(to, from) { if (!to) { return false } if (to.length != from.length) { return false }
			for (var i = 0; i < to.length; i++) { if (to[i] != from[i]) { return false } } return true
		} eq(field._history[field._history.length-1], cmd) || field._history.push(cmd)
		can.run(event, [field.id||field.index].concat(cmd), function(msg) { can.onimport._init && can.onimport._init(can, msg)
			msg._head = can.core.List(msg.append, function(item) { return can.user.trans(can, item, field, html.INPUT) })
			can.core.Item(msg._view, function(key, value) { can.core.List(value, function(value) { can.core.List(value, function(input, i) {
				if (input.type == html.BUTTON) { input.value = can.user.trans(can, input.value||input.name, field) }
				if (input._type == html.TEXT) { input._text = can.user.trans(can, input._text, field, html.VALUE) }
			}) }) })
			msg._status = can.core.List(can.base.Obj(msg.Option(ice.MSG_STATUS)), function(item) { return item })
			msg._action = can.core.List(can.base.Obj(msg.Option(ice.MSG_ACTION)), function(item) {
				if (typeof item == code.STRING) { return {type: html.BUTTON, name: item, value: can.user.trans(can, item)} }
				return item.value = can.user.trans(can, item.value||item.name), item
			}), field.msg = msg, can.misc.setData(can)
		})
	},
	onDetail: function(event, can, button, data) { var order = data.order, name = data.name, value = data.value, input = data.input
		var field = can.ui.data.list[order||0]
		if (input && input.type == html.BUTTON) { var msg = can.request(event, field.msg.Table()[data.index])
			if (can.base.isIn(name, mdb.REMOVE, mdb.DELETE)) { msg._method = http.DELETE }
			var _input = {}; can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { _input[input.name] = input.value } }), can.request(event, _input)
			if (field.feature[input.name]) {
				can.onAction(event, can, input.name, {order: order, name: input.name})
			} else {
				can.run(event, [field.id||field.index, ctx.ACTION, input.name], function(msg) {
					can.onaction._refresh(event, can, order)
				})
			} return
		}
		can.core.List(field.inputs, function(input) {
			if (input.name == name) { input.value = value, can.onaction._refresh(event, can, order) }
		})
	},
})
module.exports = Volcanos._page
