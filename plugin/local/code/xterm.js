Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.page.requireModules(can, ["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
		if (can.Option(mdb.HASH) || can.Option("args0") || can.ConfIndex() == "can._filter") { var item = can.base.Obj(msg.TableDetail()); item.hash = item.hash||can.Option(mdb.HASH)||can.Option("args0")||"current"
			can.onimport._connect(can, item, can._output)
		} else {
			can.ui = can.onappend.layout(can), can.onimport._project(can, msg, can.db.hash)
		} cb && cb(msg)
	}) },
	_project: function(can, msg, hash) { msg.Table(function(value) {
		value.nick = `${value.hash}(${value.name||value.type||"ish"}) ${value.status}`, value._select = value.hash == hash[0]
		can.onimport.item(can, value, function(event, item, show, target) {
			can.onimport.tabsCache(can, value, target, function() { can.onappend._status(can)
				value._term = can.onimport._connect(can, value, can.ui.content)
			})
		})
	}) },
	_connect: function(can, item, target, text) { can.onimport.layout(can)
		var term = new Terminal({fontSize: html.CODE_FONT_SIZE, tabStopWidth: 4, cursorBlink: true, theme: can.onimport._theme(can, item)}); term._item = item
		term.onTitleChange(function(title) { can.onexport.title(can, term, title) }), can.onexport.title(can, term, item.nick)
		term.onResize(function(size) { can.onimport._resize(can, term, size) })
		term.onData(function(data) { can.onimport._input(can, term, data) })
		term.onCursorMove(function() { can.onexport.term(can, term) })
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon, can.onmotion.delay(can, function() { fitAddon.fit() })
		term.loadAddon(new WebLinksAddon.WebLinksAddon())
		can.onmotion.clear(can, target), term.open(target), term.focus()
		can.onengine.listen(can, chat.ONTHEMECHANGE, function() { term.selectAll(), can.onimport._connect(can, item, target, can.base.trimSuffix(term.getSelection(), lex.NL)) })
		can.page.style(can, target, html.BACKGROUND_COLOR, term._publicOptions.theme.background||cli.BLACK)
		return can.db[item.hash] = term
	},
	_theme: function(can, item) { return can.base.Obj(item.theme)||(
		can.getHeaderTheme() == html.LIGHT? {background: "#0000", foreground: cli.BLACK, cursor: cli.BLUE}:
			can.getHeaderTheme() == html.DARK? {background: "#0000", foreground:cli.SILVER, cursor: cli.SILVER}:
				can.getHeaderTheme() == chat.BLACK? {background: "#0000", foreground:cli.WHITE, cursor: cli.WHITE}:
					{background: "#0000", foreground: cli.BLACK, cursor: cli.BLUE}
	) },
	_resize: function(can, term, size) {
		can.runAction(can.request({}, size, term._item), web.RESIZE, [], function(msg) {})
	},
	_input: function(can, term, data) {
		can.runAction(can.request({}, {rows: term.rows, cols: term.cols}, term._item), html.INPUT, [btoa(data)], function(msg) {})
	},
	input: function(can, msg, hash, text) { var arg = msg.detail.slice(1); arg = [hash||arg[0], text||arg[1]]
		term = can.db[arg[0]], can.onimport._input(can, term, arg[1])
	},
	grow: function(can, msg, hash, text) { var arg = msg.detail.slice(1); arg = [hash||arg[0], text||arg[1]], term = can.db[arg[0]]
		if (arg[1] == "~~~end~~~") { arg[0] == "current"? can.sup.onmotion._close({}, can.sup): can.sup.onimport._back(can.sup) } else { term.write(arg[1]) }
	},
	layout: function(can) { can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function() {
		can.core.Item(can.db, function(hash, term) { term._fit && term._fit.fit() })
		can.db.value && can.db.value._term && can.onexport.term(can, can.db.value._term)
	}) },
})
Volcanos(chat.ONACTION, {
	create: function(event, can) { can.user.input(event, can, [mdb.TYPE, mdb.NAME, mdb.TEXT], function(data) {
		can.runAction(can.request({}, data), mdb.CREATE, [], function(msg) { var hash = msg.Result()
			can.run(event, [hash], function(msg) { var _msg = can.request(); _msg.Push(msg.TableDetail())
				can.onimport._project(can, _msg, [hash])
			})
		})
	}) },
	remove: function(event, can) { var item = event._msg.Option("_item")
		can.runAction(event, mdb.REMOVE, [], function(msg) {
			var value = item._item; value._tabs && value._tabs._close(), can.page.Remove(can, item)
		})
	},
})
Volcanos(chat.ONEXPORT, {list: [mdb.TIME, mdb.HASH, mdb.TYPE, mdb.NAME, "rows", "cols", "cursorY", "cursorX"],
	term: function(can, term) { item = term._item, can.onexport.title(can, term, item.nick||item.name||item.type)
		can.core.List(can.onexport.list, function(key) { if (key == mdb.TIME && !item[key]) { return } can.Status(key, can.base.getValid(item[key], term[key], term.buffer.active[key], "")+"") })
		can.core.List([mdb.TIME, mdb.HASH, mdb.TYPE, mdb.NAME], function(key) { if (key == mdb.TIME && !item[key]) { return } can.Status(key, item[key]||"") })
	},
	title: function(can, term, title) { can.Status(mdb.NAME, title), can.sup.onexport.title(can.sup, title) },
})
