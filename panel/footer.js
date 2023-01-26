(function() { var NTIP = "ntip", NCMD = "ncmd", NLOG = "nlog"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._toast(can, msg, target)
		can.onimport._command(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(msg.result, function(item) { can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}]) }) },
	_state: function(can, msg, target) { can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [NTIP, NCMD, NLOG]).reverse(), function(item) {
		can.page.Append(can, target, [{view: [[chat.STATE], html.DIV, can.Conf(item)], list: [
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
	} }}, "", target, [chat.TITLE]) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	toast: function(can, msg, title, content, fileline, time) { can.onimport._data(can, NTIP, {time: time, fileline: fileline, title: title, content: content}), can.page.Modify(can, can.toast, [time, title, content].join(ice.SP)) },
	ncmd: function(can, msg, _follow, _cmds) { can.onimport._data(can, NCMD, {time: can.base.Time(), follow: _follow, cmds: _cmds}), can.onimport.nlog(can, NLOG) },
	nlog: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.misc._list.length }) },
	_data: function(can, name, item) { can[name] = can[name]||can.request(), can[name].Push(item), can.onimport.count(can, name) },
})
Volcanos(chat.ONACTION, {_init: function(can) { if (can.user.isExtension || can.user.mod.isPod) { can.onmotion.hidden(can) } },
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onaction_cmd: function(can) { can.onappend.style(can, can._target, html.HIDE) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	float: function(can, msg, name, cb) { if (!can[name]) { return } if (can[name]._target) { return can[name]._target.close() } var ui = can.onappend.field(can, chat.STORY, {name: name}, can._root._target); can[name]._target = ui
		can.onappend.style(can, html.FLOAT, ui._target)
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
	nlog: function(can) { can.onappend._float(can, "can.debug") },
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
	debug: shy("网页日志", {
		"prune": shy("清空", function(can) { while(can.misc._list.pop()) {} can.onmotion.clear(can) }),
		"w3schools": shy("教程", function(can) { can.user.open("https://www.w3schools.com/colors/colors_names.asp") }),
		"mozilla": shy("文档", function(can) { can.user.open("https://developer.mozilla.org/en-US/") }),
		"w3": shy("标准", function(can) { can.user.open("https://www.w3.org/TR/?tag=css") }),
	}, ["type:select=log,info,warn,error,debug,wss,onremote", "filter", "list", "prune", "w3schools", "mozilla", "w3"], function(can, msg, arg) { can.onmotion.delay(can, function() { var _can = can, can = msg._can
		var stat = {}
		var ui = can.page.Appends(can, can._output, [{type: html.TABLE, className: html.CONTENT, list: [{type: html.TR, list: [
			{type: html.TH, inner: mdb.TEXT},
		]}].concat(can.core.List(can.misc._list, function(list) { stat[list[2]] = ((stat[list[2]]||0)+1); return (!arg || !arg[0] || arg[0] == "log" || arg[0] == list[2]) && {type: html.TR, list: [
			{type: html.TD, list: can.core.List(list.slice(0), function(item, index) { var vimer
				if (index == 1) { var _ls = /(https*:\/\/[^/]+)\/*([^:]+):([0-9]+):([0-9]+)/.exec(list[1])
					return {view: [html.ITEM, html.SPAN], list: [{text: ice.SP+can.page.unicode.close+ice.SP}, {text: [(_ls[1] == location.origin? _ls[2].split("?")[0]+ice.DF+_ls[3]: item).split("?")[0], html.SPAN, nfs.PATH], onclick: function(event) {
						if (can.onexport.record(can, list[1], mdb.LINK, {time: list[0], link: list[1], type: list[2], path: ice.USR_VOLCANOS, file: _ls[2].split("?")[0], line: _ls[3]})) { return }
						if (vimer) { return can.page.Remove(can, vimer._target), vimer = null }
						vimer = can.onappend.plugin(_can, {index: "web.code.inner", args: [ice.USR_VOLCANOS, _ls[2], _ls[3]]}, function(sub) {}, event.target.parentNode)
					}}]}
				} if (!can.base.isObject(item)) { return {text: (index > 0? ice.SP: "")+item} }
				return {view: [mdb.DATA, html.SPAN], _init: function(target) {
					if (item.tagName) { var detail; var ui = can.page.Append(can, target, [{text: ice.SP},
						{text: can.page.unicode.close+ice.SP, _init: function(target) { can.onmotion.delay(can, function() { ui.toggle = target }) }},
						{view: [[html.ITEM, nfs.TARGET], html.SPAN, item.tagName.toLowerCase()+(item.className? ice.PT+item.className.replaceAll(ice.SP, ice.PT): "")], onclick: function() {
							if (detail) { return can.page.Remove(can, detail), detail = null, can.page.Modify(can, ui.toggle, can.page.unicode.close+ice.SP) }
							detail = can.page.AppendData(can, target, "", "", item)._target, detail.click(), can.page.Modify(can, ui.toggle, can.page.unicode.open+ice.SP)
						}},
					]) } else { can.page.Append(can, target, [{text: ice.SP}]), can.page.AppendData(can, target, "", "", item) }
				}}
			})},
		]} })) }]); arg && arg[1] && can.page.Select(can, can._output, html.TR, function(tr) { can.page.ClassList.set(can, tr, html.HIDE, tr.innerText.indexOf(arg[1]) == -1) })
		can.onappend._status(can, [
			{name: mdb.TIME, value: can.base.Time()}, {name: mdb.COUNT, value: can.page.Select(can, can._output, html.TR+html.NOT_HIDE).length+"x1"},
		].concat(can.core.List(["onremote", "wss", "info", "warn", "error"], function(item) { return {name: item, value: stat[item]||"0"} })))
	}) }),
	localStorage: shy("本地存储", [mdb.NAME, mdb.VALUE, ice.LIST, ice.BACK], function(can, msg, arg) {
		if (arg.length == 0) { can.core.Item(localStorage, function(name, value) { if (can.base.isFunc(value) || name == "length") { return }
			msg.Push(mdb.NAME, name).Push(mdb.VALUE, value)
		}); return msg.StatusTimeCount() }
		if (arg.length > 1) { localStorage.setItem(arg[0], arg[1]) } msg.Echo(localStorage.getItem(arg[0]))
	}),
	sessionStorage: shy("会话存储", [mdb.NAME, mdb.VALUE, ice.LIST, ice.BACK], function(can, msg, arg) {
		if (arg.length == 0) { can.core.Item(sessionStorage, function(name, value) { if (can.base.isFunc(value) || name == "length") { return }
			msg.Push(mdb.NAME, name).Push(mdb.VALUE, value)
		}); return msg.StatusTimeCount() }
		if (arg.length > 1) { sessionStorage.setItem(arg[0], arg[1]) } msg.Echo(sessionStorage.getItem(arg[0]))
	}),
	data: shy("网页数据", [mdb.KEY], function(can, msg, arg) { can.onmotion.delay(can, function() { var can = msg._can
		if (can.Option(mdb.KEY)) {
			can.page.AppendData(can, can._output, can.Option(mdb.KEY), can.Option(mdb.KEY).split(ice.PT).pop(), can.core.Value(can._root, can.Option(mdb.KEY)), function(prefix, value) {
				can.Option(mdb.KEY, prefix)
			})._target.click()
		} else {
			can.page.AppendData(can, can._output, "", can._root._name, can._root, function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click()
		}
	}) }),
	view: shy("网页标签", [mdb.KEY], function(can, msg, arg) { can.onmotion.delay(can, function() { var can = msg._can
		if (can.Option(mdb.KEY)) {
			can.page.Append(can, can._output, [can.page.AppendView(can, can.page.SelectOne(can, document.body, can.Option(mdb.KEY))||document.body)])
		} else {
			var ui = can.page.Append(can, can._output, [can.page.AppendView(can, document, "html", [
				can.page.AppendView(can, document.head, "head"), can.page.AppendView(can, document.body, "body", null, false, function(target) {
					var list = []; for (var p = target; p && p.tagName && p != document.body; p = p.parentNode) {
						list.push(p.tagName.toLowerCase()+(p.className? ice.PT+p.className.replaceAll(ice.SP, ice.PT).replace(".picker", ""): ""))
					} can.Option(mdb.KEY, list.reverse().join(ice.SP+ice.GT+ice.SP))
				}),
			], true)])
			can.onmotion.delay(can, function() { can.page.Select(can, ui._target, "div.item.head,div.item.body", function(target) { target.click() }) })
		}
	}) }),
})
})()
