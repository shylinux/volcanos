Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.onappend.style(can, code.VIMER); if (can.user.mod.isPod) { delete(can.onfigure.space) }
		can.require(["/plugin/local/code/inner.js"], function(can) { can.onimport._last_init(can, msg, function() {
			can.db.undo = [], can.db.redo = [], can.onimport._input(can), cb && cb(msg)
		}) })
	},
	_input: function(can) { var ui = can.page.Append(can, can.ui.content.parentNode, [
		{view: [code.CURRENT, html.INPUT], spellcheck: false, onkeydown: function(event) { if (event.metaKey) { return }
			can.onimport._value(can), can.onkeymap._parse(event, can, can.db.mode+(event.ctrlKey? "_ctrl": ""), can.ui.current)
			if (can.db.mode == mdb.INSERT) { can.ui.current._keylist = [] }
			if (can.db.mode == mdb.NORMAL) { can.onkeymap.prevent(event) }
		}, onkeyup: function(event) { if (event.metaKey) { return }
			can.onimport._value(can); can.onkeymap._complete(event, can)
		}, onclick: function(event) { can.onkeymap._insert(event, can)
		}}, {view: [[code.COMPLETE]]},
	]); can.ui.current = ui.current, can.ui.complete = ui.complete, can.onkeymap._plugin(can) },
	_value: function(can) { can.onimport.__tabPath(can, true)
		can.db.mode == mdb.INSERT && can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) })
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	source: function(can, target, zone, hash) { var args = [can.Option(nfs.PATH), can.Option(nfs.FILE)]
		can.run({}, [ctx.ACTION, nfs.REPOS], function(msg) { var paths = can.db.paths
			can.core.List(paths.concat(msg.Table(function(value) { return value.path })), function(p) {
				if (can.base.beginWith(p, nfs.USR_LOCAL_WORK) || can.base.isIn(p,
					// nfs.USR_LEARNING, nfs.USR_INTSHELL,
					nfs.USR_ICONS, nfs.USR_GEOAREA, nfs.USR_NODE_MODULES,
					// nfs.USR_PROGRAM,
					nfs.USR_WEBSOCKET, nfs.USR_GO_QRCODE, nfs.USR_GO_GIT
				)) { return }
				if (p && paths.indexOf(p) == -1 && p[0] != nfs.PS) { paths.push(p) }
			})
			function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
				var cache, list = can.core.List(msg.Table(), function(value) {
					if (path == nfs.SRC && can.base.isIn(value.path, "main.ico", "main.svg", "version.go", "binpack.go", "binpack_usr.go")) { return }
					if (path == nfs.USR_RELEASE && can.base.isIn(value.path, "conf.go", "binpack.go")) { return }
					if (path == args[0] && args[1].indexOf(value.path) == 0) { value.expand = true }
					return value
				}); can.onmotion.clear(can, target), zone._total(msg.Length())
				cache = can.onimport.tree(can, list, function(event, item, target) {
					can.base.endWith(item.path, nfs.PS) || can.onimport.tabview(can, path, item.path, "", function(msg) { msg._item = target })
				}, function(event, item, target) {
					var msg = can.request(event); msg.Option(nfs.PATH, path), msg.Option(nfs.FILE, item.path)
				}, target, cache)
				can.onmotion.delay(can, function() { hash.length > 1 && can.onimport.openzone(can, hash[0], hash[1], hash[2]) && can.onimport.tabview(can, hash[0], hash[1], hash[2]), hash = [] })
				can.onimport._zone_icon(can, msg, zone, function(event, button) { can.onaction._runs(event, can, button) })
			}, true) } if (paths.length == 1) { return show(target, zone, paths[0]) } can.page.Remove(can, zone._action)
			can.onimport.zone(can, can.core.List(paths, function(path) {
				return kit.Dict(mdb.NAME, path, path == args[0]? chat._INIT: chat._DELAY_INIT, function(target, zone) { show(target, zone, path) })
			}), target)
		})
	},
	space: function(can, target, zone, hash) { can.onimport._zone(can, zone, web.DREAM, mdb.NAME, hash), zone.toggle(false) },
})
Volcanos(chat.ONACTION, {_trans: {input: {main: "程序", top: "顶域"}},
	_run: function(event, can, button, args, cb) { can.runAction(event, button, args, cb||function(msg) {
		can.onmotion.delay(can, function() { can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE)) }, 300)
		can.ui.zone.source.refresh()
	}) },
	_runs: function(event, can, button, cb) { var meta = can.Conf(), msg = can.request(event); msg.Option(ctx.ACTION, button)
		can.user.input(event, can, meta.feature[button], function(data, args) { msg.Option(data), can.onaction._run(event, can, button, args, cb) })
	},
	save: function(event, can, button) { var p = can.Option(nfs.PATH)+can.Option(nfs.FILE); can.user.toastProcess(can, p, button)
		can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		can.onaction._run(event, can, button, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onaction.reload(can, msg), can.user.toastSuccess(can, p, button)
		})
	},
	reload: function(can, msg) {
		function imports(str) { var block = "", count = 0; can.core.List(str.split(lex.NL), function(text) {
			if (can.base.beginWith(text, "import (")) { block = can.core.Split(text)[0]; return }
			if (can.base.beginWith(text, ")")) { block = ""; return }
			if (can.base.beginWith(text, "import ")) { count++; return }
			if (block == "import") { count++ }
		}); return count }
		if (can.onexport.parse(can) == nfs.GO) {
			var line = can.onaction.selectLine(can); can.onmotion.clear(can, can.ui.content), can.ui.content._max = 0
			can.core.List(msg.Result().split(lex.NL), function(text) { can.onaction.appendLine(can, text) })
			can.onaction.selectLine(can, line+imports(msg.Result())-imports(msg.Option(nfs.CONTENT)))
		}
		if (can.base.isIn(can.onexport.parse(can), nfs.JS, nfs.JSON)) {
			var line = can.onaction.selectLine(can); can.onmotion.clear(can, can.ui.content), can.ui.content._max = 0
			can.core.List(msg.Option("content").split(lex.NL), function(text) { can.onaction.appendLine(can, text) })
			can.onaction.selectLine(can, line)
		}
	},
	trash: function(event, can, button) { var msg = can.request(event), p = msg.Option(nfs.PATH)+msg.Option(nfs.FILE)
		can.onaction._run(event, can, button, [p], function(msg) { can.ui.zone.source.refresh() })
	},
	script: function(event, can, button) { can.onaction._runs(event, can, button) },
	create: function(event, can, button) { can.onaction._runs(event, can, button) },
	module: function(event, can, button) { can.onaction._runs(can.request(event, {title: can.user.trans(can, button, "创建模块")}), can, button) },
	compile: function(event, can, button) { var msg = can.request(event); msg.Option(chat._TOAST, "")
		can.runAction(event, button, [], function(msg) { can.ui.search && can.ui.search.hidden()
			if (msg.Length() > 0 || msg.Result()) { return can.onimport.exts(can, "inner/search.js", function(sub) { can.ui.search = sub, sub.select()
				can.onmotion.delay(can, function() { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)) })
			}) } var toast = can.user.toastProcess(can, cli.RESTART); can.onmotion.delay(can, function() { toast.close(), can.user.toastSuccess(can, cli.RESTART) }, 3000)
		})
	},
	"命令": function(event, can) { can.user.input(event, can, [{name: ctx.INDEX, need: "must"}, ctx.ARGS], function(data) {
		can.onimport.tabview(can, "", data.index+(data.args? mdb.FS+data.args: ""), ctx.INDEX)
	}) },
	"插件": function(event, can) { can.user.input(can.request(event, {type: "plug"}), can, [{name: ctx.INDEX, need: "must"}, ctx.ARGS], function(list, data) {
		var key = list.join(","), sub = can.db.toolkit[key]; if (sub) { return sub.select() }
		can.onimport.toolkit(can, {index: data.index, args: can.core.Split(data.args||"")}, function(sub) { can.db.toolkit[key] = sub.select() })
	}) },
	"扩展": function(event, can) { can.user.input(can.request(event, {action: "extension"}), can, ["url"], function(list) {
		var sub = can.db.toolkit[list[0]]; sub? sub.select(): can.onimport.exts(can, list[0])
	}) },
	
	insertLine: function(can, text, before) {
		var line = can.onaction.appendLine(can, text)
		before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before))
		return can.onaction.rerankLine(can), can.onexport.line(can, line)
	},
	deleteLine: function(can, line) {
		line = can.onaction._getLine(can, line)
		var next = line.nextSibling||line.previousSibling;
		return can.page.Remove(can, line), can.onaction.rerankLine(can), next
	},
	_selectLine: function(can) { can.current && can.page.Select(can, can.current.line, "td.text", function(td) { var target = can.ui.current; if (!target) { return }
		can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, td.offsetLeft-1, html.TOP, td.offsetTop, html.WIDTH, can.base.Min(td.offsetWidth, can.ui.content.offsetWidth-can.page.Select(can, can.current.line, "td.line")[0].offsetWidth))
		target.value = td.innerText, can.db.mode == mdb.NORMAL && can.onkeymap._normal(can)
		can.onmotion.delay(can, function() { can.page.SelectChild(can, can.ui.complete, html.DIV, function(target) {
			target.innerText = can.ui.current.value.slice(0, can.ui.current.selectionStart)
		}) })
	}) },
})
Volcanos(chat.ONKEYMAP, {
	scrollHold: function(can, count, begin) { var top = can.ui.content.scrollTop, left = can.ui.content.scrollLeft
		can.ui.current.focus(), count != undefined && can.onkeymap.cursorMove(can.ui.current, count, begin == undefined? count: begin)
		can.ui.content.scrollTop = top, can.ui.content.scrollLeft = left
	},
	cursorDown: function(can, target) { if (!can.current.next()) { return }
		var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.next()), can.onkeymap.cursorMove(target, 0, p)
	},
	cursorUp: function(can, target) { if (!can.current.prev()) { return }
		var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.prev()), can.onkeymap.cursorMove(target, 0, p)
	},
	_model: function(can, mode) { can.db.mode = mode, can.onimport.__tabPath(can, true), can.onmotion.toggle(can, can.ui.complete, false)
		can.core.List([mdb.NORMAL, mdb.INSERT], function(mode) { can.page.ClassList.del(can, can._output, mode) }), can.page.ClassList.add(can, can._output, mode)
	},
	_plugin: function(can) { can.onkeymap._model(can, mdb.PLUGIN), can.ui.current.blur() },
	_normal: function(can) { can.onkeymap._model(can, mdb.NORMAL), can.onkeymap.scrollHold(can) },
	_insert: function(event, can, count, begin) { can.onkeymap._model(can, mdb.INSERT), can.onkeymap.scrollHold(can, count, begin), can.onkeymap.prevent(event) },
	_complete: function(event, can, target) { if (event == undefined || event.type == "click") { return } target = target||can.ui.complete
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart), key = can.core.Split(pre, "\t .[]", lex.SP).pop()||"", end = can.ui.current.value.slice(can.ui.current.selectionStart)
		function show() { can.current.line.appendChild(target), key && can.onmotion.toggle(can, target, true)
			can.page.style(can, target, html.LEFT, can.ui.current.offsetLeft, html.MARGIN_TOP, can.user.isChrome? can.current.line.offsetHeight: 5)
		} show()
		function update() { target._pre = pre, target._end = end, target._index = -1
			can.runAction(can.request(event, {text: pre}, can.Option()), code.COMPLETE, [], function(msg) { can.page.Appends(can, target, [{view: [lex.PREFIX, html.DIV, pre]}])
				var parse = can.onsyntax[can.onexport.parse(can)]; can.core.CallFunc(can.core.Value(parse, code.COMPLETE), [event, can, msg, target, pre, key])
				can.core.Item(can.core.Value(parse, code.KEYWORD), function(key, value) { msg.Push(mdb.NAME, key) })
				var table = can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) { change(value) }} }, target)
				can.page.style(can, table, html.MAX_HEIGHT, can.ui.content.offsetHeight-(can.current.line.offsetTop-can.ui.content.scrollTop)-can.current.line.offsetHeight)
				show()
			})
		}
		function change(key) { can.current.text(can.ui.current.value = target._pre+key+target._end), can.onkeymap.cursorMove(can.ui.current, target._pre.length+key.length, 0) }
		function filter() { can.page.ClassList.set(can, can.ui.complete, html.HIDE, can.page.Select(can, target, [html.TBODY,  html.TR], function(tr) {
			if (!can.page.ClassList.set(can, tr, html.HIDE, can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.toLowerCase().indexOf(key.toLowerCase()) == 0) { return td } }).length == 0)) { return tr }
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
			case lex.TB:
			case lex.SP:
			case nfs.PT:
			case "[": // ]
			case "(": // )
			case "{": update(); break // }
			case "":
			default: filter()
		}
	},
	_mode: {
		plugin: {
			Escape: shy("清除浮窗", function(event, can) { can.onaction.clear(event, can) }),
			f: shy("打开文件", function(event, can) { can.onaction.open(event, can) }),
			g: shy("查找搜索", function(event, can) { can.onaction.find(event, can) }),
			d: shy("查找函数", function(event, can) { can.page.Select(can, can.ui.path, "span.func", function(target) { target.click() }) }),
			n: shy("命令模式", function(event, can) { can.onaction.selectLine(can, can.onaction.selectLine(can)), can.onkeymap._normal(can) }),
			i: shy("插入模式", function(event, can) { can.onaction.selectLine(can, can.onaction.selectLine(can)), can.onkeymap._insert(event, can) }),
			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, nfs.SAVE) }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, code.COMPILE) }),
			v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
			r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
			t: shy("添加命令", function(event, can) { can.onaction["命令"](event, can) }),
			p: shy("添加插件", function(event, can) { can.onaction["插件"](event, can) }),
			l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
			h: shy("打开左边标签", function(can) { var prev = can._tab.previousSibling; prev && prev.click() }),
			x: shy("关闭标签", function(can) { can._tab._close() }),
		},
		normal: {
			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, nfs.SAVE) }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, code.COMPILE) }),
			v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
			r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
			
			Escape: shy("切换模式", function(can) { can.onkeymap._plugin(can) }),
			ArrowLeft: shy("光标左移", function(can, target) { can.onkeymap.cursorMove(target, -1) }),
			ArrowRight: shy("光标右移", function(can, target) { can.onkeymap.cursorMove(target, 1) }),
			ArrowDown: shy("光标下移", function(can, target) { can.onkeymap.cursorDown(can, target) }),
			ArrowUp: shy("光标上移", function(can, target) { can.onkeymap.cursorUp(can, target) }),
			H: shy("跳到行首", function(can, target) { can.onkeymap.cursorMove(target, 0, 0) }),
			L: shy("跳到行尾", function(can, target) { can.onkeymap.cursorMove(target, 0, -1) }),
			h: shy("光标左移", function(can, target) { can.onkeymap.cursorMove(target, -1) }),
			l: shy("光标右移", function(can, target) { can.onkeymap.cursorMove(target, 1) }),
			j: shy("光标下移", function(can, target) { can.onkeymap.cursorDown(can, target) }),
			k: shy("光标上移", function(can, target) { can.onkeymap.cursorUp(can, target) }),
			
			I: shy("插入行首", function(event, can) { can.onkeymap._insert(event, can, 0, 0) }),
			A: shy("插入行尾", function(event, can) { can.onkeymap._insert(event, can, 0, -1) }),
			i: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
			a: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
			o: shy("插入下一行", function(event, can) { var text = can.current.text()
			text = text.substr(0, text.indexOf(text.trimLeft()))+(can.base.endWith(text, "{")? lex.TB: "")
				can.onaction.selectLine(can, can.onaction.insertLine(can, text, can.current.next()))
				can.onkeymap._insert(event, can, 0, -1)
			}),
			O: shy("插入上一行", function(event, can) { var text = can.current.text()
			text = text.substr(0, text.indexOf(text.trimLeft()))+(can.base.beginWith(text, "}")? lex.TB: "")
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
			p: shy("向后粘贴", function(can) { if (!can.db._last_text) { return } var line = can.onaction.selectLine(can), callee = arguments.callee
				for (var i = can.db._last_text.length-1; i >= 0; i--) { (function() { var line = can.onaction.insertLine(can, can.db._last_text[i], can.current.next())
					can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line-1) })
				})() } can.db.redo.push(function() { callee(event, can, target, count) })
			}),
			P: shy("向前粘贴", function(can) { if (!can.db._last_text) { return } var line = can.onaction.selectLine(can), callee = arguments.callee
				for (var i = 0; i < can.db._last_text.length; i++) { (function() { var line = can.onaction.insertLine(can, can.db._last_text[i], can.current.line)
					can.db.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(can, line+1) })
				})() } can.db.redo.push(function() { callee(event, can, target, count) })
			}),
			J: shy("合并两行", function(can) { var next = can.current.next(); if (!next) { return }
				var line = can.onaction.selectLine(can), text = can.current.text(), rest = can.onexport.text(can, next)
			can.ui.current.value = can.current.text(text.trimRight()+(can.base.endWith(text.trim(), "(", "[")||can.base.beginWith(rest.trim(), ",", "]", ")")? "": lex.SP)+rest.trimLeft())
				can.onkeymap.cursorMove(can.ui.current, text.length, 0), can.onaction.deleteLine(can, next)
				can.db.undo.push(function() { can.onaction.modifyLine(can, line, text), can.onaction.insertLine(can, rest, line+1) })
			}),
			".": shy("重复操作", function(can) { var cb = can.db.redo.pop(); cb && cb() }),
			u: shy("撤销操作", function(can) { var cb = can.db.undo.pop(); cb && cb() }),
			
			gg: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count), true }),
			G: shy("跳到某行", function(can, count) { return can.onaction.selectLine(can, count = count>1? count: can.db.max), true }),
			zt: shy("屏幕最上", function(can, count) { return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true }),
			zz: shy("屏幕中间", function(can, count) { return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true }),
			zb: shy("屏幕最下", function(can, count) { return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true }),
			F5: shy("刷新网页", function(can, target) { can.user.reload(true) }),
		},
		normal_ctrl: {
			e: shy("向上滚屏", function(can) { can.current.scroll(1); if (can.current.scroll()<2) { can.onaction.selectLine(can, can.current.next()) } }),
			y: shy("向下滚屏", function(can) { can.current.scroll(-1); if (can.current.scroll()>can.current.window()-3) { can.onaction.selectLine(can, can.current.prev()) } }),
			f: shy("向下翻页", function(can, count) { can.current.scroll(can.current.window()) }),
			b: shy("向上翻页", function(can, count) { can.current.scroll(-can.current.window()) }),
			r: shy("刷新页面", function(can) { can.user.reload(true) }),
		},
		insert_ctrl: {
			a: shy("光标行首", function(can, target) { for (var i = 0; i < target.value.length; i++) { if (target.value[i] != lex.TB) { break } } can.onkeymap.cursorMove(target, i, 0), can.onkeymap.prevent(event) }),
			e: shy("光标行尾", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, 0, -1) }),
			b: shy("光标左移", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, -1) }),
			f: shy("光标右移", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, 1) }),
			d: shy("删除字符", function(can, target) { can.user.isWindows && can.onkeymap.deleteText(target, target.selectionStart, 1) }),
		},
		insert: {
			Escape: shy("退出编辑", function(can) { can.onkeymap._normal(can), can.ui.current._keylist = [] }),
			ArrowUp: shy("光标上移", function(can, target) { can.onkeymap.cursorUp(can, target) }),
			ArrowDown: shy("光标下移", function(can, target) { can.onkeymap.cursorDown(can, target) }),
			Backspace: shy("删除字符", function(event, can, target) { if (target.selectionStart > 0 || !can.current.prev()) { return } can.onkeymap.prevent(event)
				var rest = can.current.text(); can.onaction.selectLine(can, can.current.prev()), can.onaction.deleteLine(can, can.current.next())
				var text = can.current.text(); can.ui.current.value = text+rest, can.onkeymap.cursorMove(target, 0, text.length)
			}),
			Tab: shy("添加缩进", function(event, can) { can.onkeymap.insertText(can.ui.current, lex.TB), can.onkeymap.prevent(event) }),
			Enter: shy("插入换行", function(can, target) {
				var rest = can.onkeymap.deleteText(target, target.selectionEnd).trimLeft(), text = can.ui.current.value
				var left = text.substr(0, text.indexOf(text.trimLeft()))||(text.trimRight() == ""? text: "")
				var line = can.onaction.selectLine(can), next = rest; for (var i = line; i < can.db.max; i++) { next += can.onexport.text(can, can.onaction._getLine(can, i)).trimLeft(); if (next != "") { break } }
				function deep(text) { var deep = 0; for (var i = 0; i < text.length; i++) { if (text[i] == lex.TB) { deep += 4 } else if (text[i] == lex.SP) { deep++ } else { break } } return deep }
				text.trim() && can.core.List(["{}", "[]", "()", "``"], function(item) { if (can.base.endWith(text, item[0])) {
					if (can.base.beginWith(next, item[1])) {
						can.onaction.insertLine(can, left+rest, can.current.next()), rest = ""
					} else if (deep(text) >= deep(can.onexport.text(can, can.onaction._getLine(can, line+1))) && rest == "") {
						can.onaction.insertLine(can, left+item[1], can.current.next())
					} left += lex.TB
				} else if (can.base.beginWith(rest, item[1])) { left = left.slice(0, -1) }})
				var line = can.onaction.insertLine(can, left+rest, can.current.next())
				can.current.text(text.trimRight()||text), can.onaction.selectLine(can, line), can.onkeymap._insert(event, can, 0, left.length)
			}),
		},
	}, _engine: {},
})
