Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.require(["inner.js"], function(can) { can.onimport._last_init(can, msg, function() {
		can.onengine.listen(can, "tabview.line.select", function(msg) { can.onaction._selectLine(can) })
		can.db.undo = [], can.db.redo = [], can.onimport._input(can), can.base.isFunc(cb) && cb(msg)
	}) }) },
	_input: function(can) { var ui = can.page.Append(can, can.ui.content.parentNode, [
 		{view: [code.CURRENT, html.INPUT], spellcheck: false, onkeydown: function(event) { can.onimport._value(can); if (event.metaKey) { return }
			can.db._keylist = can.onkeymap._parse(event, can, can.db.mode+(event.ctrlKey? "_ctrl": ""), can.db._keylist, can.ui.current)
			if (can.db.mode == mdb.NORMAL) { can.onkeymap.prevent(event) } if (can.db.mode == mdb.INSERT) { can.db._keylist = [] }
		}, onkeyup: function(event) { can.onimport._value(can); if (event.metaKey) { return } can.onkeymap._complete(event, can)
		}, onfocus: function(event) { can.current.line.appendChild(can.ui.complete)
		}, onclick: function(event) { can.onkeymap._insert(event, can)
			if (event.metaKey) { var target = event.target, begin = target.selectionStart, end = begin, reg = /[a-zA-Z0-9]/
				for (begin; begin > 0; begin--) { if (!reg.test(target.value.slice(begin, begin+1))) { begin++; break } }
				for (end; end < target.value.length; end++) { if (!reg.test(target.value.slice(end, end+1))) { break } }
				can.onaction.searchLine(event, can, target.value.slice(begin, end))
			}
		}}, {view: [[code.COMPLETE]]},
	]); can.ui.current = ui.current, can.ui.complete = ui.complete, can.onkeymap._plugin(can) },
	_value: function(can) { can.onimport.__tabPath(can, true), can.db.mode == mdb.INSERT && can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) }) },
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) {
		var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
			zone._icon(kit.Dict(
				web.REFRESH, function(event) { show(target, zone, path) },
				mdb.CREATE, function(event, button) { can.onaction.module(event, can, nfs.MODULE) },
			)), zone._total(msg.Length()), can.onmotion.clear(can, target)
			var cache, list = can.core.List(msg.Table(), function(item) { if (path == args[0] && args[1].indexOf(item.path) == 0) { item.expand = true }
				item._init = function(target) { item._remove = function() { can.page.Remove(can, target.parentNode), delete(cache[item.path]) }
					if (msg.result && msg.result.indexOf(item.path) > -1) { can.onmotion.delay(can, function() { can.onappend.style(can, mdb.MODIFY, target.parentNode)
						for (var _target = target.parentNode; _target != zone._target; _target = _target.parentNode) { _target.previousSibling && can.onappend.style(can, mdb.MODIFY, _target.previousSibling) }
					}) }
				}, item._menu = shy(kit.Dict(
					mdb.CREATE, function(event, button) { can.onaction.script(can.request(event, {path: path}), can, nfs.SCRIPT) },
					nfs.TRASH, function(event, button) { can.runAction(event, nfs.TRASH, [path+item.path], function(msg) { show(target, zone, path) }) },
				)); return item
			}); cache = can.onimport.tree(can, list, nfs.PATH, nfs.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target, cache)
		}, true) } if (path.length == 1) { return show(target, zone, path[0]) } can.page.Remove(can, zone._action)
		can.onimport.zone(can, can.core.List(path, function(path) { return kit.Dict(mdb.NAME, path, path == args[0]? chat._INIT: chat._DELAY_INIT, function(target, zone) { show(target, zone, path) }) }), target)
	},
	repos: function(can, target, zone) { can.onimport._zone(can, zone, web.CODE_GIT_STATUS, function(sub, msg) {
		sub.onexport.record = function(sub, value, key, item) { can.onimport.tabview(can, item.path, item.file) }
		zone._icon(kit.Dict(
			web.REFRESH, function(event) { sub.Update(event) },
			code.PULL, function(event) { sub.runAction(event, code.PULL) },
			code.PUSH, function(event) { sub.runAction(event, code.PUSH) },
			"=", function() { can.onimport.tabview(can, "", sub._index, ctx.INDEX) },
		))
	}) },
	space: function(can, target, zone) { can.onimport._zone(can, zone, web.DREAM, function(sub, msg) {
		sub.onimport._open = function(_, msg, arg) {
			var link = can.misc.ParseURL(can, arg); if (link.pod) { can.onimport.tabview(can, "", link.pod, web.SPACE), sub.Update(); return }
			can.onimport.tabview(can, "", arg, web.SPACE)
		}
		sub.onexport.record = function(sub, value, key) { can.onimport.tabview(can, "", value, web.SPACE) }
		can.page.Select(can, sub._output, html.DIV_ITEM, function(target, index) { can.onappend.style(can, msg.status[index], target) })
	}) },
	favor: function(can, target, zone) { can.onimport._zone(can, zone, web.CHAT_FAVOR, function(sub, msg) {
		sub.onexport.record = function(sub, value, key, item, event) { switch (item.type) {
			case nfs.FILE: var ls = can.onexport.split(can, item.text); can.onimport.tabview(can, ls[0], ls[1]); break
			case mdb.LINK: can.onimport.tabview(can, "", item.text, web.SPACE); break
			case ctx.INDEX: can.onimport.tabview(can, "", item.text, ctx.INDEX); break
			case ssh.SHELL: can.onimport.tabview(can, "", [web.CODE_XTERM, item.text].join(mdb.FS), ctx.INDEX); break
			case cli.OPENS: can.runAction(event, cli.OPENS, [item.text]); break
		} }
	}) },
})
Volcanos(chat.ONACTION, {list: ["编译", "变更", "源码", "终端", "导图", "计划", "收藏", "首页"],
	_run: function(event, can, button, args, cb) { can.runAction(event, button, args, cb||function(msg) {
		can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE)), can.user.toastSuccess(can, button)
		can.ui.zone.source.refresh()
	}) },
	_runs: function(event, can, button, cb) { var meta = can.Conf(); can.request(event, {action: button})
		can.user.input(event, can, meta.feature[button], function(args) { can.onaction._run(event, can, button, args, cb) })
	},
	save: function(event, can, button) { can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		function imports(str) { var block = "", count = 0; can.core.List(str.split(lex.NL), function(item) {
			if (can.base.beginWith(item, "import (")) { block = can.core.Split(item)[0]; return }
			if (can.base.beginWith(item, ")")) { block = ""; return }
			if (can.base.beginWith(item, "import ")) { count++; return }
			if (block == "import") { count++ }
		}); return count }
		can.onaction._run(event, can, button, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			if (can.onexport.parse(can) == nfs.GO) { var line = can.onaction.selectLine(can); can.onmotion.clear(can, can.ui.content)
				can.ui.content._max = 0, can.core.List(msg.Result().split(lex.NL), function(item) { can.onaction.appendLine(can, item) })
				can.onaction.selectLine(can, line+imports(msg.Result())-imports(msg.Option(nfs.CONTENT)))
			} can.user.toastSuccess(can, button, can.Option(nfs.PATH)+can.Option(nfs.FILE))
		})
	},
	trash: function(event, can, button) { can.onaction._run(event, can, button, [can.Option(nfs.PATH)+can.Option(nfs.FILE)], function() { can._msg._tab._close() }) },
	script: function(event, can, button) { can.onaction._runs(event, can, button) },
	module: function(event, can, button) { can.onaction._runs(event, can, button) },
	compile: function(event, can, button) { can.runAction(can.request(event, {_toast: "编译中..."}), button, [], function(msg) { can.ui.search && can.ui.search.hidden()
		if (msg.Length() > 0 || msg.Result()) { return can.onimport.exts(can, "inner/search.js", function(sub) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)), sub.select() }) }
		var toast = can.user.toastProcess(can, "重启中..."); can.onmotion.delay(can, function() { toast.close(), can.user.toastSuccess(can) }, 3000)
	}) },
	"命令": function(event, can) {
		can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(list) { can.onimport.tabview(can, "", list[0]+(list[1]? mdb.FS+list[1]: ""), ctx.INDEX) })
	},
	"插件": function(event, can) { can.user.input(event, can, [ctx.INDEX], function(list) { var sub = can.db.toolkit[list[0]]; if (sub) { sub.select(); return }
		can.onimport.toolkit(can, {index: list[0]}, function(sub) { can.db.toolkit[list[0]] = sub.select() })
	}) },
	"扩展": function(event, can) { can.user.input(can.request(event, {action: "extension"}), can, ["url"], function(list) {
		var sub = can.db.toolkit[list[0]]; sub? sub.select(): can.onimport.exts(can, list[0])
	}) },
	"编译": function(event, can) { can.onaction.compile(event, can, code.COMPILE) },
	// "变更": function(event, can) { can.onimport.tabview(can, "", [web.CODE_GIT_REPOS, can.core.Split(can.Option(nfs.PATH), nfs.PS).pop(), nfs.MASTER, "index", can.Option(nfs.FILE)].join(mdb.FS), ctx.INDEX) },
	"变更": function(event, can) { can.onimport.tabview(can, "", web.CODE_GIT_STATUS, ctx.INDEX) },
	"源码": function(event, can) { can.onimport.tabview(can, "", web.CODE_GIT_REPOS, ctx.INDEX) },
	"终端": function(event, can) { can.onimport.tabview(can, "", web.CODE_XTERM, ctx.INDEX) },
	"导图": function(event, can) { can.onimport.tabview(can, "", web.WIKI_DRAW, ctx.INDEX) },
	"计划": function(event, can) { can.onimport.tabview(can, "", web.TEAM_PLAN, ctx.INDEX) },
	"收藏": function(event, can) { can.onimport.tabview(can, "", web.CHAT_FAVOR, ctx.INDEX) },
	"首页": function(event, can) { can.onimport.tabview(can, "", location.origin+nfs.PS+(can.misc.Search(can, log.DEBUG) == ice.TRUE? "?debug=true": ""), web.SPACE) },
	insertLine: function(can, value, before) { var line = can.onaction.appendLine(can, value); before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before)); return can.onaction.rerankLine(can), can.onexport.line(can, line) },
	deleteLine: function(can, line) { line = can.onaction._getLine(can, line); var next = line.nextSibling||line.previousSibling; return can.page.Remove(can, line), can.onaction.rerankLine(can), next },
	_selectLine: function(can) { can.page.Select(can, can.current.line, "td.text", function(td) { var target = can.ui.current; target.value = td.innerText
		can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, td.offsetLeft-1, html.TOP, td.offsetTop,
			html.WIDTH, can.base.Min(td.offsetWidth, can.ui.content.offsetWidth-can.page.Select(can, can.current.line, "td.line")[0].offsetWidth))
		can.db.mode == mdb.NORMAL && can.onkeymap._normal(can)
		if (can.ui.content._root) { can.onmotion.select(can, can.ui.content.parentNode, "*", can.ui.content) }
	}) },
})
Volcanos(chat.ONKEYMAP, {
	scrollHold: function(can, count, begin) { var scroll = can.ui.content.scrollLeft; can.ui.current.focus(), count != undefined && can.onkeymap.cursorMove(can.ui.current, count, begin == undefined? count: begin), can.ui.content.scrollLeft = scroll },
	cursorDown: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.next()), can.onkeymap.cursorMove(target, 0, p) },
	cursorUp: function(can, target) { var p = can.onkeymap.cursorMove(target); can.onaction.selectLine(can, can.current.prev()), can.onkeymap.cursorMove(target, 0, p) },
	_model: function(can, value) { can.db.mode = value, can.onimport.__tabPath(can, true), can.core.List([mdb.PLUGIN, mdb.NORMAL, mdb.INSERT], function(item) { can.page.ClassList.del(can, can.ui.content, item) }), can.page.ClassList.add(can, can.ui.content, value) },
	_plugin: function(can) { can.onkeymap._model(can, mdb.PLUGIN), can.ui.current.blur() },
	_normal: function(can) { can.onkeymap._model(can, mdb.NORMAL), can.onkeymap.scrollHold(can) },
	_insert: function(event, can, count, begin) { can.onkeymap._model(can, mdb.INSERT), can.onkeymap.scrollHold(can, count, begin), can.onkeymap.prevent(event) },
	_complete: function(event, can, target) { if (event == undefined || event.type == "click") { return } target = target||can.ui.complete
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart), key = can.core.Split(pre, "\t .[]", lex.SP).pop()||"", end = can.ui.current.value.slice(can.ui.current.selectionStart)
		function update() { target._pre = pre, target._end = end, target._index = -1
			can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, can.ui.current.offsetLeft, html.MARGIN_TOP, can.user.isChrome? can.current.line.offsetHeight: 5)
			can.runAction(can.request(event, {text: pre}, can.Option()), code.COMPLETE, [], function(msg) { can.page.Appends(can, target, [{view: [lex.PREFIX, html.DIV, pre]}])
				var parse = can.onsyntax[can.onexport.parse(can)]; can.core.CallFunc(can.core.Value(parse, code.COMPLETE), [event, can, msg, target, pre, key])
				can.core.Item(can.core.Value(parse, code.KEYWORD), function(key, value) { msg.Push(mdb.NAME, key) })
				can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) { change(value) }} }, target)
				can.page.style(can, target, html.MAX_HEIGHT, can.ui.content.offsetHeight-(can.current.line.offsetTop-can.ui.content.scrollTop)-can.current.line.offsetHeight)
				can.onmotion.toggle(can, target, true)
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
			case "[":
			case "(":
			case "{": update(); break
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
			
			Escape: shy("切换模式", function(event, can) { can.onkeymap._plugin(can) }),
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
		},
		normal_ctrl: {
			e: shy("向下滚屏", function(can) { can.current.scroll(1) }),
			y: shy("向上滚屏", function(can) { can.current.scroll(-1) }),
			f: shy("向下翻页", function(can, count) { var line = can.onaction.selectLine(can)+can.current.window()-3-can.current.scroll(); return can.current.scroll(line), can.onaction.selectLine(can, line), true }),
			b: shy("向上翻页", function(can, count) { var line = can.onaction.selectLine(can)-can.current.window()+3; return can.current.scroll(line), can.onaction.selectLine(can, line), true }),
			r: shy("刷新页面", function(can) { can.user.reload(true) }),

			v: shy("左右分屏", function(can) { can.onlayout.vsplit(can) }),
			s: shy("上下分屏", function(can) { can.onlayout.split(can) }),
			x: shy("关闭文件", function(can) { can.onlayout.close(can) }),
			o: shy("关闭其它", function(can) { can.onlayout.only(can) }),
		},
		insert_ctrl: {
			a: shy("光标行首", function(can, target) { for (var i = 0; i < target.value.length; i++) { if (target.value[i] != lex.TB) { break } } can.onkeymap.cursorMove(target, i, 0), can.onkeymap.prevent(event) }),
			e: shy("光标行尾", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, 0, -1) }),
			b: shy("光标左移", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, -1) }),
			f: shy("光标右移", function(can, target) { can.user.isWindows && can.onkeymap.cursorMove(target, 1) }),
			d: shy("删除字符", function(can, target) { can.user.isWindows && can.onkeymap.deleteText(target, target.selectionStart, 1) }),
		},
		insert: {
			Escape: shy("退出编辑", function(event, can) { can.onkeymap._normal(can) }),
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
