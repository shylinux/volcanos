Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
		can.undo = [], can.redo = []
		can.require(["inner.js"], function(can) { can.onimport.inner_init(can, msg, function() {
			can.page.ClassList.add(can, can._fields, "inner")
			can.onkeymap._build(can), can.onimport._input(can), can.onkeymap._plugin({}, can), can.base.isFunc(cb) && cb(msg)
		}, target) }, function(can, name, sub) { name == chat.ONIMPORT && (can.onimport.inner_init = sub._init)
			if (name == chat.ONACTION) { can._trans = can.base.Copy(can._trans||{}, sub._trans) }
			if (name == chat.ONKEYMAP) {
				can.base.Copy(can.onkeymap._mode, sub._mode)
				can.core.Item(can.onkeymap._mode.normal, function(k, v) {
					if (!sub._mode.plugin[k]) { sub._mode.plugin[k] = v }
				})
				can.core.Item(sub._mode.plugin, function(k, v) {
					if (!can.onkeymap._mode.normal[k]) { can.onkeymap._mode.normal[k] = v }
				})
			}
		})
	},
	_input: function(can) {
		var ui = can.page.Append(can, can.ui.content.parentNode, [
			{view: ["current", html.INPUT], spellcheck: false, onkeydown: function(event) { if (event.metaKey) { return }
				can.misc.Debug("key", event.key)
				can._keylist = can.onkeymap._parse(event, can, can.mode+(event.ctrlKey? "_ctrl": ""), can._keylist, can.ui.current)
				can.mode == "insert" && can.core.Timer(10, function() { can.current.text(can.ui.current.value) })
				can.mode == "normal" && can.Status("按键", can._keylist.join(""))
				can.mode == "normal" && can.onkeymap.prevent(event)
			}, onkeyup: function(event) { can.onaction._complete(event, can, can.ui.complete)

			}, onfocus: function(event) { can.onaction._complete(event, can, can.ui.complete)
				can.page.styleWidth(can, can.ui.current, can.ui.content.style.width)
			}, onclick: function(event) { can.onkeymap._insert(event, can)

			}, ondblclick: function(event) { var target = event.target
					return
					can.onaction.searchLine(event, can, target.value.slice(target.selectionStart, target.selectionEnd))
				},
			}, {view: ["complete"]},
		]); can.ui.current = ui.current, can.ui.complete = ui.complete
	},
}, [""])
Volcanos("onkeymap", {help: "键盘交互", list: [],
	_model: function(can, value) { can.Status("模式", can.mode = value)
		can.page.Modify(can, can.ui.complete, {className: "complete"+ice.SP+can.mode}), value
		return can.page.Modify(can, can.ui.current, {className: "current"+ice.SP+can.mode}), value
	},
	_plugin: function(event, can) { can.onkeymap._model(can, "plugin")
		can.ui.current.blur()
	},
	_normal: function(event, can) { can.onkeymap._model(can, "normal")
		can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
	},
	_insert: function(event, can) { can.onkeymap._model(can, "insert")
		can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
		can.onkeymap.prevent(event)
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
				can.current.text(text.trimRight()+" "+rest.trimLeft()), can.onaction.deleteLine(can, next)

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
			jk: function(event, can, target) { can.onkeymap._normal(event, can),
					can.onkeymap.deleteText(target, target.selectionStart-1, 1)
				can.current.text(can.ui.current.value)
			},
			Escape: function(event, can) { can.onkeymap._normal(event, can) },
			Tab: function(event, can) { 
				can.onkeymap.insertText(can.ui.current, "\t")
				can.onkeymap.prevent(event)
			},

			Enter: function(event, can, target) {
				var rest = can.onkeymap.deleteText(target, target.selectionEnd), text = can.ui.current.value
				var indent = (text.substr(0, text.indexOf(text.trimLeft()))+(text.endsWith("}")?"\t":""))||(text.trimRight() == ""? text: "")
				var line = can.onaction.insertLine(can, indent+rest.trimLeft(), can.current.next())
				can.current.text(text.trimRight()||text), can.onaction.selectLine(event, can, line)
				can.onkeymap.cursorMove(can, can.ui.current, indent.length, 0)
			},
			Backspace: function(event, can, target) {
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
			ArrowUp: function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) },
			ArrowDown: function(event, can) { can.onaction.selectLine(event, can, can.current.next()) },
		},
	}, _engine: {},
})
Volcanos("onaction", {help: "控件交互", list: [nfs.SAVE, code.AUTOGEN, code.COMPILE, "script", chat.WEBSITE, "dream", "publish"],
	save: function(event, can) { var msg = can.request(event, {content: can.onexport.content(can)})
		can.run(event, [ctx.ACTION, nfs.SAVE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.project(can, can.Option(nfs.PATH))
			can.user.toastSuccess(can)
		}, true)
	},
	autogen: function(event, can, button) { var meta = can.Conf(), msg = can.request(event, {_handle: ice.TRUE})
		can.user.input(event, can, meta.feature[button], function(ev, btn, data, list, args) {
			can.run(event, [ctx.ACTION, button].concat(args), function(msg) {
				can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(nfs.FILE))
				can.onimport.project(can, can.Option(nfs.PATH))
			}, true)
		})
	},
	compile: function(event, can, button) { var msg = can.ui.search.request(event, {_handle: ice.TRUE, _toast: "编译中..."}, can.Option())
		can.run(event, [ctx.ACTION, button], function(msg) {
			if (msg.Length() == 0) { var toast = can.user.toast(can, "重启中...", "", -1)
				can.core.Timer(5000, function() { toast.close(), can.onaction["展示"]({}, can) })
			} else {
				can.ui.search._show(msg)
			}
		}, true)
	},
	_complete: function(event, can, target) {
		var pre = event.target.value.slice(0, event.target.selectionStart)
		var end = event.target.value.slice(event.target.selectionStart)
		var key = can.core.Split(pre, "\t ", "\t ").pop()||""
		var word = can.core.Split(key, "\t ", ".").pop()||""
		key = can.base.trimSuffix(key, word)
		key = can.base.trimSuffix(key, ".")

		function update(target) { can.request(event, {pre: pre, end: end, key: key, word: word, file: can.Option(nfs.FILE)})
			can.run(event, [ctx.ACTION, "complete"], function(msg) {
				can.page.Appends(can, target, [{view: ["pre", html.DIV, pre]}])
				msg.Length() == 0 && pre == "" && can.core.List(can.core.Value(can.onsyntax[can.parse], "prepare.keyword"), function(k) {
					msg.Push(mdb.NAME, k)
				})
				can.onappend.table(can, msg, function(value, key, index) {
					return {text: [value, html.TD], onclick: function(event) {
						var left = can.ui.current.value.slice(0, event.target.selectionStart)+value
						can.ui.current.value = can.current.text(left+can.ui.current.value.slice(event.target.selectionEnd))
						can.ui.current.setSelectionRange(left.length, left.length)
						can.ui.current.focus(), can.ui.content.scrollBy(-10000, 0)
					}}
				}, target)
			}, true)
		}
		function select() {
			return can.page.Select(can, target, html.TR, function(tr) {
				if (!can.page.ClassList.set(can, tr, html.HIDE, can.page.Select(can, tr, html.TD, function(td) {
					if (td.innerText.indexOf(word) > -1) { return td }
				}).length == 0)) { return tr }
			}).length > 0
		}

		switch (event.key) {
			case "Enter": can.onmotion.clear(can, target); break
			case ice.TB: update(target); break
			case ice.SP: update(target); break
			default: select() || update(target); break
		}
	},
	script: function(event, can, button) { var meta = can.Conf()
		can.request(event, {_handle: ice.TRUE, action: button, file: "hi/hi.js", text: `Volcanos("onimport", {help: "导入数据", list:[], _init: function(can, msg, cb, target) {
	msg.Echo("hello world")
	can.onappend.table(can, msg)
	can.onappend.board(can, msg)
}})`}, can.Option())
		can.user.input(event, can, meta.feature[button], function(ev, btn, data, list, args) {
			can.run(event, [ctx.ACTION, button].concat(args), function(msg) {
				can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(nfs.FILE))
				can.onimport.project(can, can.Option(nfs.PATH))
			}, true)
		})
	},
	website: function(event, can, button) { var meta = can.Conf()
		can.request(event, {_handle: ice.TRUE, action: button, file: "hi.zml", text: `
left
	username
	系统
		命令 index cli.system
		共享 index cli.qrcode
	代码
		趋势 index web.code.git.trend args icebergs action auto 
		状态 index web.code.git.status args icebergs
main
	
`.trim()}, can.Option())
		can.user.input(event, can, meta.feature[button], function(ev, btn, data, list, args) {
			can.run(event, [ctx.ACTION, button].concat(args), function(msg) {
				can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option(nfs.FILE))
				can.onimport.project(can, can.Option(nfs.PATH))
			}, true)
		})
	},
	publish: function(event, can, button) {
		can.run(event, [ctx.ACTION, button], function(msg) {
			can.user.toast(can, {
				title: "发布应用", duration: -1, width: -300,
				content: msg.Result(), action: [cli.CLOSE],
			})
		})
	},

	_selectLine: function(event, can) {
		can.page.Select(can, can.current.line, "td.text", function(td) {
			can.current.line.appendChild(can.ui.current), can.page.Modify(can, can.ui.current, {style: kit.Dict(html.LEFT, td.offsetLeft-1, html.WIDTH, td.offsetWidth-12), value: td.innerText})
			can.current.line.appendChild(can.ui.complete), can.page.Modify(can, can.ui.complete, {style: kit.Dict(html.LEFT, td.offsetLeft-1, "margin-top", can.ui.current.offsetHeight+4)})
			if (event) { if (can.mode == "plugin") { can.onkeymap._insert(event, can) }
				can.ui.current.focus(), can.onkeymap.cursorMove(can, can.ui.current, 0, (event.offsetX)/13-1)
				can.ui.content.scrollLeft -= 10000
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
Volcanos("onexport", {help: "导出数据", list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})

