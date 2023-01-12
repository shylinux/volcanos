(function() { var NTIP = "ntip", NCMD = "ncmd", NLOG = "nlog"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._toast(can, msg, target)
		can.onimport._command(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(msg.result, function(item) { can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}]) }) },
	_state: function(can, msg, target) { can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [NTIP, NCMD, NLOG]).reverse(), function(item) {
		can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, can.Conf(item)], list: [
			{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
		], onclick: function(event) { can.onexport[item](can) }}])
	}) },
	_toast: function(can, msg, target) { can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) { can.onexport[NTIP](can) }}])._target },
	_command: function(can, msg, target) { can.onappend.input(can, {type: html.TEXT, name: ice.CMD, onkeydown: function(event) { can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return } switch (event.target.value) {
		case cli.CLOSE: can.cli && can.cli.close(); break
		case cli.CLEAR: can.cli && can.cli.close(); break
		default:
 			can.runAction(event, ice.RUN, can.core.Split(event.target.value, ice.SP), function(msg) { can.cli && can.cli.close && can.cli.close(), can["cli"] = {}; var ui = can.onexport.float(can, msg, "cli")
				can.getActionSize(function(left) { can.page.style(can, ui._target, html.LEFT, left+10, html.RIGHT, "", html.BOTTOM, can.onexport.height(can)) })
			})
	} }}, "", target, [chat.TITLE, ice.CMD]) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	toast: function(can, msg, title, content, fileline, time) { can.onimport._data(can, NTIP, {time: time, fileline: fileline, title: title, content: content}), can.page.Modify(can, can.toast, [time, title, content].join(ice.SP)) },
	debug: function(can, msg, _args, fileline, time) { can.onimport._data(can, NLOG, {time: time, fileline: fileline, type: _args[2], content: _args.slice(4).join(ice.SP)}) },
	ncmd: function(can, msg, _follow, _cmds) { can.onimport._data(can, NCMD, {time: can.base.Time(), follow: _follow, cmds: _cmds}) },
	_data: function(can, name, item) { can[name] = can[name]||can.request(), can[name].Push(item), can.onimport.count(can, name) },
})
Volcanos(chat.ONACTION, {_init: function(can) { if (can.user.isExtension || can.user.mod.isPod) { can.onmotion.hidden(can) } },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	ondebug: function(can, msg) { can.core.CallFunc(can.onimport.debug, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	float: function(can, msg, name, cb) { if (!can[name]) { return } if (can[name]._target) { return can[name]._target.close() } var ui = can.onappend.field(can, chat.STORY, {name: name, pos: chat.FLOAT}, can._root._target); can[name]._target = ui
		ui.close = function() { can.page.Remove(can, ui._target), delete(can[name]._target) }, ui.refresh = function() { ui.close(), can.toast.click() }
		can.getActionSize(function(height, width) { can.page.style(can, ui._target, html.RIGHT, 0, html.BOTTOM, can.onexport.height(can))
			can.page.style(can, ui.output, html.MAX_HEIGHT, height-html.ACTION_HEIGHT, html.MAX_WIDTH, width)
		})
		can.onappend._action(can, [cli.CLOSE, web.REFRESH, {input: html.TEXT, placeholder: web.FILTER, onkeydown: function(event) { can.onkeymap.input(event, can)
			event.key == lang.ENTER && (can.onmotion.tableFilter(can, ui.output, event.target.value), can.onmotion.focus(can, event.target))
		}}], ui.action, ui)
		msg && can.onappend.table(can, msg, function(value, key, index, line, list) {
			return {text: [value, html.TD], onclick: function(event) { can.base.isFunc(cb) && cb(value, key, index, line, list) }}
		}, ui.output), msg && can.onappend.board(can, msg.Result(), ui.output); return ui
	},
	ntip: function(can) { can.onexport.float(can, can[NTIP], NTIP, function(value, key, index, line) { can.onappend._float(can, web.CODE_INNER, [ice.USR_VOLCANOS].concat(line.fileline.split(ice.DF))) }) },
	nlog: function(can) { var ui = can.onexport.float(can, can[NLOG], NLOG, function(value, key, index, line) { can.onappend._float(can, web.CODE_INNER, [ice.USR_VOLCANOS].concat(line.fileline.split(ice.DF))) })
		ui && can.page.Select(can, ui.output, [html.TBODY, html.TR], function(tr, i) { can.page.ClassList.add(can, tr, can[NLOG][mdb.TYPE][i]) })
	},
	ncmd: function(can) { can.onexport.float(can, can[NCMD], NCMD, function(value, key, index, line) {
		var cmds = can.base.Obj(line.cmds); switch (line.follow) {
			case "can.Action": cmds = cmds.slice(2); break
			case "can.Search": cmds = cmds.slice(2); break
			case "can.Footer": cmds = cmds.slice(2); break
			default: return
		}
		switch (cmds[0]) {
			case web.WIKI_WORD: cmds = cmds.slice(5); break
		}
		can.onappend._float(can, cmds[0], cmds[1] != ctx.ACTION? cmds.slice(1): [])
	}) },
})
Volcanos(chat.ONPLUGIN, {
	alert: shy("提示", [wiki.CONTENT], function(can, msg, arg) { arg && arg.length > 0 && can.user.alert(arg[0]) }),
	toast: shy("提示", [wiki.CONTENT, wiki.TITLE], function(can, msg, arg) { arg && arg.length > 0 && can.user.toast(can, arg[0], arg[1]), msg.Copy(can[NTIP]), msg.StatusTimeCount() }),
	debug: shy("日志", ["type:select=Info,Warn,Error,Debug", wiki.CONTENT], function(can, msg, arg) { arg && arg.length > 1 && can.misc[arg[0]](can, arg[1]), msg.Copy(can[NLOG]), msg.StatusTimeCount() }),
})
})()
