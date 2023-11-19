const {ice, ctx, mdb, chat, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto.js")
Volcanos._page = {}
Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.ui.data.list = []
		msg.Table(function(value, index) { can.ui.data.list.push(value)
			value.feature = can.base.Obj(value.meta, {})
			value.inputs = can.base.Obj(value.list, [])
			value.name = can.core.Split(value.name)[0]
			if (!value.inputs || value.inputs.length === 0) {
				value.inputs = [{type: html.TEXT}, {type: html.BUTTON, name: ctx.RUN}]
			}
			can.core.List(value.inputs, function(input) {
				input.action = input.action || input.value
				input.value == ice.AUTO && (input.value = "")
				if (input.value && input.value.indexOf("@") == 0) {
					input.action = input.value.slice(1), input.value = ""
				}
				if (input.type == html.SELECT) {
					input.values = input.values || can.core.Split(input.value)
				}
				if (input.type == html.TEXT) {
					input.placeholder = can.user.trans(can, input.placeholder||input.name, can.core.Value(value, "feature._trans"), html.INPUT)
				}
				if (input.type == html.BUTTON) {
					input.value = can.user.trans(can, input.value||input.name, can.core.Value(value, "feature._trans"))
				}
				input.type == html.BUTTON && input.action == ice.AUTO && can.core.Timer(100, function() {
					can.onaction.onAction({}, can, ice.LIST, {order: index, name: ice.LIST})
				})
			})
		}), can.page.setData(can), can.user.toast(can, "加载成功")
	},
})
Volcanos(chat.ONACTION, {list: ["刷新", "扫码", "清屏"],
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	"清屏": function(event, can) { can.core.List(can.ui.data.list, function(item) { delete(item.msg) }), can.page.setData(can) },
	refresh: function(event, can) {
		if (can.db.cmd||can.db.index) { can.onaction._cmds = []
			can.run(event, [ctx.ACTION, ctx.COMMAND, can.db.cmd||can.db.index], function(msg) {
				can.onaction._cmds = [ctx.ACTION, ctx.RUN], can.onimport._init(can, msg)
			})
		} else {
			can.onaction._cmds = [can.db.river, can.db.storm]
			can.run(event, [], function(msg) { can.onimport._init(can, msg) })
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
		can.onaction.onAction({}, can, ice.LIST, {order: index, name: ice.LIST})
	},
	onAction: function(event, can, button, data) { var order = data.order, name = data.name
		var field = can.ui.data.list[order||0]
		if (field.feature[name]) {
			can.data.insert = {field: field, name: name, list: field.feature[name], cb: function(res) {
				can.run(event, can.base.Simple([field.id||field.index, ctx.ACTION, name], res), function(msg) {
					can.onaction.onAction(event, can, ice.LIST, {order: order, name: ice.LIST})
				})
			}}
			can.user.jumps(chat.PAGES_INSERT, {river: can.db.river, storm: can.db.storm, index: field.id||field.index, serve: can.db.serve, space: can.db.space})
			return
		}
		field._history = field._history||[]
		switch (name) {
			case ice.BACK: field._history.pop()
				var ls = field._history.pop()||[], i = 0
				can.core.List(field.inputs, function(input, index) { if (input.type != html.BUTTON) { input.value = ls[i++]||"" } })
				can.page.setData(can), can.onaction.onAction(event, can, ice.LIST, {order: order, name: ice.LIST})
				break
			case ctx.RUN:
			case ice.LIST:
			case "refresh": break
			default: return
		}
		var cmd = can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { return input.value } })
		for (var i = cmd.length-1; i > 0; i--) { if (cmd[i] === "") { cmd.pop() } else { break } }
		function eq(to, from) { if (!to) { return false }
			if (to.length != from.length) { return false }
			for (var i = 0; i < to.length; i++) { if (to[i] != from[i]) { return false } }
			return true
		} eq(field._history[field._history.length-1], cmd) || field._history.push(cmd)
		can.run(event, [field.id||field.index].concat(cmd), function(msg) {
			msg._head = can.core.List(msg.append, function(item) {
				return can.user.trans(can, item, can.core.Value(field, "feature._trans"), html.INPUT)
			})
			can.core.Item(msg._view, function(key, value) { can.core.List(value, function(value, index) { can.core.List(value, function(input, i) {
				if (input.type == html.BUTTON) {
					input.value = can.user.trans(can, input.value||input.name, can.core.Value(field, "feature._trans"))
				}
				if (input._type == html.TEXT) {
					input._text = can.user.trans(can, input._text, can.core.Value(field, "feature._trans"), html.VALUE)
				}
			}) }) })
			field.msg = msg, can.page.setData(can)
		})
	},
	onDetail: function(event, can, button, data) { var order = data.order, name = data.name, value = data.value, input = data.input
		var field = can.ui.data.list[order||0]
		if (input && input.type == html.BUTTON) { can.request(event, field.msg.Table()[data.index])
			if (field.feature[input.name]) {
				can.onAction(event, can, input.name, {order: order, name: input.name})
			} else {
				can.run(event, [field.id||field.index, ctx.ACTION, input.name], function(msg) {
					// value.msg = msg, can.page.setData(can)
				})
			} return
		}
		can.core.List(field.inputs, function(input) {
			if (input.name == name) { input.value = value, can.page.setData(can)
				can.onaction.onAction(event, can, ice.LIST, {order: order, name: ice.LIST})
			}
		})
	},
})
Volcanos._init()
