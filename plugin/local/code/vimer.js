Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.require(["inner.js"], function(can) { can.onimport._last_init(can, msg, function() {
		can.onengine.listen(can, "tabview.line.select", function(msg) { can.onaction._selectLine(can) })
		can.db.undo = [], can.db.redo = [], can.onimport._input(can), can.base.isFunc(cb) && cb(msg)
	}, target) }) },
	_input: function(can) { var ui = can.page.Append(can, can.ui.content.parentNode, [
 		{view: [code.CURRENT, html.INPUT], spellcheck: false, onkeydown: function(event) { can.onimport._value(can); if (event.metaKey) { return }
			can.db._keylist = can.onkeymap._parse(event, can, can.db.mode+(event.ctrlKey? "_ctrl": ""), can.db._keylist, can.ui.current)
			if (can.db.mode == mdb.NORMAL) { can.onkeymap.prevent(event), can.Status(mdb.KEYS, can.db._keylist.join("")) }
			if (can.db.mode == mdb.INSERT) { can.db._keylist = [] }
		}, onkeyup: function(event) { can.onimport._value(can); if (event.metaKey) { return }
			can.onaction._complete(event, can)
		}, onfocus: function(event) {
			can.current.line.appendChild(can.ui.complete)
		}, onclick: function(event) {
			can.onkeymap._insert(event, can)
		}}, {view: [[code.COMPLETE]]},
	]); can.ui.current = ui.current, can.ui.complete = ui.complete, can.onkeymap._build(can), can.onkeymap._plugin(can) },
	_value: function(can) { can.db.mode == mdb.INSERT && can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) }) },
}, [""])
Volcanos(chat.ONFIGURE, { 
	recent: function(can, target, zone) { var total = 0
		function show(msg, cb) { var list = {}; msg.Table(function(item) { var path = item.path+item.file; if (!list[path]) { list[path] = item, can.page.Append(can, target, cb(item, path)), total++ } }) }
		can.runAction({}, code.FAVOR, ["_recent_file"], function(msg) {
			show(msg, function(item, path) { return [{text: [path.split(ice.PS).slice(-2).join(ice.PS), html.DIV, html.ITEM], title: path, onclick: function(event) {
				can.onimport.tabview(can, item.path, item.file)
			}}] }), zone._total(total)
		})
	},
	source: function(can, target, zone, path) { var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) { can.onmotion.clear(can, target)
			if (path == nfs.SRC) { can.ui.zone.source.refresh = function() { show(target, zone, path) } }
			var total, node; function add(list) {
				can.core.List(list, function(item) { if (path == args[0] && args[1].indexOf(item.path) == 0) { item.expand = true } item._menu = shy({
					create: function(event) { can.onappend.style(can, [code.VIMER, nfs.SOURCE, mdb.CREATE], can.user.input(event, can, ["filename"], function(list) {
						can.request(event, {path: can.base.endWith(item.path, ice.PS)? path+item.path: path+item.path.split(ice.PS).slice(0, -1).join(ice.PS)+ice.PS, file: list[0]})
						can.runAction(event, nfs.SAVE, [], function(msg) { var file = (msg.Option(nfs.PATH)+msg.Option(nfs.FILE)).slice(path.length)
							add([{path: file}]), can.onimport.tabview(can, path, file)
						})
					})._target) },
					trash: function(event) { can.runAction(event, nfs.TRASH, [can.base.Path(path, item.path)], function() { item._remove() }) },
				}), item._init = function(target) { item._remove = function() { can.page.Remove(can, target.parentNode), delete(node[item.path]) } } })
				return can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target, node)
			} node = add(msg.Table()), can.Status(mdb.COUNT, total += zone._total(msg.Length()))
		}, true) } if (path.length == 1) { return show(target, path[0]) }
		can.onimport.zone(can, can.core.List(path, function(path) {
			return {name: path, _init: function(target, zone) { path == args[0] && show(target, zone, path) },
				_delay_show: path == args[0]? undefined: function(target, zone) { show(target, zone, path) }}
		}), target), can.page.Remove(can, zone._action)
	},
	repos: function(can, target, zone) { can.onimport._zone(can, zone, "web.code.git.status", function(sub, msg) {
		sub.onexport.record = function(sub, value, key, line) { can.onimport.tabview(can, line.path, line.file) }
		zone._icon({
			"\u21BA": function(event) { sub.Update(event) },
			"\u21C8": function(event) { sub.runAction(event, "push") },
			"\u21CA": function(event) { sub.runAction(event, "pull") },
			"=": function() { can.onimport.tabview(can, can.Option(nfs.PATH), sub._index, ctx.INDEX) },
		})
	}) },
	dream: function(can, target, zone) { can.onimport._zone(can, zone, web.DREAM, function(sub, msg) {
		can.page.Select(can, sub._output, html.DIV_ITEM, function(target, index) { can.onappend.style(can, msg.status[index], target) })
		sub.onimport._open = function(sub, msg, arg) { var url = can.misc.ParseURL(can, arg)
			url.pod? can.onimport.tabview(can, can.Option(nfs.PATH), url.pod+(url.cmd? "/cmd/"+url.cmd:""), web.DREAM): can.user.open(arg)
		}
		sub.onexport.record = function(sub, value, key, line) { can.onimport.tabview(can, can.Option(nfs.PATH), value, web.DREAM) }
		zone._icon({ "\u21BA": function(event) { sub.Update(event) }, "+": function(event) { sub.Update(event, [ctx.ACTION, mdb.CREATE], function(msg) {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(mdb.NAME), web.DREAM), sub.Update()
		}) }})
	}) },
})
Volcanos(chat.ONACTION, {
	_daemon: function(event, can, arg) { switch (arg[0]) {
		case web.DREAM: can.runAction({}, arg[0], arg.slice(1), function(msg) { can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(can.misc.Search(can, ice.POD), msg.Option(mdb.NAME)), web.DREAM) }); break
		case code.XTERM: can.runAction({}, arg[0], arg.slice(1), function(msg) { can.onimport.tabview(can, ctx.COMMAND, code.XTERM, msg.Result()) }); break
		default: can.runAction({}, arg[0], arg.slice(1), function(msg) { can.onimport.tabview(can, msg.Option(nfs.PATH)||can.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.zone.source.refresh() })
	} },
	_run: function(event, can, button, args, cb) { can.runAction(event, button, args, cb||function(msg) {
		can.onimport.tabview(can, msg.Option(nfs.PATH)||can.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.zone.source.refresh(), can.user.toastSuccess(can, button)
	}) },
	_runs: function(event, can, button, cb) { var meta = can.Conf(); can.request(event, {action: button})
		can.user.input(event, can, meta.feature[button], function(args) { can.onaction._run(event, can, button, args, cb) })
	},
	save: function(event, can, button) { can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		function imports(str) { var block = "", count = 0; can.core.List(str.split(ice.NL), function(item) {
			if (can.base.beginWith(item, "import (")) { block = can.core.Split(item)[0]; return }
			if (can.base.beginWith(item, ")")) { block = ""; return }
			if (can.base.beginWith(item, "import ")) { count++; return }
			if (block == "import") { count++ }
		}); return count }
		can.onaction._run(event, can, button, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			if (can.db.parse == nfs.GO) { var line = can.onaction.selectLine(can); can.onmotion.clear(can, can.ui.content)
				can.db.max = 0, can.core.List(msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
				can.onaction.selectLine(can, line+imports(msg.Result())-imports(msg.Option(nfs.CONTENT)))
			} can.user.toastSuccess(can, button, can.Option(nfs.PATH)+can.Option(nfs.FILE))
		})
	},
	compile: function(event, can, button) { can.runAction(can.request(event, {_toast: "编译中..."}), button, [], function(msg) { can.ui.search && can.ui.search.hidden()
		if (msg.Length() > 0 || msg.Result()) { return can.onimport.exts(can, "inner/search.js", function(sub) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)), sub.select() }) }
		var toast = can.user.toastProcess(can, "重启中..."); can.onmotion.delay(can, function() { toast.close(), can.user.toastSuccess(can) }, 3000)
	}) },
	autogen: function(event, can, button) { can.onaction._runs(can.request(event, {path: nfs.SRC}), can, button, function(msg) {
		can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(cli.MAIN), "", function() {
			can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.zone.source.refresh(), can.user.toastSuccess(can)
		}, true)
	}) },
	website: function(event, can, button) {
		can.onaction._runs(can.request(event, {path: "src/website/", file: (can.base.trimSuffix(can.Option(nfs.FILE), can.base.Ext(can.Option(nfs.FILE)))+nfs.ZML).split(ice.PS).pop()}), can, button)
	},

	"命令": function(event, can) {
		can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(list) { can.onimport.tabview(can, can.Option(nfs.PATH), list[0]+(list[1]? ice.FS+list[1]: ""), ctx.INDEX) })
	},
	"插件": function(event, can) { can.user.input(event, can, [ctx.INDEX], function(list) { var sub = can.db.toolkit[list[0]]; if (sub) { sub.select(); return }
		can.onimport.toolkit(can, {index: list[0]}, function(sub) { can.db.toolkit[list[0]] = sub.select() })
	}) },
	"扩展": function(event, can) { can.user.input(can.request(event, {action: "extension"}), can, ["url"], function(list) {
		var sub = can.db.toolkit[list[0]]; sub? sub.select(): can.onimport.exts(can, list[0])
	}) },
	"首页": function(event, can) { can.user.open(location.origin) },
	"官网": function(event, can) { can.user.open("https://shylinux.com/") },
	"调试": function(event, can) { can.user.opens(location.href.replace("debug=true", "debug=false")) },
	"百度": function(event, can) { can.user.opens("https://baidu.com/") },
	"录屏": function(event, can) { can.user.isWebview && window.openapp("QuickTime Player") },
	"编辑器": function(event, can) { can.user.isWebview && window.opencmd("cd ~/contexts; vim +"+can.Option(nfs.LINE)+" "+can.Option(nfs.PATH)+can.Option(nfs.FILE)) },
	"浏览器": function(event, can) { can.user.isWebview && window.openurl(location.href) },

	_complete: function(event, can, target) { if (event == undefined || event.type == "click") { return } target = target||can.ui.complete
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart), key = can.core.Split(pre, "\t .[]", ice.SP).pop()||"", end = can.ui.current.value.slice(can.ui.current.selectionStart)
		function update() { target._pre = pre, target._end = end, target._index = -1
			can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, can.ui.current.offsetLeft, html.MARGIN_TOP, can.current.line.offsetHeight)
			can.runAction(can.request(event, {text: pre}, can.Option()), code.COMPLETE, [], function(msg) { can.page.Appends(can, target, [{view: [lex.PREFIX, html.DIV, pre]}])
				if (can.db.parse == nfs.JS) { var msg = can.request()
					var ls = can.core.Split(can.core.Split(pre, "\t {(:,)}").pop(), ice.PT), list = {can: can, msg: msg, target: target, window: window}
					can.core.ItemKeys(key == ""? list: can.core.Value(list, ls)||can.core.Value(window, ls)||window, function(k, v) {
						msg.Push(mdb.NAME, k).Push(mdb.TEXT, (v+"").split(ice.NL)[0])
					})
				} can.core.Item(can.core.Value(can.onsyntax[can.db.parse], code.KEYWORD), function(key, value) { msg.Push(mdb.NAME, key) })
				can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) { change(value) }} }, target)
				can.page.style(can, target, html.MAX_HEIGHT, can.ui._content.offsetHeight-(can.current.line.offsetTop-can.ui.content.scrollTop)-can.current.line.offsetHeight)
				can.onmotion.toggle(can, target, true)
			})
		}
		function change(key) { can.current.text(can.ui.current.value = target._pre+key+target._end), can.onkeymap.cursorMove(can.ui.current, target._pre.length+key.length, 0) }
		function filter() { can.page.ClassList.set(can, can.ui.complete, html.HIDE, can.page.Select(can, target, [html.TBODY,  html.TR], function(tr) {
			if (!can.page.ClassList.set(can, tr, html.HIDE,
				can.page.Select(can, tr, html.TD, function(td) {
					if (td.innerText.toLowerCase().indexOf(key.toLowerCase()) == 0) { return td }
				}).length == 0)) { return tr }
		}).length == 0) }
		function select(index, total) { index = (index+(total+1))%(total+1); if (index == total) { can.current.text(can.ui.current.value = target._pre+target._end) }
			can.page.Select(can, target, [html.TBODY, html.TR+html.NOT_HIDE], function(tr, i) { if (can.page.ClassList.set(can, tr, html.SELECT, i == index)) {
				change(can.page.Select(can, tr, html.TD)[0].innerText)
			} }); return index
		}
		if (event.ctrlKey) { if (event.type == "keyup") { var total = can.page.Select(can, target, [html.TBODY, html.TR+html.NOT_HIDE]).length; switch (event.key) {
			case "n": target._index = select(target._index+1, total); can.onkeymap.prevent(event); break
			case "p": target._index = select(target._index-1, total); can.onkeymap.prevent(event); break
			default: return can.onkeymap.selectCtrlN(event, can, target, [html.TBODY, html.TR+html.NOT_HIDE], function(tr) { change(can.page.Select(can, tr, html.TD)[0].innerText) })
		} return can.onkeymap.prevent(event) } return }
		switch (pre.slice(-1)) {
			case ice.TB:
			case ice.SP:
			case ice.PT:
			case "[":
			case "(":
			case "{": update(); break
			case "":
			default: filter()
		}
	},
	_selectLine: function(can) { can.page.Select(can, can.current.line, "td.text", function(td) { var target = can.ui.current; target.value = td.innerText
		can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, td.offsetLeft-1, html.TOP, td.offsetTop, html.WIDTH, can.base.Min(td.offsetWidth, can.ui._content.offsetWidth))
		if (event && event.target && event.target.tagName && can.page.tagis(event.target, html.TD, html.SPAN)) {
			can.onkeymap._insert(event, can, 0, (event.offsetX)/12-1), can.onmotion.clear(can, can.ui.complete)
		} else {
			can.db.mode == mdb.NORMAL && can.onkeymap._normal(can)
		}
	}) },
	rerankLine: function(can, value) { can.db.max = can.page.Select(can, can.ui.content, "tr>td.line", function(td, index) { return td.innerText = index+1 }).length },
	insertLine: function(can, value, before) { var line = can.onaction.appendLine(can, value); before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before)); return can.onaction.rerankLine(can), can.onaction._getLineno(can, line) },
	deleteLine: function(can, line) { line = can.onaction._getLine(can, line); var next = line.nextSibling||line.previousSibling; return can.page.Remove(can, line), can.onaction.rerankLine(can), next },
	modifyLine: function(can, line, value) { can.page.Select(can, can.onaction._getLine(can, line), "td.text", function(td) { td.innerHTML = can.onsyntax._parse(can, value) }) },
	cursorUp: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.prev()), can.onkeymap.cursorMove(target, 0, p) },
	cursorDown: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.next()), can.onkeymap.cursorMove(target, 0, p) },
	scrollHold: function(can, count, begin) { var scroll = can.ui.content.scrollLeft; can.ui.current.focus(), count != undefined && can.onkeymap.cursorMove(can.ui.current, count, begin == undefined? count: begin), can.ui.content.scrollLeft = scroll },
})
Volcanos(chat.ONEXPORT, {list: [mdb.COUNT, mdb.TYPE, nfs.FILE, nfs.LINE, ice.BACK, ice.MODE, mdb.KEYS]})
Volcanos(chat.ONKEYMAP, {
	_model: function(can, value) { can.Status(ice.MODE, can.db.mode = value), can.page.styleClass(can, can.ui.current, [code.CURRENT, can.db.mode]), can.page.styleClass(can, can.ui.complete, [code.COMPLETE, can.db.mode, chat.FLOAT]) },
	_plugin: function(can) { can.onkeymap._model(can, mdb.PLUGIN), can.ui.current.blur() },
	_normal: function(can) { can.onkeymap._model(can, mdb.NORMAL), can.onaction.scrollHold(can), can.onkeymap.prevent(event) },
	_insert: function(event, can, count, begin) { can.onkeymap._model(can, mdb.INSERT), can.onaction.scrollHold(can, count, begin), can.onkeymap.prevent(event) },
	_mode: {
		plugin: {
			Backspace: shy("删除", function(event, can, target) {
				for (var p = document.getSelection().anchorNode; !can.page.tagis(p.parentNode, html.TR); p = p.parentNode) {}
				var line = can.onaction._getLineno(can, p.parentNode)
				for (var p = document.getSelection().extentNode; !can.page.tagis(p.parentNode, html.TR); p = p.parentNode) {}
				document.getSelection().deleteFromDocument(), can.onaction.rerankLine(can), can.onaction.selectLine(can, line)
				var text = can.current.text(); if (p && p.innerHTML) { can.current.text(text+p.innerText) }
				can.page.Remove(can, p.parentNode), can.onaction.selectLine(can, line), can.onkeymap._insert(event, can, text.length, 0)
			}),
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

			i: shy("插入模式", function(event, can) { can.onaction.selectLine(can, can.onaction.selectLine(can)), can.onkeymap._insert(event, can) }),
			n: shy("命令模式", function(event, can) { can.onaction.selectLine(can, can.onaction.selectLine(can)), can.onkeymap._normal(can) }),
			":": shy("底行模式", function(event, can) { can.onimport.toolkit(can, {index: "cli.system"}, function(sub) { can.db.toolkit["cli.system"] = sub.select(), can.onmotion.delay(can, function() { sub.Focus() }) }) }),

			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, nfs.SAVE) }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, code.COMPILE) }),
			d: shy("查找函数", function(event, can) { can.page.Select(can, can.ui.path, "span.func", function(target) { target.click() }) }),
			g: shy("查找搜索", function(event, can) { can.onaction.find(event, can) }),
		},
		normal: {
			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, nfs.SAVE) }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, code.COMPILE) }),
			
			Escape: shy("切换模式", function(event, can) { can.onkeymap._plugin(can) }),
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
			a: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
			o: shy("插入下一行", function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(can.base.endWith(text, "{")? ice.TB: "")
				can.onaction.selectLine(can, can.onaction.insertLine(can, text, can.current.next()))
				can.onkeymap._insert(event, can, 0, -1)
			}),
			O: shy("插入上一行", function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(can.base.beginWith(text, "}")? ice.TB: "")
				can.onaction.selectLine(can, can.onaction.insertLine(can, text, can.current.line))
				can.onkeymap._insert(event, can, 0, -1)
			}),

			yy: shy("复制当前行", function(event, can, target, count) { var list = [], line = can.current.line
				for (var i = 0; i < count; i++) { list.push(can.onexport.text(can, line)), line = line.nextSibling } can.db._last_text = list; return true 
			}),
			dd: shy("剪切当前行", function(event, can, target, count) { var line = can.onaction.selectLine(can), callee = arguments.callee
				var list = []; for (var i = 0; i < count; i++) { (function() { var line = can.onaction.selectLine(can), text = can.current.text(); list.push(text)
					can.onaction.selectLine(can, can.onaction.deleteLine(can, line)), can.db.undo.push(function() { can.onaction.insertLine(can, text, line), can.onaction.selectLine(can, line) })
				})() } can.db._last_text = list, can.db.redo.push(function() { callee(event, can, target, count) })
				return true
			}),
			p: shy("粘贴", function(can) { if (!can.db._last_text) { return } var line = can.onaction.selectLine(can), callee = arguments.callee
				for (var i = can.db._last_text.length-1; i >= 0; i--) { (function() { var line = can.onaction.insertLine(can, can.db._last_text[i], can.current.next())
					can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line-1) })
				})() } can.db.redo.push(function() { callee(event, can, target, count) })
			}),
			P: shy("粘贴", function(can) { if (!can.db._last_text) { return } var line = can.onaction.selectLine(can), callee = arguments.callee
				for (var i = 0; i < can.db._last_text.length; i++) { (function() { var line = can.onaction.insertLine(can, can.db._last_text[i], can.current.line)
					can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line+1) })
				})() } can.db.redo.push(function() { callee(event, can, target, count) })
			}),
			J: shy("合并两行", function(can) { var next = can.current.next(); if (!next) { return }
				var line = can.onaction.selectLine(can), text = can.current.text(), rest = can.onexport.text(can, next)
				can.ui.current.value = can.current.text(text.trimRight()+(
					can.base.endWith(text.trim(), "(", "[")||can.base.beginWith(rest.trim(), ",", "]", ")")?
					"": ice.SP)+rest.trimLeft()), can.onaction.deleteLine(can, next)
				can.db.undo.push(function() { can.onaction.modifyLine(can, line, text), can.onaction.insertLine(can, rest, line+1) })
			}),
			".": shy("重复操作", function(can) { var cb = can.db.redo.pop(); cb && cb() }),
			u: shy("撤销操作", function(can) { var cb = can.db.undo.pop(); cb && cb() }),

			gg: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count), true }),
			G: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count = count>1? count: can.db.max), true }),
			zt: shy("将当前行拉到屏幕最上", function(can, count) { return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true }),
			zz: shy("将当前行拉到屏幕中间", function(can, count) { return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true }),
			zb: shy("将当前行拉到屏幕最下", function(can, count) { return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true }),
		},
		normal_ctrl: {
			f: shy("向下翻页", function(can, count) { var line = can.onaction.selectLine(can)+can.current.window()-3-can.current.scroll(); return can.current.scroll(line), can.onaction.selectLine(can, line), true }),
			b: shy("向上翻页", function(can, count) { var line = can.onaction.selectLine(can)-can.current.window()+3; return can.current.scroll(line), can.onaction.selectLine(can, line), true }),
			e: shy("向下滚屏", function(can) { can.current.scroll(1) }),
			y: shy("向上滚屏", function(can) { can.current.scroll(-1) }),
		},
		insert_ctrl: {
			n: shy("向上滚屏", function(event) { can.onkeymap.prevent(event) }),
			p: shy("向上滚屏", function(event) { can.onkeymap.prevent(event) }),
		},
		insert: {
			Escape: shy("退出编辑", function(event, can) { can.onkeymap._normal(can) }),
			Tab: shy("缩进", function(event, can) { can.onkeymap.insertText(can.ui.current, ice.TB), can.onkeymap.prevent(event) }),
			Backspace: shy("删除", function(event, can, target) { if (target.selectionStart > 0 || !can.current.prev()) { return } can.onkeymap.prevent(event)
				var rest = can.current.text(); can.onaction.selectLine(can, can.current.prev()), can.onaction.deleteLine(can, can.current.next())
				var text = can.current.text(); can.ui.current.value = text+rest, can.onkeymap.cursorMove(target, 0, text.length)
			}),
			Enter: shy("换行", function(can, target) {
				var rest = can.onkeymap.deleteText(target, target.selectionEnd).trimLeft(), text = can.ui.current.value
				var left = text.substr(0, text.indexOf(text.trimLeft()))||(text.trimRight() == ""? text: "")
				var line = can.onaction.selectLine(can), next = rest; for (var i = line; i < can.db.max; i++) { next += can.onexport.text(can, i).trimLeft(); if (next != "") { break } }
				function deep(text) { var deep = 0; for (var i = 0; i < text.length; i++) { if (text[i] == ice.TB) { deep += 4 } else if (text[i] == ice.SP) { deep++ } else { break } } return deep }
				text.trim() && can.core.List(["{}", "[]", "()", "``"], function(item) { if (can.base.endWith(text, item[0])) {
					if (can.base.beginWith(next, item[1])) {
						can.onaction.insertLine(can, left+rest, can.current.next()), rest = ""
					} else if (deep(text) >= deep(can.onexport.text(can, line+1)) && rest == "") {
						can.onaction.insertLine(can, left+item[1], can.current.next())
					} left += ice.TB
				} else if (can.base.beginWith(rest, item[1])) { left = left.slice(0, -1) }})
				var line = can.onaction.insertLine(can, left+rest, can.current.next())
				can.current.text(text.trimRight()||text), can.onaction.selectLine(can, line), can.onkeymap._insert(event, can, 0, left.length)
			}),
			ArrowDown: shy("光标下移", function(can, target) { event.key == "ArrowDown" && can.onaction.cursorDown(can, target) }),
			ArrowUp: shy("光标上移", function(can, target) { event.key == "ArrowUp" && can.onaction.cursorUp(can, target) }),
		},
	}, _engine: {},
})
Volcanos(chat.ONPLUGIN, { 
	"code.vimer.keymap": shy("按键", {}, ["mode", "key", ice.LIST, ice.BACK], function(can, msg, cmds) {
		can.core.Item(can.onkeymap._mode, function(mode, value) {
			(!cmds[0] || cmds[0] == mode) && can.core.Item(value, function(key, func) {
				if (cmds[0] == mode && cmds[1] == key) {
					msg.Push(mdb.KEY, "mode").Push(mdb.VALUE, mode)
					msg.Push(mdb.KEY, "key").Push(mdb.VALUE, key)
					msg.Push(mdb.KEY, "help").Push(mdb.VALUE, func.help)
					msg.Push(mdb.KEY, "func").Push(mdb.VALUE, func.toString())
				} else if (!cmds[0] || !cmds[1]) {
					msg.Push(kit.Dict("mode", mode, "key", key, "help", func.help||func.toString()))
				}
			})
		}), msg.StatusTimeCount()
	}),
})
