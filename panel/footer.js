Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._toast(can, msg, target)
		can.onimport._command(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(msg.result, function(item) { can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}]) }) },
	_state: function(can, msg, target) {
		can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), ["ntip", "ncmd"]).reverse(), function(item) {
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, can.Conf(item)], list: [
				{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
			], onclick: function(event) { can.onexport[item](can) }}])
		})
	},
	_toast: function(can, msg, target) { can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) { can.onexport["ntip"](can) }}])._target },
	_command: function(can, msg, target) { can.onappend.input(can, {type: html.TEXT, name: ice.CMD, onkeydown: function(event) { can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return } switch (event.target.value) {
		case cli.CLOSE: can.cli && can.cli.close(); break
		case cli.CLEAR: can.cli && can.cli.close(); break
		default:
			can.runAction(event, ice.RUN, can.core.Split(event.target.value, ice.SP), function(msg) { can.cli && can.cli.close(); var ui = can.onexport.float(can, msg, "cli")
				can.getActionSize(function(left, top, height, width) { can.page.style(can, ui._target, html.LEFT, left, html.RIGHT, "", html.BOTTOM, can.onexport.height(can)) })
			})
	} }}, "", target, [chat.TITLE, ice.CMD]) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	toast: function(can, msg, title, content, fileline, time) { can._tips = can._tips||can.request(), can._tips.Push({time: time, fileline: fileline, title: title, content: content}), can.onimport.count(can, "ntip"), can.page.Modify(can, can.toast, [time, title, content].join(ice.SP)) },
	ncmd: function(can, msg, _follow, _cmds) { can._cmds = can._cmds||can.request(), can._cmds.Push({time: can.base.Time(), follow: _follow, cmds: _cmds}), can.onimport.count(can, "ncmd") },
})
Volcanos(chat.ONACTION, {_init: function(can) { if (can.user.isExtension || can.user.mod.isPod) { can.onmotion.hidden(can) } },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	float: function(can, msg, name, cb) { if (can[name]) { return can[name].close() } var ui = can.onappend.field(can, "story toast float", {}, can._root._target); can[name] = ui
		ui.close = function() { can.page.Remove(can, ui._target), delete(can[name]) }, ui.refresh = function() { ui.close(), can.toast.click() }
		can.getActionSize(function(left, top, height, width) { can.page.style(can, ui._target, html.RIGHT, 0, html.BOTTOM, can.onexport.height(can))
			can.page.style(can, ui.output, html.MAX_HEIGHT, height-html.ACTION_HEIGHT, html.MAX_WIDTH, width)
		})
		can.onappend._action(can, [cli.CLOSE, web.REFRESH, {input: html.TEXT, placeholder: "filter", onkeydown: function(event) { can.onkeymap.input(event, can)
			event.key == lang.ENTER && (can.onmotion.tableFilter(can, ui.output, event.target.value), can.onmotion.focus(can, event.target))
		}}], ui.action, ui)
		can.onappend.table(can, msg, function(value, key, index, line, list) {
			return {text: [value, html.TD], onclick: function(event) { can.base.isFunc(cb) && cb(value, key, index, line, list) }}
		}, ui.output), can.onappend.board(can, msg.Result(), ui.output); return ui
	},
	ntip: function(can) { can.onexport.float(can, can._tips, "ntip", function(value, key, index, line) { can.onappend._float(can, web.CODE_INNER, [ice.USR_VOLCANOS].concat(line.fileline.split(ice.DF))) }) },
	ncmd: function(can) { can.onexport.float(can, can._cmds, "ncmd", function(value, key, index, line) {
		var cmds = can.base.Obj(line.cmds); switch (line.follow) {
			case "can.Action": cmds = cmds.slice(2); break
			case "can.Footer": cmds = cmds.slice(2); break
		}
		switch (cmds[0]) {
			case web.WIKI_WORD: cmds = cmds.slice(5); break
		}
		can.onappend._float(can, cmds[0], cmds.slice(1))
	}) },
})
