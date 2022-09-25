Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb) { can.onmotion.clear(can)
		can.onlayout._init(can)
		can.requireModules(["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
			var item = {hash: can.Option(mdb.HASH)}; msg.Table(function(value) { can.core.Value(item, value.key, value.value) })
			item.text && can.onmotion.delay(can, function() { can.onimport._input(can, item.text+ice.NL) })
			can.onimport._connect(can, item), can.onappend.tools(can, msg, function(sub) {
				sub._item_click = function(value, key) { can.onimport._input(can, value+ice.NL) }
			}), can.base.isFunc(cb) && cb(msg), can.onappend._status(can)
		})
	},
	_connect: function(can, item) { var term = new Terminal({tabStopWidth: 4, cursorBlink: true})
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon
		can.onmotion.delay(can, function() { fitAddon.fit() })
		term.loadAddon(new WebLinksAddon.WebLinksAddon())

		term.onTitleChange(function(title) { can.isCmdMode() && can.user.title(title) })
		term.onResize(function(size) { can.onimport._resize(can, size) })
		term.onData(function(data) { can.onimport._input(can, data) })
		term.onCursorMove(function() { can.onexport.term(can) })

		can._current = term, term._item = item
		term.open(can._output), term.focus()
	},
	_resize: function(can, size) {
		can.runAction(can.request({}, size, can._current._item), "resize", [], function() { can.onexport.term(can) })
	},
	_input: function(can, data) { if (!can._current) { return }
		can.runAction(can.request({}, can._current._item), "input", [btoa(data)], function() {})
	},
	grow: function(can, msg) { can._current.write(msg.Option(mdb.TEXT)) },
})
Volcanos(chat.ONLAYOUT, {help: "界面布局",
	_init: function(can) {
		can.page.style(can, can._output, html.HEIGHT, can.ConfHeight()+20, html.WIDTH, can.ConfWidth()+20, html.MAX_WIDTH, "")
		can.onmotion.delay(can, function() { can.page.style(can, can._output, html.HEIGHT, "", html.WIDTH, "") }, 500)
		can._current && can._current._fit.fit(), can.onexport.term(can)
	},
	cmd: function(can) { can._current && can.onimport._title(can, can._current._item.name), can.ConfWidth(can.ConfWidth()-10)
		can.Option(mdb.HASH) && can.Option(mdb.HASH) == can.misc.Search(can, mdb.HASH)? can.sup.onaction.full({}, can.sup): can.onlayout._init(can)
	},
})
Volcanos(chat.ONACTION, {help: "操作数据",
	refresh: function(event, can, button) { can.onlayout._init(can), can._current.focus() },
	"波浪线": function(event, can, button) { can.onimport._input(can, "~"), can._current.focus() },
	"反引号": function(event, can, button) { can.onimport._input(can, "`"), can._current.focus() },
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [mdb.TYPE, mdb.NAME, "rows", "cols", "cursorY", "cursorX"],
	term: function(can) { var term = can._current||{}, item = term._item; if (!item) { return }
		can.core.List(can.onexport.list, function(key) {
			can.Status(key, can.base.getValid(item[key], term[key], term.buffer.active[key], ""))
		}), can.Status(mdb.TYPE, item[mdb.TYPE]||""), can.Status(mdb.NAME, item[mdb.NAME]||"")
	},
})
