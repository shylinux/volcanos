(function() { var NTIP = "ntip", NCMD = "ncmd", NLOG = "nlog"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.ui = {}, can.db = {}
		can.onimport._title(can, msg, target), can.onimport._state(can, msg, target), can.onimport._toast(can, msg, target), can.onimport._command(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(can.Conf(chat.TITLE)||msg.result, function(item) {
		can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}])
	}) },
	_state: function(can, msg, target) { can.user.isMobile || can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [NTIP, NCMD, NLOG]).reverse(), function(item) {
		can.page.Append(can, target, [{view: [chat.STATE, html.DIV, can.Conf(item)], list: [
			{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
		], onclick: function(event) { can.onexport[item](can) }}])
	}) },
	_toast: function(can, msg, target) { can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) { can.onexport[NTIP](can) }}])._target },
	_command: function(can, msg, target) { can.onappend.input(can, {type: html.TEXT, name: ice.CMD, onkeydown: function(event) { can.onkeymap.input(event, can)
		function close() { can.ui.cli && can.ui.cli.close() } if (event.key == lang.ESCAPE) { return close() } if (event.key != lang.ENTER) { return }
		switch (event.target.value) {
		case cli.CLEAR:
		case cli.CLOSE: close(); break
		default: close(); var list = can.core.Split(event.target.value, ice.SP)
			can.onexport._float(can, "cli", list[0], list.slice(1), function(sub) { can.ui.cli.close = function() { can.page.Remove(can, sub._target), delete(can.ui.cli) }
 				can.getActionSize(function(left) { can.page.style(can, sub._target, html.LEFT, left, html.RIGHT, "") })
			})
		}
	}}, "", target, [chat.TITLE]) },
	_data: function(can, name, item) { can[name] = can[name]||can.request(), can[name].Push(item), can.onimport.count(can, name) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	toast: function(can, msg, title, content, fileline, time) { can.onimport._data(can, NTIP, {time: time, fileline: fileline, title: title, content: content}), can.page.Modify(can, can.toast, [time, title, content].join(ice.SP)) },
	ncmd: function(can, msg, _follow, _cmds) { can.onimport._data(can, NCMD, {time: can.base.Time(), follow: _follow, cmds: _cmds}), can.onimport.nlog(can, NLOG) },
	nlog: function(can, name) { can.onimport.count(can, name) },
})
Volcanos(chat.ONACTION, {_init: function(can) { can.user.isExtension || can.onmotion.hidden(can) },
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onlayout: function(can, layout) { can.onmotion.toggle(can, can._target, !layout || layout == html.TABS) },
	onaction_cmd: function(can) { can.onappend.style(can, html.HIDE) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	ntip: function(can) { can.onexport._float(can, NTIP, "can.toast") },
	ncmd: function(can) { can.onexport._float(can, NCMD, "can.debug", [chat.ONREMOTE]) },
	nlog: function(can) { can.onexport._float(can, NLOG, "can.debug") },
	_float: function(can, name, index, args, cb) { can.ui[name]? (can.ui[name].onaction.close(), delete(can.ui[name])): can.onappend._float(can, index, args||[], function(sub) { can.ui[name] = sub
		can.page.style(can, sub._target, {left: "", top: "", right: 0, bottom: can.onexport.height(can)}), can.base.isFunc(cb) && cb(sub)
	}) },
})
Volcanos(chat.ONPLUGIN, {
	alert: shy("提示", [wiki.CONTENT], function(can, arg) { arg.length > 0 && can.user.alert(arg[0]) }),
	toast: shy("提示", {
		inputs: shy(function(can, sup, msg, arg) { var list = {}; can.core.List(sup[NTIP][arg[0]], function(item) {
			if (!can.base.contains(item, arg[1]) || list[item]) { return } list[item] = true; msg.Push(arg[0], item)
		}) }),
		create: shy([wiki.CONTENT, wiki.TITLE], function(can, content, title) { can.user.toast(can, content, title) }),
	}, [html.FILTER, ice.LIST, mdb.CREATE], function(can, msg) { msg.Copy(can[NTIP]), msg.StatusTimeCount() }),
	debug: shy("网页日志", {
		"prune": shy("清空", function(can) { while(can.misc._list.pop()) {} can.onmotion.clear(can) }),
		"w3schools": shy("教程", function(can) { can.user.open("https://www.w3schools.com/colors/colors_names.asp") }),
		"mozilla": shy("文档", function(can) { can.user.open("https://developer.mozilla.org/en-US/") }),
		"w3": shy("标准", function(can) { can.user.open("https://www.w3.org/TR/?tag=css") }),
	}, ["type:select=log,info,warn,error,debug,wss,onremote", "filter", "list", "prune", "w3schools", "mozilla", "w3"], function(can, msg, arg, cb) { var _can = can, can = msg._can
		var stat = {}; var ui = can.page.Appends(can, can._output, [{type: html.TABLE, className: html.CONTENT, list: [{type: html.TR, list: [
			{type: html.TH, inner: mdb.TEXT},
		]}].concat(can.core.List(can.misc._list, function(list) { stat[list[2]] = ((stat[list[2]]||0)+1); return (!arg || !arg[0] || arg[0] == "log" || arg[0] == list[2]) && {type: html.TR, list: [
			{type: html.TD, list: can.core.List(list, function(item, index) { var vimer
				if (index == 1) { var _ls = /(https*:\/\/[^/]+)\/*([^:]+):([0-9]+):([0-9]+)/.exec(list[1])
					return {view: [html.ITEM, html.SPAN], list: [{text: ice.SP+can.page.unicode.close+ice.SP}, {text: [(_ls[1] == location.origin? _ls[2].split("?")[0]+ice.DF+_ls[3]: item).split("?")[0], html.SPAN, nfs.PATH], onclick: function(event) {
						if (can.onexport.record(can, list[1], mdb.LINK, {time: list[0], link: list[1], type: list[2], path: ice.USR_VOLCANOS, file: _ls[2].split("?")[0], line: _ls[3]})) { return }
						if (vimer) { return can.page.Remove(can, vimer._target), vimer = null }
						vimer = can.onappend.plugin(_can, {index: web.CODE_INNER, args: [ice.USR_VOLCANOS, _ls[2], _ls[3]]}, function(sub) {}, event.target.parentNode)
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
		].concat(can.core.List([chat.ONREMOTE, html.WSS, log.INFO, log.WARN, log.ERROR], function(item) { return {name: item, value: stat[item]||"0"} })))
	}),
	data: shy("网页数据", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can
		arg[0]? can.page.AppendData(can, can._output, arg[0], arg[0].split(ice.PT).pop(), can.core.Value(can._root, arg[0]), function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click():
			can.page.AppendData(can, can._output, "", can._root._name, can._root, function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click()
	}),
	view: shy("网页元素", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can
		if (arg[0]) { can.page.Append(can, can._output, [can.page.AppendView(can, can.page.SelectOne(can, document.body, arg[0]||document.body)]) } else {
			var ui = can.page.Append(can, can._output, [can.page.AppendView(can, document, "html", [
				can.page.AppendView(can, document.head, "head"), can.page.AppendView(can, document.body, "body", null, false, function(target) {
					var list = []; for (var p = target; p && p.tagName && p != document.body; p = p.parentNode) {
						list.push(p.tagName.toLowerCase()+(p.className? ice.PT+p.className.replaceAll(ice.SP, ice.PT).replace(".picker", ""): ""))
					} can.Option(mdb.KEY, list.reverse().join(ice.GT))
				}),
			], true)]); can.onmotion.delay(can, function() { can.page.Select(can, ui._target, "div.item.head,div.item.body", function(target) { target.click() }) })
		}
	}),
})
})()
