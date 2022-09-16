Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg) { can.onmotion.clear(can)
		can.requireModules(["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
			var item = {hash: can.Option(mdb.HASH)}; msg.Table(function(value) { can.core.Value(item, value.key, value.value) })
			can.onimport.layout(can, item), can.onappend._status(can), can.onimport._connect(can, item)
			can.isCmdMode() && can.misc.Search(can, "hash") && can.onaction.full({}, can)
		})
	},
	_connect: function(can, item) { item.extra = can.base.Obj(item.extra, {})
		var term = new Terminal({theme: item.extra, cursorBlink: true, tabStopWidth: 4})
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon
		can.onmotion.delay(can, function() { fitAddon.fit() })
		term.loadAddon(new WebLinksAddon.WebLinksAddon())

		term.onTitleChange(function(title) { can.isCmdMode() && can.user.title(title) })
		term.onResize(function(size) { can.onimport._resize(can, item, size) })
		term.onData(function(val) { can.onimport._input(can, item, val) })
		term.onCursorMove(function() { can.onexport.term(can) })

		can._current = term, term._item = item
		term.open(can._output), term.focus()
	},
	_resize: function(can, item, size) {
		can.runAction(can.request({}, size, item), "resize", [], function() { can.onexport.term(can) })
	},
	_input: function(can, item, val) {
		can.runAction(can.request({}, item, {"log.disable": ice.TRUE}), "input", [btoa(val)], function() {})
		// can.runAction(can.request({}, item, {}), "input", [btoa(val)], function() {})
	},
	layout: function(can, item) {
		if (can.isCmdMode()) { item && can.onimport._title(can, item.name)
			can.page.style(can, can._output, html.HEIGHT, can.ConfHeight()+10, html.WIDTH, can.ConfWidth()+20, html.MAX_WIDTH, "")
		} else {
			can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth(), html.MAX_WIDTH, "")
		}
		can._current && can._current._fit.fit()
	},
	grow:  function(can, msg) {
		can._current.write(msg.Option(mdb.TEXT))
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [mdb.TYPE, "rows", "cols", "cursorY", "cursorX"],
	term: function(can) { var term = can._current, item = term._item
		can.core.List(can.onexport.list, function(key) {
			can.Status(key, can.base.getValid(item[key], item.extra[key], can._current[key], can._current.buffer.active[key], ""))
		}), can.Status(mdb.TYPE, item[mdb.TYPE]||"")
	},
})
