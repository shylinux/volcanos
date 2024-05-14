(function() { var NTIP = "ntip", NLOG = "nlog", NCMD = "ncmd", NKEY = "nkey"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can._wss = can.ondaemon._init(can)
		can.Conf(cli.BEGIN, can.base.Time(null, "%H:%M:%S"))
		if (!can.user.isMobile && !can.misc.isDebug(can)) { can.onmotion.hidden(can); return }
		can.Conf(nfs.VERSION, can.base.trimPrefix(window._version, "?_v=").split("&")[0])
		can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width())
		can.Conf(NKEY, can.core.Item(can.misc.localStorage(can)).length)
		can.onimport._title(can, msg, target), can.onimport._command(can, msg, target), can.onimport._storm(can, msg, target)
		can.misc.isDebug(can) && can.onimport._state(can, msg, target), can.onimport._toast(can, msg, target)
		if (!can.user.isTechOrRoot(can)) { return }
		can.core.List([
			{index: code.XTERM, args: [cli.SH]},
			{index: cli.RUNTIME},
			{index: chat.MESSAGE},
			{index: chat.TUTOR},
		], function(value) { value.type = html.BUTTON, value.name = value.index
			value.onclick = function() { can.onappend._float(can, value.index, value.args) }
			can.onappend.input(can, value, "", can._output)
		})
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(can.Conf(chat.TITLE)||msg.result, function(item) {
		if (can.base.contains(item, ice.AT)) { item = '<a href="mailto:'+item+'">'+item+'</a>' }
		can.page.Append(can, target, [{view: [[html.ITEM, chat.TITLE], "", item], title: "联系站长"}])
	}) },
	_command: function(can, msg, target) { can.onappend.input(can, {type: html.TEXT, _className: "args trans", icon: icon.TERMINAL, name: ice.CMD, onkeydown: function(event) { can.onkeymap.input(event, can)
		function close() { can.ui.cli && can.ui.cli.onaction.close() } if (event.key == code.ESCAPE) { return close() } if (event.key != code.ENTER) { return } close()
		switch (event.target.value) {
		case web.CLEAR:
		case cli.CLOSE: break
		default: var list = can.core.Split(event.target.value, lex.SP)
			can.onexport._float(can, "cli", {index: "can.console", display: "/plugin/local/code/xterm.js"}, list, function(sub) { can.getActionSize(function(left) { can.page.style(can, sub._target, html.LEFT, left+html.PLUGIN_MARGIN, html.RIGHT, "") }) })
		}
	}}, "", target, [chat.TITLE]) },
	_storm: function(can, msg, target) { can.ui.storm = can.page.Append(can, can._output, [html.MENU])._target },
	_state: function(can, msg, target) { can.user.isMobile || can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), can.onexport.list).reverse(), function(item) {
		can.page.Append(can, target, [{view: [[html.ITEM, chat.STATE]], list: [
			{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", "", item]},
		], onclick: function(event) { can.core.CallFunc(can.onexport[item], [can]) }}]) })
	},
	_toast: function(can, msg, target) { can.ui.toast = can.page.Append(can, target, [{view: [[html.ITEM, chat.TOAST]], onclick: function(event) { can.onexport[NTIP](can) }}])._target },
	_data: function(can, name, item) { can.db[name] = can.db[name]||can.request(), can.db[name].Push(item), can.onimport.count(can, name) },
	tutor: function(event, can, type, text) {
		!event._tutor && event.isTrusted && text && can.onimport._data(can, chat.TUTOR, {time: can.base.Time(), type: type, text: text})
		event._tutor = true
	},
	value: function(can, name, value) { can.page.Select(can, can._output, "div.item>span."+name, function(target) { target.innerHTML = value }) },
	count: function(can, name) { can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) { item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+"" }) },
	ntip: function(can, msg, time, title, content) { can.onimport._data(can, NTIP, {time: time, title: title, content: content}), can.page.Modify(can, can.ui.toast, [time, title, content].join(lex.SP)) },
	ncmd: function(can, msg, _follow, _cmds) { can.onimport._data(can, NCMD, {time: can.base.Time(), follow: _follow, cmds: _cmds}), can.onimport.nlog(can, NLOG) },
	nlog: function(can, name) { can.onimport.count(can, name) },
	menu: function(can, cmds, cb, trans) { can.base.isString(cmds) && (cmds = [cmds])
		return can.page.Append(can, can.ui.storm, [{view: cmds[0], list: can.core.List(can.base.getValid(cmds.slice(1), [cmds[0]]), function(item) {
			return {view: [[html.ITEM, item.name]], list: [{icon: item.icon}, {text: item.name}], onclick: function(event) {
				can.onmotion.select(can, event.currentTarget.parentNode, html.DIV_ITEM, event.currentTarget), cb(event, item.hash)
			}}
		}) }])._target
	},
})
Volcanos(chat.ONACTION, {_init: function(can) {},
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth)
		can.onimport.value(can, html.HEIGHT, can.page.height()), can.onimport.value(can, html.WIDTH, can.page.width())
	},
	onlogin: function(can, msg) { can.run(can.request({}, {_method: http.GET}), [], function(msg) { can.onmotion.clear(can), can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.ntip, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onunload: function(can) { can._wss && can._wss.close() },
	onrecord: function(can, msg) { var zone = can.misc.sessionStorage(can, "web.chat.script:zone"); zone && can.runAction(can.request(), nfs.SCRIPT, [zone].concat(msg.cmds[0])) },
	onaction_cmd: function(can) { can.onappend.style(can, html.HIDE) },
	onstorm_select: function(event, can, river, storm) { event.isTrusted != undefined && can.onimport._data(can, chat.TUTOR, {time: can.base.Time(), type: chat.STORM, text: [river, storm].join(",")}) },

	ontheme: function(event, can, theme) { can.onimport.tutor(event, can, chat.THEME, theme) },
	onevent: function(event, can, query) { can.onimport.tutor(event, can, event.type, query||can.page.getquery(can, event.currentTarget||event.target)) },
	onindex: function(event, can, index) { can.onimport.tutor(event, can, ctx.INDEX, index) },
	onproject: function(event, can, query) { can.onimport.tutor(event, can, html.ITEM, query) },
	onremove: function(event, can, query) { can.onimport.tutor(event, can, mdb.REMOVE, query) },

	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", html.INPUT], function(target) { can.onmotion.focus(can, target) }) },
	onlayout: function(can, layout, before) { if (can.user.isMobile) { return }
		can.page.ClassList.del(can, can._target, before), can.page.ClassList.add(can, can._target, layout)
	},
	ondebugs: function(can, msg) { can.runAction(msg, msg.Option(ctx.ACTION), [msg.Option(ctx.INDEX)], function(_msg) { _msg.Table(function(item) {
		can.onappend._float(can, item, can.base.Obj(item.args, []), function(sub) {
			sub.run = function(event, cmds, cb) { can.run(can.request(event, {_method: http.POST, pod: sub.ConfSpace()}), [ctx.ACTION, msg.Option(ctx.ACTION), ctx.RUN].concat(cmds), cb) }
		})
	}) }) },
})
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, nfs.VERSION],
	height: function(can) { can.onexport._float(can, html.HEIGHT, "can.view") },
	width: function(can) { can.onexport._float(can, html.WIDTH, "can.data") },
	ntip: function(can) { can.onexport._float(can, NTIP, "can.toast") },
	nlog: function(can) { can.onexport._float(can, NLOG, "can.debug") },
	ncmd: function(can) { can.onexport._float(can, NCMD, "can.debug", [chat.ONREMOTE]) },
	nkey: function(can) { can.onexport._float(can, NKEY, "can.localStorage") },
	begin: function(can) { can.onexport._float(can, NKEY, "can.data") },
	version: function(can) { can.onexport._float(can, NKEY, "can.runtime") },
	_float: function(can, name, index, args, cb) { can.ui[name]? can.ui[name].onaction.close(): can.onappend._float(can, index, args||[], function(sub) { can.ui[name] = sub
		can.base.isFunc(cb) && cb(sub), can.onmotion.delay(can, function() { sub.onaction.close = function() { can.page.Remove(can, sub._target), delete(can.ui[name]) } })
	}) },
})
Volcanos(chat.ONPLUGIN, {
	toast: shy("提示", {}, [html.FILTER, ice.LIST], function(can, msg, arg) { if (!can.db[NTIP]) { return }
		arg[0]? can.db[NTIP].Table(function(value) {
			msg.append = [mdb.TIME, "title", "content"], (value.title == arg[0] || value.content.indexOf(arg[0]) > -1) && msg.Push(value)
		}): msg.Copy(can.db[NTIP]), msg.StatusTimeCount()
	}),
	debug: shy("网页日志", {
		"prune": shy("清空", function(can) { while(can.misc._list.pop()) {} can.onmotion.clear(can) }),
		"w3schools": shy("教程", function(can) { can.user.open("https://www.w3schools.com/colors/colors_names.asp") }),
		"mozilla": shy("文档", function(can) { can.user.open("https://developer.mozilla.org/en-US/") }),
		"w3": shy("标准", function(can) { can.user.open("https://www.w3.org/TR/?tag=css") }),
	}, ["type:select=log,info,warn,error,debug,onremote,wss", web.FILTER, ice.LIST, "prune", "w3schools", "mozilla", "w3"], function(can, msg, arg, cb) { var _can = can, can = msg._can
		var stat = {}; var ui = can.page.Appends(can, can._output, [{view: [html.CONTENT, html.TABLE], list: [{type: html.TR, list: [
			{text: [mdb.TEXT, html.TH]},
		]}].concat(can.core.List(can.misc._list, function(list) { stat[list[2]] = ((stat[list[2]]||0)+1); return (!arg || !arg[0] || arg[0] == "log" || arg[0] == list[2]) && {type: html.TR, list: [
			{type: html.TD, list: can.core.List(list, function(item, index) { var vimer
				if (index == 1) { var _ls = new RegExp("(https*://[^/]+)*/*([^:]+):([0-9]+):([0-9]+)").exec(list[1])||[]; _ls[2] = (_ls[2]||"").split(ice.QS)[0]||""
					return {view: [html.ITEM, html.SPAN], list: [{text: lex.SP+can.page.unicode.closes+lex.SP}, {text: [(_ls[1] == location.origin? "": _ls[1]||"")+_ls[2]+nfs.DF+_ls[3], "", nfs.PATH], onclick: function(event) {
						if (can.onexport.record(can, list[1], web.LINK, {time: list[0], link: list[1], type: list[2], path: nfs.USR_VOLCANOS, file: _ls[2], line: _ls[3]})) { return }
						if (vimer) { return can.page.Remove(can, vimer._target), vimer = null }
						vimer = can.onappend.plugin(_can, {index: web.CODE_INNER, args: [nfs.USR_VOLCANOS, _ls[2], _ls[3]]}, function(sub) {}, event.target.parentNode)
					}}]}
				} if (!can.base.isObject(item)) { return item && {text: (index > 0? lex.SP: "")+item} }
				return {view: [mdb.DATA, html.SPAN], _init: function(target) {
					if (item.tagName) { var detail; var ui = can.page.Append(can, target, [{text: lex.SP},
						{text: can.page.unicode.closes+lex.SP, _init: function(target) { can.onmotion.delay(can, function() { ui.toggle = target }) }},
						{view: [[html.ITEM, nfs.TARGET], html.SPAN, can.page.tagClass(item)], onclick: function() {
							if (detail) { return can.page.Remove(can, detail), detail = null, can.page.Modify(can, ui.toggle, can.page.unicode.closes+lex.SP) }
							detail = can.page.AppendData(can, target, "", "", item)._target, detail.click(), can.page.Modify(can, ui.toggle, can.page.unicode.opens+lex.SP)
						}},
					]) } else { can.page.Append(can, target, [{text: lex.SP}]), can.page.AppendData(can, target, "", "", item) }
				}}
			})},
		]} })) }]); arg && arg[1] && can.page.Select(can, can._output, html.TR, function(tr) { can.page.ClassList.set(can, tr, html.HIDE, tr.innerText.indexOf(arg[1]) == -1) })
		can.onappend._status(can, [
			{name: mdb.TIME, value: can.base.Time()}, {name: mdb.COUNT, value: can.page.Select(can, can._output, html.TR+html.NOT_HIDE).length+"x1"},
		].concat(can.core.List([log.INFO, log.WARN, log.ERROR, chat.ONREMOTE, html.WSS], function(item) { return {name: item, value: stat[item]||"0"} })))
	}),
	view: shy("网页元素", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can
		if (can.Conf("_target")) {
			var ui = can.page.Append(can, can._output, [can.page.AppendView(can, can.Conf("_target"))])
			can.onmotion.delay(can, function() { can.page.SelectOne(can, ui._target, html.DIV_ITEM, function(target) { target.click() }) })
		} else if (arg[0]) {
			can.page.Append(can, can._output, [can.page.AppendView(can, can.page.SelectOne(can, document.body, arg[0]))])
		} else {
			var ui = can.page.Append(can, can._output, [can.page.AppendView(can, document, "html", [
				can.page.AppendView(can, document.head, html.HEAD), can.page.AppendView(can, document.body, html.BODY, null, false, function(target) {
					var list = []; for (var p = target; p && p.tagName && p != document.body; p = p.parentNode) {
						list.push(p.tagName.toLowerCase()+(p.className? nfs.PT+p.className.replaceAll(lex.SP, nfs.PT).replace(".picker", ""): ""))
					} can.Option(mdb.KEY, list.reverse().join(ice.GT))
				}),
			], true)]); can.onmotion.delay(can, function() { can.page.Select(can, ui._target, "div.item.head,div.item.body", function(target) { target.click() }) })
		}
	}),
	data: shy("网页数据", [mdb.KEY], function(can, msg, arg, cb) { var can = msg._can, root = can.Conf("_target")||can._root
		arg[0]? can.page.AppendData(can, can._output, arg[0], arg[0].split(nfs.PT).pop(), can.core.Value(root, arg[0]), function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click():
			can.page.AppendData(can, can._output, "", root._name, root, function(prefix, value) { can.Option(mdb.KEY, prefix) })._target.click()
		can.onappend.style(can, "view")
	}),
	console: shy("网页终端", {
		prompt: function(can, msg, arg, meta) { msg.detail = [], msg._can.onimport.grow(msg._can, msg, "only", ["\r", can.base.Time(null, "[%H:%M:%S]"), "can$ "].join("")) },
		resize: function(can, msg, arg, meta) { msg.detail = [], meta.prompt(can, msg, arg, meta) },
		input: function(can, msg, arg, meta) { can = msg._can, msg.detail = [], can._list = can._list||[]
			var text = atob(arg[0]); function grow(text) { can.onimport.grow(can, msg, "only", text) }
			if (text == "\r") { var cmd = can._list.join("")
				if (!cmd) {
					grow("\r\n"), can._list = []
				} else { var res = window.eval(cmd)
					grow("\r\n"+res+"\r\n"), can._list = []
				}
				meta.prompt(can, msg, arg, meta)
			} else if (arg[0] == "fw==") {
				grow("\u0008 \u0008"), can._list.pop()
			} else if (arg[0] == "FQ==") {
				grow("\u0008 \u0008".repeat(can._list.length)), can._list = []
			} else {
				grow(text), can._list = (can._list||[]).concat(text)
			}
		},
	}, [ice.CMD], function(can, msg, arg) { msg._can.Option(ice.CMD, "")
		msg.Display("/plugin/local/code/xterm.js")
	}),
	runtime: shy("网页环境", [mdb.KEY], function(can, msg, arg) {
		msg.Echo(JSON.stringify({href: location.href, version: window._version,
			height: can.page.height(), width: can.page.width(),
			userAgent: navigator.userAgent,
			history: history.length,
			boot: can.db._boot,
			daemon: can.misc.sessionStorage(can, "can.daemon"),
		})).Display("/plugin/story/json.js")
	}),
	dir: shy("网页目录", [nfs.PATH, ice.LIST, ice.BACK], async function(can, msg, arg, cb) { var can = msg._can._fields? msg._can.sup: msg._can
		async function list(key, root) { can._handle[key] = root
			for await (const [name, handle] of root) { if (can.base.beginWith(name, nfs.PT)) { continue }
				if (handle.kind == nfs.FILE) { var _file = await handle.getFile()
					msg.Push(mdb.TIME, can.base.Time(new Date(_file.lastModified))), msg.Push(nfs.PATH, key+name), msg.Push(nfs.SIZE, can.base.Size(_file.size))
				} else {
					msg.Push(mdb.TIME, can.base.Time()), msg.Push(nfs.PATH, key+name+nfs.PS), msg.Push(nfs.SIZE, 0)
				}
			} can.onmotion.delay(can, function() { can.page.Select(can, can._output, "tr>th")[1].click(), can.page.Select(can, msg._can._output, "tr>th")[1].click() }, 50)
		} can._handle = can._handle||{}; if (arg[0] == ctx.ACTION && arg[1] == ice.LIST) { arg = [] }
		if (arg.length == 0) { if (!msg._event.isTrusted) { return msg.Echo(can.page.Format(html.INPUT, "", mdb.TYPE, html.BUTTON, mdb.NAME, ice.LIST, mdb.VALUE, "list")), cb(msg) }
			await list("", can._handle[""] || await window.showDirectoryPicker()), cb(msg)
		} else {
			if (can.base.endWith(arg[0], nfs.PS)) { var path = can.base.trimSuffix(arg[0], nfs.PS)
				if (path.indexOf(nfs.PS) == -1) {
					var file = path, path = ""
				} else {
					var file = path.slice(path.lastIndexOf(nfs.PS)+1), path = path.slice(0, path.lastIndexOf(nfs.PS)+1)
				} var handle = can._handle[path]
				await list(arg[0], await handle.getDirectoryHandle(file)), cb(msg)
			} else {
				if (arg[0].indexOf(nfs.PS) == -1) {
					var file = arg[0], path = ""
				} else { var path = can.base.trimSuffix(arg[0], nfs.PS)
					var file = path.slice(path.lastIndexOf(nfs.PS)+1), path = path.slice(0, path.lastIndexOf(nfs.PS)+1)
				} var handle = can._handle[path], _file = await handle.getFileHandle(file)
				var reader = new FileReader(); reader.onload = () => { msg.Echo(reader.result), cb(msg) }, reader.readAsText(await _file.getFile())
			}
		}
	}),
}) })()
