Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
		can.require(["inner.js"], function(can) { can.onimport.inner_init(can, msg, function() { can.undo = [], can.redo = []
			can.onkeymap._build(can), can.onimport._input(can), can.onkeymap._plugin({}, can), can.base.isFunc(cb) && cb(msg)

		}, target) }, function(can, name, sub) { name == chat.ONIMPORT && (can.onimport.inner_init = sub._init)
			if (name == chat.ONACTION) { can._trans = can.base.Copy(can._trans||{}, sub._trans) }
			if (name == chat.ONKEYMAP) { can.base.Copy(can.onkeymap._mode, sub._mode)
				can.core.Item(can.onkeymap._mode.normal, function(k, v) { sub._mode.plugin[k] || (sub._mode.plugin[k] = v) })
				can.core.Item(sub._mode.plugin, function(k, v) { can.onkeymap._mode.normal[k] || (can.onkeymap._mode.normal[k] = v) })
			}
		})
	},
	_input: function(can) {
		var ui = can.page.Append(can, can.ui.content.parentNode, [
			{view: ["current", html.INPUT], spellcheck: false, onkeydown: function(event) { if (event.metaKey) { return }
				if (event.ctrlKey && can.onaction._complete(event, can)) { return }
				can._keylist = can.onkeymap._parse(event, can, can.mode+(event.ctrlKey? "_ctrl": ""), can._keylist, can.ui.current)
				can.mode == "insert" && can.core.Timer(10, function() { can.current.text(can.ui.current.value) })
				can.mode == "normal" && can.Status("按键", can._keylist.join(""))
				can.mode == "normal" && can.onkeymap.prevent(event)
			}, onkeyup: function(event) { can.onaction._complete(event, can)

			}, onclick: function(event) { can.onkeymap._insert(event, can)

			}}, {view: ["complete"]},
		]); can.ui.current = ui.current, can.ui.complete = ui.complete
	},
}, [""])
Volcanos(chat.ONKEYMAP, {help: "键盘交互", list: [],
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
		// can._keylist = []
	},

	_mode: {
		normal_ctrl: {
			f: function(event, can, target, count) {
				var line = can.onaction.selectLine(event, can)+can.current.window()-3-can.current.scroll()
				return can.current.scroll(line), can.onaction.selectLine(event, can, line), true
			},
			b: function(event, can, target, count) {
				var line = can.onaction.selectLine(event, can)-can.current.window()+3
				return can.current.scroll(line), can.onaction.selectLine(event, can, line), true
			},
		},
		normal: {
			escape: function(event, can) { can.onkeymap._plugin(event, can) },
			ArrowLeft: function(event, can, target) { can.onkeymap.cursorMove(can, target, -1) },
			ArrowRight: function(event, can, target) { can.onkeymap.cursorMove(can, target, 1) },
			ArrowDown: function(event, can) { can.onaction.selectLine(event, can, can.current.next()) },
			ArrowUp: function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) },

			".": function(event, can, target) { var cb = can.redo.pop(); cb && cb() },
			u: function(event, can, target) { var cb = can.undo.pop(); cb && cb() },
			J: function(event, can, target) {
				var next = can.current.next(); if (!next) { return }
				var line = can.current.line, text = can.current.text()
				var rest = can.page.Select(can, next, "td.text")[0].innerText
				can.current.text(text.trimRight()+ice.SP+rest.trimLeft()), can.onaction.deleteLine(can, next)
				can.undo.push(function() { can.onaction.modifyLine(can, line, text), can.onaction.insertLine(can, rest, line.nextSibling) })
			},
			H: function(event, can, target) { can.onkeymap.cursorMove(can, target, 0, 0) },
			h: function(event, can, target) { can.onkeymap.cursorMove(can, target, -1) },
			l: function(event, can, target) { can.onkeymap.cursorMove(can, target, 1) },
			L: function(event, can, target) { can.onkeymap.cursorMove(can, target, 0, -1) },
			j: function(event, can) { can.onaction.selectLine(event, can, can.current.next()) },
			k: function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) },

			gg: function(event, can, target, count) { return can.onaction.selectLine(event, can, count), true },
			G: function(event, can, target, count) { return can.onaction.selectLine(event, can, count = count>1? count: can.max), true },
			zt: function(event, can, target, count) { return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true },
			zz: function(event, can, target, count) { return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true },
			zb: function(event, can, target, count) { return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true },

			i: function(event, can) { can.onkeymap._insert(event, can) },
			I: function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 0, 0) },
			a: function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 1) },
			A: function(event, can, target) { can.onkeymap._insert(event, can), can.onkeymap.cursorMove(can, target, 0, -1) },
			o: function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("{")?"\t":"")
				can.onkeymap._insert(event, can), can.onaction.selectLine(event, can, can.onaction.insertLine(can, text, can.current.next()))
				can.onkeymap.cursorMove(can, can.ui.current, 1000)
			},
			O: function(event, can) { var text = can.current.text()
				text = text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("}")?"\t":"")
				can.onkeymap._insert(event, can), can.onaction.selectLine(event, can, can.onaction.insertLine(can, text, can.current.line))
				can.onkeymap.cursorMove(can, can.ui.current, 1000)
			},

			yy: function(event, can, target, count) { can._last_text = can.current.text() },
			dd: function(event, can, target, count) { var text = can.current.text(), line = can.onaction._getLineno(can, can.current.line)
				can._last_text = can.current.text(), can.onaction.selectLine(event, can, can.onaction.deleteLine(can, can.current.line))
				can.undo.push(function() { can.onaction.insertLine(can, text, line), can.onaction.selectLine(event, can, line) })
				var callee = arguments.callee
				can.redo.push(function() { callee(event, can, target, count) })
			},
			p: function(event, can) {
				var line = can.onaction.insertLine(can, can._last_text, can.current.next())
				can.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(event, can, line-1) })
			},
			P: function(event, can) {
				var line = can.onaction.insertLine(can, can._last_text, can.current.line)
				can.undo.push(function() { can.onaction.deleteLine(can, line), can.onaction.selectLine(event, can, line+1) })
			},

			s: function(event, can) { can.onaction.save(event, can) },
			m: function(event, can) { can.onaction.autogen(event, can, "autogen") },
			c: function(event, can) { can.onaction.compile(event, can, "compile") },
		},
		insert: {
			jk: function(event, can, target) { can.onkeymap._normal(event, can)
				can.onkeymap.deleteText(target, target.selectionStart-1, 1)
				can.current.text(can.ui.current.value)
			},
			Escape: function(event, can) {
				if (event.key != "Escape") { return }
				can.onkeymap._normal(event, can)
			},
			Tab: function(event, can) {
				if (event.key != "Tab") { return }
				can.onkeymap.insertText(can.ui.current, "\t")
				can.onkeymap.prevent(event)
			},

			Enter: function(event, can, target) {
				if (event.key != "Enter") { return }
				var rest = can.onkeymap.deleteText(target, target.selectionEnd), text = can.ui.current.value
				var left = text.substr(0, text.indexOf(text.trimLeft()))||(text.trimRight() == ""? text: "")
				if (text.endsWith("{")) { can.onaction.insertLine(can, left+"}", can.current.next()), left += "\t" }
				if (text.endsWith("[")) { can.onaction.insertLine(can, left+"]", can.current.next()), left += "\t" }
				if (text.endsWith("(")) { can.onaction.insertLine(can, left+")", can.current.next()), left += "\t" }
				if (text.endsWith("`") && can.base.count(text, "`")%2==1) { can.onaction.insertLine(can, left+"`", can.current.next()) }

				var line = can.onaction.insertLine(can, left+rest.trimLeft(), can.current.next())
				can.current.text(text.trimRight()||text), can.onaction.selectLine(event, can, line)
				can.onkeymap.cursorMove(can, can.ui.current, left.length, 0)
			},
			Backspace: function(event, can, target) {
				if (event.key != "Backspace") { return }
				if (target.selectionStart > 0) { return }
				if (!can.current.prev()) { return }
				can.onkeymap.prevent(event)

				var rest = can.current.text()
				can.onaction.selectLine(event, can, can.current.prev())
				can.onaction.deleteLine(can, can.current.next())
				var pos = can.current.text().length

				can.ui.current.value = can.current.text()+rest
				can.onkeymap.cursorMove(can, can.ui.current, 0, pos)
			},
			ArrowUp: function(event, can) {
				if (event.key != "ArrowUp") { return }
				can.onaction.selectLine(event, can, can.current.prev())
			},
			ArrowDown: function(event, can) {
				if (event.key != "ArrowDown") { return }
				can.onaction.selectLine(event, can, can.current.next())
			},
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "控件交互", list: [nfs.SAVE, code.AUTOGEN, code.COMPILE, nfs.SCRIPT, chat.WEBSITE, web.DREAM, code.PUBLISH],
	_run: function(event, can, button, args, cb) {
		can.runAction(event, button, args, cb||function(msg) {
			can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(nfs.FILE))
			can.onimport.project(can, can.Option(nfs.PATH)), can.user.toastSuccess(can, button)
		})
	},
	_runs: function(event, can, button) { var meta = can.Conf(); can.request(event, {action: button})
		can.user.input(event, can, meta.feature[button], function(args) {
			can.onaction._run(event, can, button, args)
		})
	},
	save: function(event, can, button) { can.request(event, {file: can.Option(nfs.FILE), content: can.onexport.content(can)})
		can.runAction(event, nfs.SAVE, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function() {
			can.user.toastSuccess(can, button)
		})
	},
	autogen: function(event, can, button) { can.onaction._runs(event, can, button) },
	compile: function(event, can, button) { var toast0 = can.user.toastProcess(can, "编译中...")
		can.runAction(event, button, [], function(msg) { toast0.close()
			if (msg.Length() == 0) { var toast1 = can.user.toastProcess(can, "重启中...")
				can.core.Timer(3000, function() { toast1.close(), can.onaction["展示"]({}, can) })
			} else { can.ui.search._show(msg) }
		})
	},
	script: function(event, can, button) {
		can.request(event, {file: "hi/hi.js"})
		can.onaction._runs(event, can, button)
	},
	website: function(event, can, button) {
		can.request(event, {file: "hi.zml"})
		can.onaction._runs(event, can, button)
	},
	publish: function(event, can, button) {
		can.runAction(event, button, [], function(msg) { can.user.toastConfirm(can, msg.Result(), button) })
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
		can.request(event, {text: can.base.Format(list)})
		can.runAction(event, button)
	},
	_complete: function(event, can, target) { target = target||can.ui.complete
		if (event == undefined) { return }
		var pre = can.ui.current.value.slice(0, can.ui.current.selectionStart)
		var end = can.ui.current.value.slice(can.ui.current.selectionStart)
		var type = can.core.Split(pre).pop()||""
		var name = can.core.Split(type, "", ice.PT).pop()||""
		type = can.base.trimSuffix(type, name)
		type = can.base.trimSuffix(type, ice.PT)
		const PRE = "pre"

		function update(target) { can.request(event, {type: type, name: name, text: pre, file: can.Option(nfs.FILE)})
			can.runAction(event, "complete", [], function(msg) { can.ui.complete._msg = msg
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

		function filter() {
			return can.page.Select(can, target, [html.TBODY,  html.TR], function(tr) {
				if (!can.page.ClassList.set(can, tr, html.HIDE, can.page.Select(can, tr, html.TD, function(td) {
					if (td.innerText.toLowerCase().indexOf(can.base.trimSuffix((name == ice.PT? type: name).toLowerCase(), "(")) == 0) { return td }
				}).length == 0)) { return tr }
			}).length > (name == ice.PT? 1: 0)
		}

		function select(index, total) { index = (index+(total+1))%(total+1)
			if (index == total) { can.current.text(can.ui.current.value = can.ui.complete._msg.Option(PRE)) }
			can.page.Select(can, target, [html.TBODY, "tr:not(.hide)"], function(tr, i) { if (can.page.ClassList.set(can, tr, html.SELECT, i == index)) {
				can.current.text(can.ui.current.value = can.ui.complete._msg.Option(PRE)+can.page.Select(can, tr, html.TD)[0].innerText)
			} })
			return index
		}

		if (event.ctrlKey) {
			if (event.type == "keyup") {
				var total = can.page.Select(can, target, [html.TBODY, "tr:not(.hide)"]).length
				switch (event.key) {
					case "n": can.ui.complete._index = select(can.ui.complete._index+1, total); break
					case "p": can.ui.complete._index = select(can.ui.complete._index-1, total); break
					default: return false
				}
				return can.onkeymap.prevent(event)
			}
			return
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
					can.core.Timer(10, function() { can.onaction._complete(event, can) })
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
	insertLine: function(can, value, before) {
		var line = can.onaction.appendLine(can, value)
		before && can.ui.content.insertBefore(line, can.onaction._getLine(can, before))
		return can.onaction.rerankLine(can), can.onaction._getLineno(can, line)
	},
	deleteLine: function(can, line) { line = can.onaction._getLine(can, line)
		var next = line.nextSibling||line.previousSibling
		can.page.Remove(can, line), can.onaction.rerankLine(can)
		return next
	},
	modifyLine: function(can, line, value) {
		can.page.Select(can, can.ui.content, html.TR, function(item, index) {
			if (item != line && index+1 != line) { return }
			can.page.Select(can, item, "td.text", function(item) {
				can.page.Appends(can, item, [can.onsyntax._parse(can, value)])
			})
		})
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})
