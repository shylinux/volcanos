Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.require(["inner.js"], function(can) { can.onimport._last_init(can, msg, function() {
			can.db.undo = [], can.db.redo = [], can.page.ClassList.add(can, can._fields, code.VIMER)
			can.onimport._input(can), can.onkeymap._build(can), can.onkeymap._plugin({}, can)
			can.onengine.listen(can, "tabview.line.select", function(msg) { can.onaction._selectLine(can) })
			can.onengine.plugin(can, can.onplugin), can.base.isFunc(cb) && cb(msg)
		}, target) })
	},
	_input: function(can) { var ui = can.page.Append(can, can.ui.content.parentNode, [
		{view: ["current", html.INPUT], spellcheck: false, onkeydown: function(event) {
			if (event.metaKey) { return can.mode == "insert" && can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) }) }
			if (event.ctrlKey && can.onaction._complete(event, can)) { return }
			can._keylist = can.onkeymap._parse(event, can, can.mode+(event.ctrlKey? "_ctrl": ""), can._keylist, can.ui.current)
			if (can.mode == "insert") { can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) }) }
			if (can.mode == "normal") { can.onkeymap.prevent(event), can.Status("按键", can._keylist.join("")) }
		}, onkeyup: function(event) { can.onaction._complete(event, can) }, onclick: function(event) { can.onkeymap._insert(event, can) }}, code.COMPLETE,
	]); can.ui.current = ui.current, can.ui.complete = ui.complete },
}, [""])
Volcanos(chat.ONFIGURE, { 
	create: function(can, target, zone, path) {
		can.isCmdMode()? can.onappend._action(can, can.base.Obj(can._msg.Option(ice.MSG_ACTION)).concat(
			["favor", "git", "首页", "官网" , "文档" , "百度"], window.webview? ["录屏", "日志", "编辑器", "浏览器"]: [],
		), target): can.onmotion.hidden(can, target.parentNode)
		can.sup.onexport.link = function(can) { var args = can.Option(); args.topic = chat.BLACK
			var meta = can.Conf(); args.cmd = meta.index||can.core.Keys(meta.ctx, meta.cmd)
			return can.misc.MergePodCmd(can, args, true)
		}
	},
	recent: function(can, target, zone, path) { var total = 0
		function show(msg, cb) { var list = {}; msg.Table(function(item) { var path = item.path+item.file
			if (!list[path] && total < 10) { zone._total(++total), can.page.Append(can, target, cb(item, path)) } list[path] = item
		}) }
		can.runAction({}, code.FAVOR, ["_recent_file"], function(msg) {
			show(msg, function(item, path) { return [{text: [path.split(ice.PS).slice(-2).join(ice.PS), html.DIV, html.ITEM], onclick: function(event) {
				can.onimport.tabview(can, item.path, item.file)
			}}] })
		})
	},
	source: function(can, target, zone, path) { var total = 0
		function show(target, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
			var node; function add(list) {
				can.core.List(list, function(item) { item._menu = shy({
					create: function(event) { can.user.input(event, can, ["filename"], function(list) {
						can.base.endWith(item.path, ice.PS)? can.request(event, {path: path+item.path, file: list[0]}):
							can.request(event, {path: path+item.path.split(ice.PS).slice(0, -1).join(ice.PS)+ice.PS, file: list[0]})
						can.runAction(event, nfs.SAVE, [], function(msg) { var file = (msg.Option(nfs.PATH)+msg.Option(nfs.FILE)).slice(path.length)
							add([{path: file}], node), can.onimport.tabview(can, path, file)
						})
					}) },
					trash: function(event) { can.runAction(event, nfs.TRASH, [can.base.Path(path, item.path)], function() { item._remove() }) },
				}), item._init = function(target) { item._remove = function() { can.page.Remove(can, target.parentNode), delete(node[item.path]) } } })
				return can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target, node)
			} node = add(msg.Table(), node), can.Status("文件数", zone._total(total += msg.Length()))
		}, true) } if (path.length == 1) { return show(target, path[0]) }
		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target, zone) {
			can.onmotion.hidden(can, zone._action), can.onmotion.hidden(can, zone._target)
		}, _delay_show: function(target) { show(target, path) } }}), target), can.page.Remove(can, target.previousSibling)
	},
	dream: function(can, target, zone) { var call = arguments.callee
		can.runAction({}, ice.RUN, [web.DREAM], function(msg) { msg.Table(function(item) { var color = item.status == cli.START? "": "gray"
			can.page.style(can, can.onimport.item(can, item, function(event) { can.onimport.tabview(can, can.Option(nfs.PATH), item.name, web.DREAM) }, function(event) {
				return shy(kit.Dict(cli.START, [cli.OPEN, cli.STOP], cli.STOP, [cli.START, nfs.TRASH])[item.status], function(event, button) {
					can.runAction(can.request({}, item), ice.RUN, [web.DREAM, ctx.ACTION, button], function(msg) {
						if (can.sup.onimport._process(can.sup, msg)) { return } can.onmotion.clear(can, target), call(can, target, zone)
					})
				})
			}, target), {color: color})
		}), zone._total(msg.Length()) })
		return shy(kit.Dict(web.REFRESH, function(event, can, button) { zone.refresh() },
			mdb.CREATE, function(event, can, button) { can.onaction.dream(event, can, web.DREAM) },
			code.PUBLISH, function(event, can, button) { can.runAction(event, button, [], function(msg) { can.user.toastConfirm(can, msg.Result(), button) }) },
		))
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.ItemKeys(can.onengine.plugin.meta, function(key) { return total++, {index: key} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(ice.CAN, item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
	module: function(can, target, zone) {
		can.runAction(can.request({}, {fields: ctx.INDEX}), ctx.COMMAND, [mdb.SEARCH, ctx.COMMAND], function(msg) {
			can.onimport.tree(can, msg.Table(), ctx.INDEX, ice.PT, function(event, item) {
				can.onimport.tabview(can, can.Option(nfs.PATH), item.index, ctx.INDEX)
			}, target), zone._total(msg.Length())
		})
	},
})
Volcanos(chat.ONACTION, {
	_daemon: function(event, can, arg) {
		switch (arg[0]) {
			case web.DREAM:
				can.runAction({}, arg[0], arg.slice(1), function(msg) {
					can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(can.misc.Search(can, ice.POD), msg.Option(mdb.NAME)), web.DREAM)
				}); break
			case code.XTERM:
				can.runAction({}, arg[0], arg.slice(1), function(msg) {
					can.onimport.tabview(can, ctx.COMMAND, code.XTERM, msg.Result())
				}); break
			default:
				can.runAction({}, arg[0], arg.slice(1), function(msg) {
					can.onimport.tabview(can, msg.Option(nfs.PATH)||can.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.source.refresh()
				})
		}
	},
	_run: function(event, can, button, args, cb) { can.runAction(event, button, args, cb||function(msg) {
		can.onimport.tabview(can, msg.Option(nfs.PATH)||can.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.source.refresh(), can.user.toastSuccess(can, button)
	}) },
	_runs: function(event, can, button, cb) { var meta = can.Conf(); can.request(event, {action: button})
		can.user.input(event, can, meta.feature[button], function(args) { can.onaction._run(event, can, button, args, cb) })
	},
	autogen: function(event, can, button) { can.onaction._runs(can.request(event, {path: "src/"}), can, button, function(msg) {
		can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(cli.MAIN), "", function() {
			can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.source.refresh(), can.user.toastSuccess(can)
		}, true)
	}) },
	script: function(event, can, button) {
		can.onaction._runs(can.request(event, {path: "src/", file: can.base.trimSuffix(can.Option(nfs.FILE), can.base.Ext(can.Option(nfs.FILE)))+nfs.JS}), can, button)
	},
	dream: function(event, can, button) {
		can.onaction._runs(can.request(event, {name: can.base.trimSuffix(can.Option(nfs.FILE).split(ice.PS).pop(), ice.PT+can.base.Ext(can.Option(nfs.FILE)))}), can, button, function(msg) {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(mdb.NAME), web.DREAM), can.ui.dream.refresh(), can.user.toastSuccess(can)
		})
	},
	website: function(event, can, button) {
		can.onaction._runs(can.request(event, {path: "src/website/", file: (can.base.trimSuffix(can.Option(nfs.FILE), can.base.Ext(can.Option(nfs.FILE)))+nfs.ZML).split(ice.PS).pop()}), can, button)
	},
	save: function(event, can, button) { can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		can.onaction._run(event, can, button, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function() { can.user.toastSuccess(can, button, can.Option(nfs.PATH)+can.Option(nfs.FILE)) })
	},
	compile: function(event, can, button) { var _toast = can.user.toastProcess(can, "编译中...")
		can.runAction(can.request(event), button, [], function(msg) { _toast.close(), can.ui.search && can.onmotion.hidden(can, can.ui.search._target)
			if (msg.Length() > 0 || msg.Result()) { return can.onimport.exts(can, "inner/search.js", function(sub) { sub._show(msg) }) }
			var toast = can.user.toastProcess(can, "重启中..."); can.onmotion.delay(can, function() { toast.close(), can.user.toastSuccess(can) }, 3000)
		})
	},
	favor: function(event, can) { can.onimport.tabview(can, can.Option(nfs.PATH), "web.code.favor", ctx.INDEX) },
	git: function(event, can) { can.onimport.tabview(can, can.Option(nfs.PATH), "web.code.git.status", ctx.INDEX) },
	"收藏": function(event, can) { can.onaction._open(can, location.protocol+"//"+location.host+"/chat/cmd/web.chat.favor") },
	"首页": function(event, can) { can.onaction._open(can, location.protocol+"//"+location.host) },
	"官网": function(event, can) { can.onaction._open(can, "https://shylinux.com/") },
	"文档": function(event, can) { can.onaction._open(can, "https://developer.mozilla.org/") },
	"百度": function(event, can) { can.onaction._open(can, "https://baidu.com") },

	xterm: function(event, can, button) {
		can.onaction._runs(can.request(event, can.Option()), can, button, function(msg) {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Result(), code.XTERM)
			can.ui.xterm.refresh(), can.user.toastSuccess(can)
		})
	},
	status: function(event, can) { can.onimport.tabview(can, can.Option(nfs.PATH), "web.code.git.status", ctx.INDEX) },
	plan: function(event, can) { can.onimport.tabview(can, can.Option(nfs.PATH), "web.team.plan", ctx.INDEX) },
	vim: function(event, can) {
		can.onaction._run(can.request(event, can.Option()), can, code.XTERM, [mdb.TYPE, "vim +"+can.Option(nfs.LINE)+" "+can.Option(nfs.PATH)+can.Option(nfs.FILE)], function(msg) {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Result(), code.XTERM), can.ui.xterm.refresh(), can.user.toastSuccess(can)
		})
	},
	"命令": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(list) {
			can.onimport.tabview(can, can.Option(nfs.PATH), list[0], ctx.INDEX)
		})
	},
	"插件": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(list) {
			var sub = can.toolkit[list[0]]; if (sub) { sub.select(); return }
			can.onimport.toolkit(can, {index: list[0]}, function(sub) { can.toolkit[list[0]] = sub.select() })
		})
	},
	"扩展": function(event, can) { can.request(event, {action: "extension"})
		can.user.input(event, can, ["url"], function(list) {
			var sub = can.extentions[list[0]]; if (sub) { sub.select(); return }
			can.onimport.exts(can, list[0])
		})
	},
	"录屏": function(event, can) { window.openapp("QuickTime Player") },
	"日志": function(event, can) { window.opencmd("cd ~/contexts; tail -f var/log/bench.log") },
	"编辑器": function(event, can) { window.opencmd("cd ~/contexts; vim +"+can.Option(nfs.LINE)+" "+can.Option(nfs.PATH)+can.Option(nfs.FILE)) },
	"浏览器": function(event, can) { window.openurl(location.href) },
	_open: function(can, url) { can.user.isWebview? window.openurl(url): window.open(url) },

	_complete: function(event, can, target) { target = target||can.ui.complete
		if (event == undefined) { return }
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart)
		var end = can.ui.current.value.slice(can.ui.current.selectionStart)
		const PRE = "pre"

		var type = can.core.Split(pre).pop()||""
		var name = can.core.Split(type, "", ice.PT).pop()||""
		type = can.base.trimSuffix(type, name)
		type = can.base.trimSuffix(type, ice.PT)

		function update() { target._pre = pre, target._index = -1
			can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, can.ui.current.offsetLeft-1, html.MARGIN_TOP, can.ui.current.offsetHeight-1)
			can.runAction(can.request(event, {text: pre}, can.Option()), code.COMPLETE, [], function(msg) {
				can.page.Appends(can, target, [{view: [PRE, html.DIV, pre]}])
				can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) {
					var left = can.ui.current.value.slice(0, can.ui.current.selectionStart)+value
					can.current.text(can.ui.current.value = left+can.ui.current.value.slice(can.ui.current.selectionEnd))
					can.ui.current.focus(), can.ui.content.scrollLeft -= 10000, can.ui.current.setSelectionRange(left.length, left.length)
				}} }, target)
				can.page.style(can, target, html.MAX_HEIGHT, can.ui._content.offsetHeight-(can.current.line.offsetTop-can.ui.content.scrollTop)-can.current.line.offsetHeight)
			})
		}
		function filter() {
			return can.page.Select(can, target, [html.TBODY,  html.TR], function(tr) {
				if (!can.page.ClassList.set(can, tr, html.HIDE, can.page.Select(can, tr, html.TD, function(td) {
					if (td.innerText.toLowerCase().indexOf(can.base.trimSuffix((name == ice.PT? type: name).toLowerCase(), "(")) == 0) { return td }
				}).length == 0)) { return tr }
			}).length > (name == ice.PT? 1: 0)
		}
		function select(index, total) { index = (index+(total+1))%(total+1)
			if (index == total) { can.current.text(can.ui.current.value = target._pre) }
			can.page.Select(can, target, [html.TBODY, "tr:not(.hide)"], function(tr, i) { if (can.page.ClassList.set(can, tr, html.SELECT, i == index)) {
				can.current.text(can.ui.current.value = target._pre+can.page.Select(can, tr, html.TD)[0].innerText)
			} }); return index
		}

		if (event.ctrlKey) { if (event.type == "keyup") {
			var total = can.page.Select(can, target, [html.TBODY, "tr:not(.hide)"]).length
			switch (event.key) {
				case "n": target._index = select(target._index+1, total); break
				case "p": target._index = select(target._index-1, total); break
				default: return false
			}
			return can.onkeymap.prevent(event)
		} return }

		switch (pre.slice(-1)) {
			case "\t":
			case " ":
			case ".":
			case "(":
			case "{":
				update()
				break
			case "":
			default:
				filter()
		}
	},
	_selectLine: function(can) { if (!can.current) { return }
		can.page.Select(can, can.current.line, "td.text", function(td) { var target = can.ui.current; target.value = td.innerText
			can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, td.offsetLeft-1, html.WIDTH, can.base.Min(td.offsetWidth, can.ui._content.offsetWidth))
			var scroll = can.ui.content.scrollLeft
			if (event && event.type == "click") {
				can.onkeymap._insert(event, can, 0, (event.offsetX)/12-1)
			} else {
				target.focus(), can.onkeymap.cursorMove(can.ui.current, 0, 0)
			} can.ui.content.scrollLeft = scroll
		})
		can.misc.localStorage(can, "web.code.inner:currentFile", can.Option(nfs.PATH)+ice.DF+can.Option(nfs.FILE)+ice.DF+can.onaction._getLineno(can, can.current.line))
		can.misc.localStorage(can, "web.code.vimer:selectLine:"+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onaction._getLineno(can, can.current.line))
	},

	_getLine: function(can, line) { return can.page.SelectOne(can, can.ui.content, "tr>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return td.parentNode } }) },
	_getLineno: function(can, line) { return can.page.SelectOne(can, can.ui.content, "tr>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return index+1 } }) },
	rerankLine: function(can, value) { can.max = can.page.Select(can, can.ui.content, "tr>td.line", function(td, index) { return td.innerText = index+1 }).length },
	insertLine: function(can, value, before) { var line = can.onaction.appendLine(can, value)
		before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before))
		return can.onaction.rerankLine(can), can.onaction._getLineno(can, line)
	},
	deleteLine: function(can, line) { line = can.onaction._getLine(can, line)
		var next = line.nextSibling||line.previousSibling
		return can.page.Remove(can, line), can.onaction.rerankLine(can), next
	},
	modifyLine: function(can, line, value) { can.page.Select(can, can.onaction._getLine(can, line), "td.text", function(td) { td.innerHTML = can.onsyntax._parse(can, value) }) },
	cursorUp: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.prev()), can.onkeymap.cursorMove(target, 0, p) },
	cursorDown: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.next()), can.onkeymap.cursorMove(target, 0, p) },
})
Volcanos(chat.ONEXPORT, {list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})
Volcanos(chat.ONKEYMAP, {
	_model: function(can, value) { can.Status("模式", can.mode = value)
		can.page.styleClass(can, can.ui.current, ["current", can.mode]), value
		can.page.styleClass(can, can.ui.complete, [code.COMPLETE, can.mode]), value
	},
	_plugin: function(event, can) { can.onkeymap._model(can, "plugin"), can.ui.current.blur() },
	_normal: function(event, can) { can.onkeymap._model(can, "normal"), can.ui.current.focus() },
	_insert: function(event, can, count, begin) { can.onkeymap._model(can, "insert"), can.onkeymap.prevent(event)
		var scroll = can.ui.content.scrollLeft; can.ui.current.focus(), can.ui.content.scrollLeft = scroll
		can.onkeymap.cursorMove(can.ui.current, count, begin)
	},

	_mode: {
		plugin: {
			Escape: shy("切换模式", function(event, can) { can.onaction.clear(event, can) }),
	r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
	v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
	f: shy("打开文件", function(event, can) { can.onaction.open(event, can) }),
	l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
	h: shy("打开左边标签", function(can) { var prev = can._tab.previousSibling; prev && prev.click() }),
	x: shy("关闭标签", function(can) { can._tab._close() }),

	t: shy("添加命令", function(event, can) { can.onaction["命令"](event, can) }),
	p: shy("添加插件", function(event, can) { can.onaction["插件"](event, can) }),
	e: shy("添加扩展", function(event, can) { can.onaction["扩展"](event, can) }),

	i: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
	n: shy("命令模式", function(event, can) { can.onkeymap._normal(event, can) }),
	":": shy("底行模式", function(event, can) { can.onimport.toolkit(can, {index: "cli.system"}, function(sub) { can.toolkit["cli.system"] = sub.select() }) }),

	g: shy("查找替换", function(event, can) { can.onaction.find(event, can) }),
	s: shy("保存文件", function(event, can) { can.onaction.save(event, can, nfs.SAVE) }),
	c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, code.COMPILE) }),
		},
		normal: {
			Escape: shy("切换模式", function(event, can) { can.onkeymap._plugin(event, can) }),
	ArrowLeft: shy("光标左移", function(can, target) { can.onkeymap.cursorMove(target, -1) }),
	ArrowRight: shy("光标右移", function(can, target) { can.onkeymap.cursorMove(target, 1) }),
	ArrowDown: shy("光标下移", function(can, target) { can.onaction.cursorDown(can, target) }),
	ArrowUp: shy("光标上移", function(can, target) { can.onaction.cursorUp(can, target) }),

	H: shy("跳到行首", function(can, target) { can.onkeymap.cursorMove(target, 0, 0) }),
	L: shy("跳到行尾", function(can, target) { can.onkeymap.cursorMove(target, 0, -1) }),
	h: shy("光标左移", function(can, target) { can.onkeymap.cursorMove(target, -1) }),
	l: shy("光标右移", function(can, target) { can.onkeymap.cursorMove(target, 1) }),
	j: shy("光标下移", function(can, target) { can.onaction.cursorDown(can, target) }),
	k: shy("光标上移", function(can, target) { can.onaction.cursorUp(can, target) }),

	I: shy("插入行首", function(event, can) { can.onkeymap._insert(event, can, 0, 0) }),
	A: shy("插入行尾", function(event, can) { can.onkeymap._insert(event, can, 0, -1) }),
	i: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
	a: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can, 1) }),
	o: shy("插入下一行", function(event, can) { var text = can.current.text()
		text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("{")?"\t":"")
		can.onaction.selectLine(can, can.onaction.insertLine(can, text, can.current.next()))
		can.onkeymap._insert(event, can, 0, -1)
	}),
	O: shy("插入上一行", function(event, can) { var text = can.current.text()
		text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("}")?"\t":"")
		can.onaction.selectLine(can, can.onaction.insertLine(can, text, can.current.line))
		can.onkeymap._insert(event, can, 0, -1)
	}),

	yy: shy("复制当前行", function(event, can, target, count) {
		var list = [], line = can.current.line; for (var i = 0; i < count; i++) {
			list.push(can.onexport.text(can, line)), line = line.nextSibling
		} can._last_text = list
		return true 
	}),
	dd: shy("剪切当前行", function(event, can, target, count) {
		var list = []; for (var i = 0; i < count; i++) { (function() {
			var line = can.onaction.selectLine(can), text = can.current.text(); list.push(text)
			can.onaction.selectLine(can, can.onaction.deleteLine(can, line))
			can.db.undo.push(function() { can.onaction.insertLine(can, text, line), can.onaction.selectLine(can, line) })
			var callee = arguments.callee; can.db.redo.push(function() { callee(can) })
		})() } can._last_text = list
		return true
	}),
	p: shy("粘贴", function(can) { if (!can._last_text) { return }
		for (var i = can._last_text.length-1; i >= 0; i--) { (function() {
			var line = can.onaction.insertLine(can, can._last_text[i], can.current.next())
			can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line-1) })
			var call = arguments.callee; can.db.redo.push(function() { call(event, can) })
		})() }
	}),
	P: shy("粘贴", function(can) { if (!can._last_text) { return }
		for (var i = 0; i < can._last_text.length; i++) { (function() {
			var line = can.onaction.insertLine(can, can._last_text[i], can.current.line)
			can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line+1) })
			var call = arguments.callee; can.db.redo.push(function() { call(event, can) })
		})() }
	}),
	J: shy("合并两行", function(can) {
		var next = can.current.next(); if (!next) { return }
		var rest = can.onexport.text(can, next)
		var line = can.onaction.selectLine(can), text = can.current.text()
		can.ui.current.value = can.current.text(text.trimRight()+ice.SP+rest.trimLeft()), can.onaction.deleteLine(can, next)
		can.db.undo.push(function() { can.onaction.modifyLine(can, line, text), can.onaction.insertLine(can, rest, line+1) })
	}),
	".": shy("重复操作", function(can) { var cb = can.db.redo.pop(); cb && cb() }),
	u: shy("撤销操作", function(can) { var cb = can.db.undo.pop(); cb && cb() }),

	gg: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count), true }),
	G: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count = count>1? count: can.max), true }),
	zt: shy("将当前行拉到屏幕最上", function(can, count) { return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true }),
	zz: shy("将当前行拉到屏幕中间", function(can, count) { return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true }),
	zb: shy("将当前行拉到屏幕最下", function(can, count) { return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true }),
		},
		normal_ctrl: {
			f: shy("向下翻页", function(can, count) {
				var line = can.onaction.selectLine(can)+can.current.window()-3-can.current.scroll()
				return can.current.scroll(line), can.onaction.selectLine(can, line), true
			}),
	b: shy("向上翻页", function(can, count) {
		var line = can.onaction.selectLine(can)-can.current.window()+3
		return can.current.scroll(line), can.onaction.selectLine(can, line), true
	}),
	e: shy("向下滚屏", function(can) { can.current.scroll(1) }),
	y: shy("向上滚屏", function(can) { can.current.scroll(-1) }),
		},
		insert: {
			Escape: shy("退出编辑", function(event, can) { event.key == lang.ESCAPE && can.onkeymap._normal(event, can) }),
	Tab: shy("缩进", function(event, can) { if (event.key != lang.TAB) { return }
		can.onkeymap.insertText(can.ui.current, ice.TB), can.onkeymap.prevent(event)
	}),
	Backspace: shy("删除", function(event, can, target) { if (event.key != lang.BACKSPACE) { return }
		if (target.selectionStart > 0 || !can.current.prev()) { return } can.onkeymap.prevent(event)
		var rest = can.current.text(); can.onaction.selectLine(can, can.current.prev()), can.onaction.deleteLine(can, can.current.next())
		var text = can.current.text(); can.ui.current.value = text+rest, can.onkeymap.cursorMove(target, 0, text.length)
	}),
	Enter: shy("换行", function(can, target) { if (event.key != lang.ENTER) { return }
		var rest = can.onkeymap.deleteText(target, target.selectionEnd), text = can.ui.current.value
		var left = text.substr(0, text.indexOf(text.trimLeft()))||(text.trimRight() == ""? text: "")
		text && can.core.List(["{}", "[]", "()"], function(item) { if (can.base.endWith(text, item[0])) {
			if (can.base.beginWith(rest, item[1])) { return true }
			(!rest && can.onaction.insertLine(can, left+item[1], can.current.next()), left += ice.TB)
		} }).length == 0 && rest && ["}", "]", ")"].indexOf(rest[0]) > -1 && (left = left.slice(0, -1)) || (rest.trim()[0] == "}" && text.trim()[text.length-1] != "{") && (left = left.slice(0, -1))
		if (can.base.endWith(text, "`") && can.base.count(text, "`")%2==1) { !rest && can.onaction.insertLine(can, left+"`", can.current.next()) }
		var line = can.onaction.insertLine(can, left+rest.trimLeft(), can.current.next())
		can.current.text(text.trimRight()||text), can.onaction.selectLine(can, line)
		can.onkeymap.cursorMove(target, 0, left.length)
	}),
	ArrowDown: shy("光标下移", function(can, target) { event.key == "ArrowDown" && can.onaction.cursorDown(can, target) }),
	ArrowUp: shy("光标上移", function(can, target) { event.key == "ArrowUp" && can.onaction.cursorUp(can, target) }),
		},
	}, _engine: {},
})
Volcanos(chat.ONEXPORT, {
	text: function(can, line) { return can.core.Value(can.page.Select(can, line, "td.text")[0], "innerText") },
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
})
Volcanos(chat.ONPLUGIN, { 
	"code.vimer.keymap": shy("按键", {}, ["mode", "key", ice.LIST, ice.BACK], function(can, msg, cmds) {
		can.core.Item(can.onkeymap._mode, function(mode, value) {
			(!cmds[0] || cmds[0] == mode) && can.core.Item(value, function(key, func) {
				if (cmds[0] == mode && cmds[1] == key) {
					msg.Push("key", "mode")
					msg.Push("value", mode)
					msg.Push("key", "key")
					msg.Push("value", key)
					msg.Push("key", "help")
					msg.Push("value", func.help)
					msg.Push("key", "func")
					msg.Push("value", func.toString())
				} else if (!cmds[0] || !cmds[1]) {
					msg.Push(kit.Dict("mode", mode, "key", key, "help", func.help||func.toString()))
				}
			})
		}), msg.StatusTimeCount()
	}),
})
