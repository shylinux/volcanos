Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.require(["inner.js"], function(can) { can.onimport.inner_init(can, msg, function() { can.undo = [], can.redo = []
			can.onkeymap._build(can), can.onkeymap._plugin({}, can)
			can.base.isFunc(cb) && cb(msg)
		}, target) } , function(can, name, sub) { name == chat.ONIMPORT && (can.onimport.inner_init = sub._init)
		can.page.ClassList.add(can, can._fields, "inner")
		can.page.ClassList.add(can, can._fields, "vimer")
			if (name == chat.ONACTION) { can._trans = can.base.Copy(can._trans||{}, sub._trans) }
			if (name == chat.ONKEYMAP) { can.core.Item(sub._mode, function(mode, value) {
				var list = can.onkeymap._mode[mode] = can.onkeymap._mode[mode]||{}
				can.core.Item(value, function(key, cb) { list[key] = list[key]||cb })
			}) }
		})
	},
	_input: function(can) {
		var ui = can.page.Append(can, can.ui.content.parentNode, [
			{view: ["current", html.INPUT], spellcheck: false, onkeydown: function(event) { if (event.metaKey) { return }
				if (event.ctrlKey && can.onaction._complete(event, can)) { return }
				can._keylist = can.onkeymap._parse(event, can, can.mode+(event.ctrlKey? "_ctrl": ""), can._keylist, can.ui.current)
				can.mode == "insert" && can.onmotion.delay(can, function() { can.current.text(can.ui.current.value) }, 10)
				can.mode == "normal" && can.Status("按键", can._keylist.join(""))
				can.mode == "normal" && can.onkeymap.prevent(event)
			}, onkeyup: function(event) { can.onaction._complete(event, can)

			}, onclick: function(event) { can.onkeymap._insert(event, can)

			}}, {view: ["complete"]},
		]); can.ui.current = ui.current, can.ui.complete = ui.complete
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "导航索引", 
	source: function(can, target, zone, path) { var total = 0
		function show(path, target) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [ice.PWD], function(msg) { var list = msg.Table()
			can.core.List(list, function(item) { if (can.Option(nfs.FILE).indexOf(item.path) == 0) { item.expand = true }
				item._init = function(target) { target.onmouseenter = function(event) { can.user.carteRight(event, can, {
					"trash": function() { can.onaction._run(event, can, nfs.TRASH, [can.base.Path(path, item.path)]) },
					_engine: function(event, can, button) { can.onaction[button](event, can, button) },
				}, ["trash"]) } }
			})
			can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) {
				can.onimport.tabview(can, path, item.path) // 显示文件
			}, target), can.Status("文件数", total += msg.Length())
			can.page.Modify(can, zone._search, {placeholder: "search in "+total+" item"})
		}, true) } if (path.length == 1) { return show(path[0], target) }

		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target) { show(path, target) }} }), target)
		can.onmotion.delay(can, function() { target.previousSibling.innerHTML = "" })
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return total++, {index: can.base.trimPrefix(key, "can.")} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys("can", item.index), ctx.INDEX) // 显示插件
		}, target)
		can.page.Modify(can, zone._search, {placeholder: "search in "+total+" item"})
	},
	module: function(can, target, zone) {
		can.runAction(can.request({}, {fields: ctx.INDEX}), ctx.COMMAND, [mdb.SEARCH, ctx.COMMAND], function(msg) {
			can.page.Modify(can, zone._search, {placeholder: "search in "+msg.Length()+" item"})
			can.onimport.tree(can, msg.Table(), ctx.INDEX, ice.PT, function(event, item) {
				can.onimport.tabview(can, can.Option(nfs.PATH), item.index, ctx.INDEX) // 显示模块
			}, target)
		})
	},
	dream: function(can, target, zone) {
		var call = arguments.callee
		can.runAction({}, ice.RUN, [web.DREAM], function(msg) {
			can.page.Modify(can, zone._search, {placeholder: "search in "+msg.Length()+" item"})
			msg.Table(function(item) {
				function carte(event) {
					var list = []; switch (item.status) {
						case "start": list = ["open", "stop"]; break
						case "stop": list = ["start", "trash"]; break
					}
					can.user.carteRight(event, can, {}, list, function(event, action) {
						can.runAction(can.request({}, item), ice.RUN, [web.DREAM, ctx.ACTION, action], function(msg) {
							can.onmotion.clear(can, target), call(target)
						})
					})
				}

				var color = item.status == "start"? "": "gray"
				can.page.Append(can, target, [{view: html.ITEM, list: [{text: [item.name, html.DIV], style: {color: color}, onmouseenter: carte}], onclick: function() {
					can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(can.misc.Search(can, "pod"), item.name), web.DREAM) // 显示空间
				}}])
			})
		})
		// _menu: shy("", {
		// 	"create": function(event, can, button) { can.onaction.dream(event, can, "dream") },
		// 	"refresh": function(event, can, button) { can.ui.dreams.refresh() },
		// 	"publish": function(event, can, button) { can.runAction(event, button, [], function(msg) { can.user.toastConfirm(can, msg.Result(), button) }) },
		// }, ["create", "refresh", "publish"], function() {})
	},
	xterm: function(can, target, zone) {
		can.runAction({}, ice.RUN, [code.XTERM], function(msg) {
			can.page.Modify(can, zone._search, {placeholder: "search in "+msg.Length()+" item"})
			msg.Table(function(item) {
				can.onimport.item(can, item, function(event) {
					can.onimport.tabview(can, ctx.COMMAND, code.XTERM, item.hash) // 显示模块
				}, function(event) {

				}, target)
			})
		})
	},
})
Volcanos(chat.ONKEYMAP, {help: "键盘交互",
	_model: function(can, value) { can.Status("模式", can.mode = value)
		can.page.styleClass(can, can.ui.current, ["current", can.mode]), value
		can.page.styleClass(can, can.ui.complete, ["complete", can.mode]), value
	},
	_plugin: function(event, can) { can.onkeymap._model(can, "plugin")
		can.ui.current.blur()
	},
	_normal: function(event, can) { can.onkeymap._model(can, "normal")
		can.ui.current.focus()
	},
	_insert: function(event, can) { can.onkeymap._model(can, "insert")
		can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
		can.onkeymap.prevent(event)
	},

	_mode: {
		plugin: {
			t: shy("添加命令", function(event, can) { can.onaction["添加"](event, can) }),
			p: shy("添加插件", function(event, can) { can.onaction["插件"](event, can) }),
			e: shy("添加扩展", function(event, can) { can.onaction["扩展"](event, can) }),

			i: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
			n: shy("命令模式", function(event, can) { can.onkeymap._normal(event, can) }),
			":": shy("底行模式", function(event, can) { can.onimport.toolkit(can, {index: "cli.system"}, function(sub) { can.toolkit["cli.system"] = sub.select() }) }),

			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, "save") }),
			d: shy("创建空间", function(event, can) { can.onaction.dream(event, can, "dream") }),
			m: shy("添加模块", function(event, can) { can.onaction.autogen(event, can, "autogen") }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, "compile") }),
		},
		normal_ctrl: {
			f: shy("向下翻页", function(event, can, target, count) {
				var line = can.onaction.selectLine(event, can)+can.current.window()-3-can.current.scroll()
				return can.current.scroll(line), can.onaction.selectLine(event, can, line), true
			}),
			b: shy("向上翻页", function(event, can, target, count) {
				var line = can.onaction.selectLine(event, can)-can.current.window()+3
				return can.current.scroll(line), can.onaction.selectLine(event, can, line), true
			}),
		},
		normal: {
			Escape: shy("切换模式", function(event, can) { can.onkeymap._plugin(event, can) }),
			ArrowLeft: shy("光标左移", function(event, can, target) { can.onkeymap.cursorMove(can, target, -1) }),
			ArrowRight: shy("光标右移", function(event, can, target) { can.onkeymap.cursorMove(can, target, 1) }),
			ArrowDown: shy("光标下移", function(event, can) { can.onaction.selectLine(event, can, can.current.next()) }),
			ArrowUp: shy("光标上移", function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) }),

			".": shy("重复操作", function(event, can, target) { var cb = can.redo.pop(); cb && cb() }),
			u: shy("撤销操作", function(event, can, target) { var cb = can.undo.pop(); cb && cb() }),
			J: shy("合并两行", function(event, can, target) {
				var next = can.current.next(); if (!next) { return }
				var line = can.current.line, text = can.current.text()
				var rest = can.page.Select(can, next, "td.text")[0].innerText
				can.current.text(text.trimRight()+ice.SP+rest.trimLeft()), can.onaction.deleteLine(can, next)
				can.undo.push(function() { can.onaction.modifyLine(can, line, text), can.onaction.insertLine(can, rest, line.nextSibling) })
			}),

			H: shy("跳到行首", function(event, can, target) { can.onkeymap.cursorMove(can, target, 0, 0) }),
			h: shy("光标左移", function(event, can, target) { can.onkeymap.cursorMove(can, target, -1) }),
			l: shy("光标右移", function(event, can, target) { can.onkeymap.cursorMove(can, target, 1) }),
			L: shy("跳到行尾", function(event, can, target) { can.onkeymap.cursorMove(can, target, 0, -1) }),
			j: shy("光标下移", function(event, can) { can.onaction.selectLine(event, can, can.current.next()) }),
			k: shy("光标上移", function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) }),

			gg: shy("跳到某行", function(event, can, target, count) { return can.onaction.selectLine(event, can, count), true }),
			G: shy("跳到某行", function(event, can, target, count) { return can.onaction.selectLine(event, can, count = count>1? count: can.max), true }),
			zt: shy("将当前行拉到屏幕最上", function(event, can, target, count) { return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true }),
			zz: shy("将当前行拉到屏幕中间", function(event, can, target, count) { return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true }),
			zb: shy("将当前行拉到屏幕最下", function(event, can, target, count) { return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true }),

			i: shy("插入模式", function(event, can) { can.onkeymap._insert(event, can) }),
			I: shy("插入行首", function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 0, 0) }),
			a: shy("插入模式", function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 1) }),
			A: shy("插入行尾", function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 0, -1) }),
			o: shy("插入下一行", function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("{")?"\t":"")
				can.onkeymap._insert(event, can), can.onaction.selectLine(event, can, can.onaction.insertLine(can, text, can.current.next()))
				can.onkeymap.cursorMove(can, can.ui.current, 1000)
			}),
			O: shy("插入上一行", function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("}")?"\t":"")
				can.onkeymap._insert(event, can), can.onaction.selectLine(event, can, can.onaction.insertLine(can, text, can.current.line))
				can.onkeymap.cursorMove(can, can.ui.current, 1000)
			}),

			yy: shy("复制当前行", function(event, can, target, count) { can._last_text = can.current.text() }),
			dd: shy("剪切当前行", function(event, can, target, count) { var text = can.current.text(), line = can.onaction._getLineno(can, can.current.line)
				can._last_text = can.current.text(), can.onaction.selectLine(event, can, can.onaction.deleteLine(can, can.current.line))
				can.undo.push(function() { can.onaction.insertLine(can, text, line), can.onaction.selectLine(event, can, line) })
				var callee = arguments.callee
				can.redo.push(function() { callee(event, can, target, count) })
			}),
			p: shy("粘贴", function(event, can) {
				var line = can.onaction.insertLine(can, can._last_text, can.current.next())
				can.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(event, can, line-1) })
			}),
			P: shy("粘贴", function(event, can) {
				var line = can.onaction.insertLine(can, can._last_text, can.current.line)
				can.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(event, can, line+1) })
			}),

			s: shy("保存文件", function(event, can) { can.onaction.save(event, can, "save") }),
			m: shy("添加模块", function(event, can) { can.onaction.autogen(event, can, "autogen") }),
			c: shy("编译项目", function(event, can) { can.onaction.compile(event, can, "compile") }),
		},
		insert: {
			Escape: shy("退出编辑", function(event, can) { if (event.key != "Escape") { return }
				can.onkeymap._normal(event, can)
			}),
			Tab: shy("缩进", function(event, can) { if (event.key != "Tab") { return }
				can.onkeymap.insertText(can.ui.current, ice.TB), can.onkeymap.prevent(event)
			}),
			Backspace: shy("删除", function(event, can, target) { if (event.key != "Backspace") { return }
				if (target.selectionStart > 0) { return }
				if (!can.current.prev()) { return }
				can.onkeymap.prevent(event)

				var rest = can.current.text()
				can.onaction.selectLine(event, can, can.current.prev())
				can.onaction.deleteLine(can, can.current.next())
				var pos = can.current.text().length

				can.ui.current.value = can.current.text()+rest
				can.onkeymap.cursorMove(can, can.ui.current, 0, pos)
			}),
			Enter: shy("换行", function(event, can, target) { if (event.key != "Enter") { return }
				var rest = can.onkeymap.deleteText(target, target.selectionEnd), text = can.ui.current.value
				var left = text.substr(0, text.indexOf(text.trimLeft()))||(text.trimRight() == ""? text: "")
				if (text.endsWith("{")) { can.onaction.insertLine(can, left+"}", can.current.next()), left += ice.TB }
				if (text.endsWith("[")) { can.onaction.insertLine(can, left+"]", can.current.next()), left += ice.TB }
				if (text.endsWith("(")) { can.onaction.insertLine(can, left+")", can.current.next()), left += ice.TB }
				if (text.endsWith("`") && can.base.count(text, "`")%2==1) { can.onaction.insertLine(can, left+"`", can.current.next()) }

				var line = can.onaction.insertLine(can, left+rest.trimLeft(), can.current.next())
				can.current.text(text.trimRight()||text), can.onaction.selectLine(event, can, line)
				can.onkeymap.cursorMove(can, can.ui.current, left.length, 0)
			}),
			ArrowUp: shy("光标上移", function(event, can) { if (event.key != "ArrowUp") { return }
				can.onaction.selectLine(event, can, can.current.prev())
			}),
			ArrowDown: shy("光标下移", function(event, can) { if (event.key != "ArrowDown") { return }
				can.onaction.selectLine(event, can, can.current.next())
			}),
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "控件交互", list: [],
	// list: [nfs.SAVE, code.COMPILE, code.AUTOGEN, nfs.SCRIPT, chat.WEBSITE, web.DREAM],
	_run: function(event, can, button, args, cb) {
		can.runAction(event, button, args, cb||function(msg) {
			can.onimport.tabview(can, msg.Option(nfs.PATH)||can.Option(nfs.PATH), msg.Option(nfs.FILE)), can.ui.source.refresh()
			can.user.toastSuccess(can, button)
		})
	},
	_runs: function(event, can, button, cb) { var meta = can.Conf(); can.request(event, {action: button})
		can.user.input(event, can, meta.feature[button], function(args) {
			can.onaction._run(event, can, button, args, cb)
		})
	},
	save: function(event, can, button) { can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		can.onaction._run(event, can, button, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)])
	},
	compile: function(event, can, button) { var toast = can.user.toastProcess(can, "编译中...")
		can.runAction(can.request(event), button, [], function(msg) { toast.close()
			if (msg.Length() == 0) { var toast1 = can.user.toastProcess(can, "重启中...")
				can.onmotion.delay(can, function() { toast1.close(), can.onaction[cli.SHOW]({}, can) }, 5000)
			} else { can.ui.search._show(msg) }

		})
	},
	autogen: function(event, can, button) { can.onaction._runs(event, can, button, function(msg) {
		can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(cli.MAIN), "", function() {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(nfs.FILE), "", function() {
				can.ui.source.refresh()
			})
		}, true)
	}) },
	script: function(event, can, button) {
		can.onaction._runs(can.request(event, {file: can.base.trimSuffix(can.Option(nfs.FILE), can.base.Ext(can.Option(nfs.FILE)))+nfs.JS}), can, button)
	},
	website: function(event, can, button) {
		can.onaction._runs(can.request(event, {path: "src/", file: (can.base.trimSuffix(can.Option(nfs.FILE), can.base.Ext(can.Option(nfs.FILE)))+nfs.ZML).split("/").pop()}), can, button)
	},
	dream: function(event, can, button) {
		can.onaction._runs(can.request(event, {name: can.base.trimSuffix(can.Option(nfs.FILE).split(ice.PS).pop(), ice.PT+can.base.Ext(can.Option(nfs.FILE)))}), can, button, function(msg) { can.ui.dream.refresh()
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(can.misc.Search(can, "pod"), msg.Option(mdb.NAME)), web.DREAM) // 显示空间
			can.user.toastSuccess(can)
		})
	},
	xterm: function(event, can, button) {
		can.onaction._runs(can.request(event), can, button, function(msg) { can.ui.xterm.refresh()
			can.onimport.tabview(can, ctx.COMMAND, code.XTERM, msg.Result())
			can.user.toastSuccess(can)
		})
	},
	"添加": function(event, can) { can.user.input(event, can, [ctx.INDEX], function(list) { can.onimport.tabview(can, can.Option(nfs.PATH), list[0], ctx.INDEX) }) },
	"插件": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(list) {
			var sub = can.toolkit[list[0]]; if (sub) { sub.select(); return }
			can.onimport.toolkit(can, {index: list[0]}, function(sub) { can.toolkit[list[0]] = sub.select() })
		})
	},
	"扩展": function(event, can) {
		can.user.input(event, can, ["url"], function(list) {
			var sub = can.extentions[list[0]]; if (sub) { sub.select(); return }
			can.onimport.exts(can, list[0], function(sub) { can.extentions[list[0]] = sub.select() })
		})
	},

	listTags: function(event, can, button) { var list = []
		can.core.Item(can.request(event), function(key, value) { if (key.indexOf("_") == 0) { return }
			list.push({zone: "msg", type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
				path: "usr/volcanos/", file: "lib/misc.js", line: 1,
			})
		})
		can.core.List([can.base, can.core, can.misc, can.page, can.user, can.onengine, can.ondaemon, can.onappend, can.onlayout, can.onmotion, can.onkeymap], function(lib) {
			can.core.Item(lib, function(key, value) { if (key.indexOf("_") == 0 || !lib.hasOwnProperty(key)) { return }
				list.push({zone: lib._name, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
					path: "usr/volcanos/", file: lib._path, line: 1,
				})
			})
		})
		can.runAction(can.request(event, {text: can.base.Format(list)}), button)
	},
	_complete: function(event, can, target) { target = target||can.ui.complete
		if (event == undefined) { return }
		const PRE = "pre"
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart)
		var end = can.ui.current.value.slice(can.ui.current.selectionStart)

		var type = can.core.Split(pre).pop()||""
		var name = can.core.Split(type, "", ice.PT).pop()||""
		type = can.base.trimSuffix(type, name)
		type = can.base.trimSuffix(type, ice.PT)

		function update() { target._pre = pre, target._index = -1
			can.current.line.appendChild(target), can.page.style(can, target, html.LEFT, can.ui.current.offsetLeft-1, html.MARGIN_TOP, can.ui.current.offsetHeight+4)
			can.runAction(can.request(event, {text: pre}, can.Option()), "complete", [], function(msg) {
				can.page.Appends(can, target, [{view: [PRE, html.DIV, pre]}])
				can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) {
					var left = can.ui.current.value.slice(0, can.ui.current.selectionStart)+value
					can.current.text(can.ui.current.value = left+can.ui.current.value.slice(can.ui.current.selectionEnd))
					can.ui.current.focus(), can.ui.content.scrollLeft -= 10000, can.ui.current.setSelectionRange(left.length, left.length)
				}} }, target)
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
		return

		function update0(target) {
			can.request(event, {type: type, name: name, text: pre, file: can.Option(nfs.FILE)})
			can.runAction(event, "complete", [], function(msg) { target._msg = msg
				if (msg.Length() == 0 && can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) {
					msg.name = [], msg.type = [], msg.text = []
					can.core.Item(can.core.Value(window, type), function(k, v) {
						msg.Push(mdb.NAME, k), msg.Push(mdb.TYPE, typeof v)
						try { msg.Push(mdb.TEXT, v) } catch (e) { msg.Push(mdb.TEXT, "") }
					})
					msg.append = [mdb.NAME, mdb.TYPE, mdb.TEXT]
				}
				msg.Length() == 0 && pre.trim() == "" && can.core.Item(can.core.Value(can.onsyntax[can.parse], code.KEYWORD), function(k) {
					msg.Push(mdb.NAME, k)
				})
				
				can.page.Appends(can, target, [{view: [PRE, html.DIV, pre]}])
				can.onappend.table(can, msg, function(value, key, index) { return {text: [value, html.TD], onclick: function(event) {
					var left = can.ui.current.value.slice(0, can.ui.current.selectionStart)+value
					can.current.text(can.ui.current.value = left+can.ui.current.value.slice(can.ui.current.selectionEnd))
					can.ui.current.focus(), can.ui.content.scrollLeft -= 10000, can.ui.current.setSelectionRange(left.length, left.length)
				}} }, target)
			})
		}

		can.current.line.appendChild(can.ui.complete), can.page.style(can, can.ui.complete, html.LEFT, can.ui.current.offsetLeft-1, html.MARGIN_TOP, can.ui.current.offsetHeight+4)
		can.page.Select(can, target, "div.pre", function(item) { item.innerText = can.ui.complete._msg.Option(PRE)||pre })
		if (pre == "") { return update(target) }

		switch (event.key) {
			case html.ENTER: update(target); break
			case html.TAB: update(target); break
			case ice.SP: update(target); break
			case ice.PT: update(target); break
			default: filter() || update(target); break
		} can.ui.complete._index = -1
	},

	_selectLine: function(event, can) {
		can.page.Select(can, can.current.line, "td.text", function(td) { can.ui.current.value = td.innerText
			can.current.line.appendChild(can.ui.current), can.page.style(can, can.ui.current, html.LEFT, td.offsetLeft-1, html.WIDTH, can.ui.content.style.width)
			if (event) {
				if (event.type == "click" && can.mode != "insert") { can.onkeymap._insert(event, can)
					can.onmotion.delay(can, function() { can.onaction._complete(event, can) })
				}
				can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
				can.onkeymap.cursorMove(can, can.ui.current, 0, (event.offsetX)/12-1)
			}
		})
	},
	rerankLine: function(can, value) { can.max = 0
		can.page.Select(can, can.ui.content, html.TR, function(item, index) {
			can.max++, can.page.Select(can, item, "td.line", function(item) { item.innerText = index+1 })
		})
	},
	insertLine: function(can, value, before) { var line = can.onaction.appendLine(can, value)
		before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before))
		return can.onaction.rerankLine(can), can.onaction._getLineno(can, line)
	},
	deleteLine: function(can, line) { line = can.onaction._getLine(can, line)
		var next = line.nextSibling||line.previousSibling
		return can.page.Remove(can, line), can.onaction.rerankLine(can), next
	},
	modifyLine: function(can, line, value) {
		can.page.Select(can, can.ui.content, html.TR, function(item, index) {
			if (item != line && index+1 != line) { return }
			can.page.Select(can, item, "td.text", function(item) {
				item.innerHTML = can.onsyntax._parse(can, value)
			})
		})
	},
	favorLine: function(can, value) {
		can.user.input(event, can, [{name: "zone", value: "hi"}, {name: "name", value: "hello"}], function(data) {
			can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			])
		})
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})
