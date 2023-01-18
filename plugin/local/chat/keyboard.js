Volcanos(chat.ONIMPORT, {_init: function(can, msg) { can.onmotion.clear(can)
		var data = msg.TableDetail(), list = can.base.Obj(data.list), meta = can.base.Obj(data.meta)
		var ui = can.page.Append(can, can._output, ["global", "option", "legend"]); can.user.trans(can, meta._trans)
		can.onimport._input(can, [
			{type: html.BUTTON, name: "清屏", cmds: "onmotion.clearFloat"},
			{type: html.TEXT},
			{type: html.BUTTON, name: "下一个", cmds: ["ctrl", "next"]},
			{type: html.BUTTON, name: "上一个", cmds: ["ctrl", "prev"]},
			{type: html.BUTTON, name: "确定", cmds: ["ctrl", "ok"]},
		], data, ui.global)
		can.onimport._input(can, list, data, ui.option), can.onimport._input(can, can.sup.onaction.list, data, ui.legend)
	},
	_input: function(can, item, data, target) { item = can.base.isObject(item)? item: {type: html.BUTTON, name: item}
		if (can.base.isArray(item)) { return can.page.Append(can, target, [{view: "space"}]), can.core.List(item, function(item) { can.onimport._input(can, item, data, target) }) }
		item._init = item._init||function(target) { switch (target.type) {
			case html.TEXT: target.onkeydown = function(event) { can.misc.Event(event, can, function(msg) { if (event.key == lang.ENTER) {
					can.runAction(can.request(event, data), web.SPACE, [ctx.ACTION, item.name, target.value], function() {})
				} })}; break
			case html.BUTTON: target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					can.runAction(can.request(event, data), web.SPACE, [ctx.ACTION].concat(item.cmds||item.name), function() {})
				})}; break
		} }, can.onappend.input(can, item, "", target)
	},
}, [""])
