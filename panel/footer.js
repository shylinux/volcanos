(function() { var NTIP = "ntip", NLOG = "nlog", NCMD = "ncmd", NKEY = "nkey"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.Conf(NKEY, can.core.Item(can.misc.localStorage(can)).length)
		can.ondaemon._init(can); if (can.user.mod.isCmd) { return }
		can.onimport._title(can, msg, target), can.onimport._command(can, msg, target)
		can.onimport._state(can, msg, target), can.onimport._toast(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(can.Conf(chat.TITLE)||msg.result, function(item) {
		if (can.base.contains(item, ice.AT)) { item = '<a href="mailto:'+item+'">'+item+'</a>' }
		can.page.Append(can, target, [{view: [[html.ITEM, chat.TITLE], "", item], title: "联系站长"}])
	}) },
	_state: function(can, msg, target) { can.user.isMobile || can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [NTIP, NLOG, NCMD, NKEY]).reverse(), function(item) {
		can.page.Append(can, target, [{view: [[html.ITEM, chat.STATE]], list: [
			{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", "", item]},
		], onclick: function(event) { can.onexport[item](can) }}])
	}) },
	_toast: function(can, msg, target) { can.ui.toast = can.page.Append(can, target, [{view: [[html.ITEM, chat.TOAST]], onclick: function(event) { can.onexport[NTIP](can) }}])._target },
	_command: function(can, msg, target) { can.onappend.input(can, {type: html.TEXT, name: ice.CMD, onkeydown: function(event) { can.onkeymap.input(event, can)
		function close() { can.ui.cli && can.ui.cli.onaction.close() } if (event.key == lang.ESCAPE) { return close() } if (event.key != lang.ENTER) { return }
		close(); switch (event.target.value) {
		case cli.CLEAR:
		case cli.CLOSE: break
		default: var list = can.core.Split(event.target.value, ice.SP)
			can.onexport._float(can, "cli", list[0], list.slice(1), function(sub) { can.getActionSize(function(left) { can.page.style(can, sub._target, html.LEFT, left+10, html.RIGHT, "") }) })
		}
	}}, "", target, [chat.TITLE]) },
	_data: function(can, name, item) { can.db[name] = can.db[name]||can.request(), can.db[name].Push(item), can.onimport.count(can, name) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	ntip: function(can, msg, time, title, content) { can.onimport._data(can, NTIP, {time: time, fileline: can.base.trimPrefix(msg.Option("log.caller"), location.origin+ice.PS), title: title, content: content}), can.page.Modify(can, can.ui.toast, [time, title, content].join(ice.SP)) },
	ncmd: function(can, msg, _follow, _cmds) { can.onimport._data(can, NCMD, {time: can.base.Time(), follow: _follow, cmds: _cmds}), can.onimport.nlog(can, NLOG) },
	nlog: function(can, name) { can.onimport.count(can, name) },
})
Volcanos(chat.ONACTION, {_init: function(can) { can.ui = {}, can.db = {} },
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.ntip, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onlayout: function(can, layout) { can.onmotion.toggle(can, can._target, !layout || layout == html.TABS) },
	onaction_cmd: function(can) { can.onappend.style(can, html.HIDE) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },

	ondebugs: function(can, msg) { can.runAction({}, msg.Option(ctx.ACTION), [msg.Option(ctx.INDEX)], function(_msg) {
		_msg.Table(function(item) { item.mode = chat.FLOAT
			can.onappend.plugin(can, item, function(sub) {
				sub.run = function(event, cmds, cb) { can.run(event, [ctx.ACTION, msg.Option(ctx.ACTION), ice.RUN].concat(cmds), cb) }
				can.getActionSize(function(left, top, width, height) { sub.onimport.size(sub, sub.ConfHeight(height/2), sub.ConfWidth(width), true)
					can.onmotion.move(can, sub._target, {left: left||0, top: (top||0)+height/4})
				}), sub.onaction.close = function() { can.page.Remove(can, sub._target) }
			}, document.body)
		})
	}) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	ntip: function(can) { can.onexport._float(can, NTIP, "can.toast") },
	nlog: function(can) { can.onexport._float(can, NLOG, "can.debug") },
	ncmd: function(can) { can.onexport._float(can, NCMD, "can.debug", [chat.ONREMOTE]) },
	nkey: function(can) { can.onexport._float(can, NLOG, "can.localStorage") },
	_float: function(can, name, index, args, cb) { can.ui[name]? can.ui[name].onaction.close(): can.onappend._float(can, index, args||[], function(sub) { can.ui[name] = sub
		can.page.style(can, sub._target, {left: "", top: "", right: 0, bottom: can.onexport.height(can)}), can.base.isFunc(cb) && cb(sub)
		can.onmotion.delay(can, function() { sub.onaction.close = function() { can.page.Remove(can, sub._target), delete(can.ui[name]) } })
	}) },
})
Volcanos(chat.ONPLUGIN, {
	toast: shy("提示", {
		inputs: shy(function(can, sup, msg, arg) { var list = {}; can.core.List(sup.db[NTIP][arg[0]], function(item) {
			if (!can.base.contains(item, arg[1]) || list[item]) { return } list[item] = true; msg.Push(arg[0], item)
		}) }),
		create: shy([wiki.CONTENT, wiki.TITLE], function(can, content, title) { can.user.toast(can, content, title) }),
	}, [html.FILTER, ice.LIST, mdb.CREATE], function(can, msg) { msg.Copy(can.db[NTIP]), msg.StatusTimeCount() }),
	debug: shy("网页日志", {
		"prune": shy("清空", function(can) { while(can.misc._list.pop()) {} can.onmotion.clear(can) }),
		"w3schools": shy("教程", function(can) { can.user.open("https://www.w3schools.com/colors/colors_names.asp") }),
		"mozilla": shy("文档", function(can) { can.user.open("https://developer.mozilla.org/en-US/") }),
		"w3": shy("标准", function(can) { can.user.open("https://www.w3.org/TR/?tag=css") }),
	}, ["type:select=error,log,info,warn,error,debug,onremote,wss", web.FILTER, ice.LIST, "prune", "w3schools", "mozilla", "w3"], function(can, msg, arg, cb) { var _can = can, can = msg._can
		var stat = {}; var ui = can.page.Appends(can, can._output, [{view: [html.CONTENT, html.TABLE], list: [{type: html.TR, list: [
			{text: [mdb.TEXT, html.TH]},
		]}].concat(can.core.List(can.misc._list, function(list) { stat[list[2]] = ((stat[list[2]]||0)+1); return (!arg || !arg[0] || arg[0] == "log" || arg[0] == list[2]) && {type: html.TR, list: [
			{type: html.TD, list: can.core.List(list, function(item, index) { var vimer
				if (index == 1) { var _ls = /(https*:\/\/[^/]+)\/*([^:]+):([0-9]+):([0-9]+)/.exec(list[1]); _ls[2] = _ls[2].split(ice.QS)[0]
					return {view: [html.ITEM, html.SPAN], list: [{text: ice.SP+can.page.unicode.close+ice.SP}, {text: [(_ls[1] == location.origin? "": _ls[1])+_ls[2]+ice.DF+_ls[3], "", nfs.PATH], onclick: function(event) {
						if (can.onexport.record(can, list[1], mdb.LINK, {time: list[0], link: list[1], type: list[2], path: ice.USR_VOLCANOS, file: _ls[2], line: _ls[3]})) { return }
						if (vimer) { return can.page.Remove(can, vimer._target), vimer = null }
						vimer = can.onappend.plugin(_can, {index: web.CODE_INNER, args: [ice.USR_VOLCANOS, _ls[2], _ls[3]]}, function(sub) {}, event.target.parentNode)
					}}]}
				} if (!can.base.isObject(item)) { return item && {text: (index > 0? ice.SP: "")+item} }
				return {view: [mdb.DATA, html.SPAN], _init: function(target) {
					if (item.tagName) { var detail; var ui = can.page.Append(can, target, [{text: ice.SP},
						{text: can.page.unicode.close+ice.SP, _init: function(target) { can.onmotion.delay(can, function() { ui.toggle = target }) }},
						{view: [[html.ITEM, nfs.TARGET], html.SPAN, can.page.tagClass(item)], onclick: function() {
							if (detail) { return can.page.Remove(can, detail), detail = null, can.page.Modify(can, ui.toggle, can.page.unicode.close+ice.SP) }
							detail = can.page.AppendData(can, target, "", "", item)._target, detail.click(), can.page.Modify(can, ui.toggle, can.page.unicode.open+ice.SP)
						}},
					]) } else { can.page.Append(can, target, [{text: ice.SP}]), can.page.AppendData(can, target, "", "", item) }
				}}
			})},
		]} })) }]); arg && arg[1] && can.page.Select(can, can._output, html.TR, function(tr) { can.page.ClassList.set(can, tr, html.HIDE, tr.innerText.indexOf(arg[1]) == -1) })
		can.onappend._status(can, [
			{name: mdb.TIME, value: can.base.Time()}, {name: mdb.COUNT, value: can.page.Select(can, can._output, html.TR+html.NOT_HIDE).length+"x1"},
		].concat(can.core.List([log.INFO, log.WARN, log.ERROR, chat.ONREMOTE, html.WSS], function(item) { return {name: item, value: stat[item]||"0"} })))
	}),
	data: shy("网页数据", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can
		arg[0]? can.page.AppendData(can, can._output, arg[0], arg[0].split(ice.PT).pop(), can.core.Value(can._root, arg[0]), function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click():
			can.page.AppendData(can, can._output, "", can._root._name, can._root, function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click()
	}),
	view: shy("网页元素", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can
		if (arg[0]) { can.page.Append(can, can._output, [can.page.AppendView(can, can.page.SelectOne(can, document.body, arg[0]||document.body))]) } else {
			var ui = can.page.Append(can, can._output, [can.page.AppendView(can, document, "html", [
				can.page.AppendView(can, document.head, html.HEAD), can.page.AppendView(can, document.body, html.BODY, null, false, function(target) {
					var list = []; for (var p = target; p && p.tagName && p != document.body; p = p.parentNode) {
						list.push(p.tagName.toLowerCase()+(p.className? ice.PT+p.className.replaceAll(ice.SP, ice.PT).replace(".picker", ""): ""))
					} can.Option(mdb.KEY, list.reverse().join(ice.GT))
				}),
			], true)]); can.onmotion.delay(can, function() { can.page.Select(can, ui._target, "div.item.head,div.item.body", function(target) { target.click() }) })
		}
	}),
})
})()
