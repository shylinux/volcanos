const {shy, Volcanos} = require("../../utils/proto.js")
const {html} = require("../../utils/const.js")
Volcanos._page = {}
Volcanos("onimport", {
	_init: function(can, msg) { can.db.list = []
		msg.Table(function(value, index) { can.db.list.push(value)
			value.feature = can.base.Obj(value.meta, {})
			value.inputs = can.base.Obj(value.list, [])
			value.name = can.core.Split(value.name)[0]
			if (!value.inputs || value.inputs.length === 0) {
				value.inputs = [{type: html.TEXT}, {type: html.BUTTON, value: "执行"}]
			}
			can.core.List(value.inputs, function(input) {
				input.action = input.action || input.value
				input.value = can.core.Value(value, "feature._trans."+input.name) || input.value
				input.value == "auto" && (input.value = "")
				if (input.value && input.value.indexOf("@") == 0) {
					input.action = input.value.slice(1), input.value = ""
				}
				if (input.type == "select") {
					input.values = input.values || can.core.Split(input.value)
				}
				input.type == "button" && input.action == "auto" && can.core.Timer(100, function() {
					can.run({}, [can.db.river, can.db.storm, value.id||value.index], function(msg) {
						value.msg = msg, can.page.setData(can, can.db.list)
					})
				})
			})
		}), can.page.setData(can, can.db.list)
	},
})
Volcanos("onaction", {list: ["刷新", "扫码", "清屏"],
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	"清屏": function(event, can) {
		can.core.List(can.db.list, function(item) { delete(item.msg) })
		can.page.setData(can, can.db.list)
	},
	refresh: function(event, can) {
		can.run(event, [can.db.river, can.db.storm], function(msg) {
			can.onimport._init(can, msg)
		})
	},
	onaction: function(event, can, msg) { var name = msg.Option("name")
		(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
	},
	onInputs: function(event, can, msg) { var order = msg.Option("order")||0, index = msg.Option("index")||0
		var input = can.ui.data.list[order||0].inputs[index||0]
		input.value = event.detail.value
	},
	onChange: function(event, can, msg) { var order = msg.Option("order")||0, index = msg.Option("index")||0
		var input = can.ui.data.list[order||0].inputs[index||0]
		input.value = input.values[parseInt(event.detail.value)]
	},
	onAction: function(event, can, msg) { var order = msg.Option("order")||0, name = msg.Option("name")
		var field = can.ui.data.list[order||0]
		if (field.feature[name]) {
			can.data.insert = {field: field, name: name, list: field.feature[name], cb: function(res) {
				can.run(event, can.base.Simple([can.db.river, can.db.storm, field.id||field.index, ctx.ACTION, name], res), function(msg) {
					can.onaction.onAction(event, can, order)
				})
			}}
			can.user.jumps("/pages/insert/insert", {river: can.db.river, storm: can.db.storm, index: field.id||field.index, title: field.name})
			return
		}
		field._history = field._history||[]
		switch (name) {
			case "back":
				var ls = field._history.pop()
				var ls = field._history.pop()||[]
				var i = 0
				can.core.List(field.inputs, function(input, index) {
					if (input.type != html.BUTTON) {
						input.value = ls[i++]||""
					}
				})
				can.page.setData(can)
				can.onaction.onAction(event, can, order, "list")
				break
			case "run":
			case "list":
			case "refresh":
				break
			default:
				return
		}
		var cmds = [can.db.river, can.db.storm, field.id||field.index]
		var cmd = can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { return input.value } })
		function eq(to, from) { if (!to) { return false }
			if (to.length != from.length) { return false }
			for (var i = 0; i < to.length; i++) {
				if (to[i] != from[i]) { return false }
			} return true
		} eq(field._history[field._history.length-1], cmd) || field._history.push(cmd)
		cmds = cmds.concat(cmd)
		for (var i = cmds.length-1; i > 0; i--) { if (cmds[i] === "") { cmds.pop() } else { break } }
		can.run(event, cmds, function(msg) { field.msg = msg, can.page.setData(can) })
	},
	onDetail: function(event, can, msg) { var order = msg.Option("order")||0, name = msg.Option("name"), value = msg.Option("value")
		var field = can.ui.data.list[order||0]
		can.core.List(field.inputs, function(input) {
			if (input.name == name) {
				input.value = value, can.page.setData(can)
				can.onaction.onAction(event, can, order, "list")
			}
		})
	},
})
Volcanos._init()
