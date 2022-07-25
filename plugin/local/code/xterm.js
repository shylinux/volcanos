Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.onlayout.profile_auto(can), can.base.isFunc(cb) && cb(msg)
		can.onimport.layout(can), can.onappend._status(can), can.term = {}

		can.requireModules(["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() { can.onmotion.delay(can, function() { 
			if (can.Option(mdb.HASH) != "") {
				var item = {hash: can.Option(mdb.HASH)}; msg.Table(function(value) { can.core.Value(item, value.key, value.value) })
				return can.onimport._connect(can, item)
			}

			var hash = can.sup._hash||(location.hash||"#").slice(1)||true, list = msg.Table(function(value) {
				var item = can.onimport._item(can, value); value.hash == hash && (item.click(), hash = false)
			}); hash && can.onimport._create(can, [mdb.TYPE, "", mdb.NAME, "term"])
		}, 500) })
	},
	layout: function(can) {
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
		var term = can.ui.content._term; if (!term) { return }
		term._fit.fit(), can.onexport.term(can, term)
	},
	_item: function(can, item) {
		item._menu = shy(can.ondetail, can.ondetail.list, function(event, button, meta) {
			can.request(event, item, item.extra), meta[button](event, can, button, item)
		})
		return item._item = can.onimport.item(can, item, function(event) { 
			item._tabs? item._tabs.click(): item._tabs = can.onimport.tabs(can, [item], function(event) {
				can.onimport._connect(can, item)
			}), item._plugin && can.onmotion.toggle(can, item._plugin._target, true)
		}, function(event) { can.user.carteRight(event, can, can.ondetail, can.ondetail.list, item._menu) })
	},
	_create: function(can, args, data) {
		can.runAction({}, mdb.CREATE, args, function(msg) {
			var current = can.onimport._item(can, {hash: msg.Result(), name: msg.Option(mdb.NAME), extra: data})
			can.page.insertBefore(can, current, can.ui.project.firstChild).click()
		})
	},
	_connect: function(can, item, target) { target = target||can.ui.content
		can.sup._hash = item.hash, can.isCmdMode() && (location.hash = item.hash)
		if (can.onmotion.cache(can, function() { return item.hash }, target, can.ui.profile)) {
			can.runAction(can.request(event, item), "select"), item._term.focus()
			return can.onexport.term(can, item._term)
		}

		item.extra = can.base.Obj(item.extra, {})
		var term = new Terminal({theme: item.extra, cursorBlink: true, tabStopWidth: 4})
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon
		term.loadAddon(new WebLinksAddon.WebLinksAddon())

		term.open(target||can.ui.content)
		term.onResize(function(size) { can.onimport._size(can, item, size) })
		fitAddon.fit()

		var submode = false, keyskip = false
		term.onKey(function(e) { var event = e.domEvent
			if (submode) { keyskip = true; switch (event.key) {
				case "l": target.nextSibling && target.nextSibling._term? target.nextSibling._term.focus():
						item._tabs && item._tabs.nextSibling && item._tabs.nextSibling.click();
					break
				case "h": target.previousSibling && target.previousSibling._term? target.previousSibling._term.focus():
						item._tabs && item._tabs.previousSibling && item._tabs.previousSibling.click();
					break
				case "n": can.onaction.create(event, can); break
					break
				default: keyskip = false
			} }
			submode = event.ctrlKey && event.key == "g"
			can.onexport.term(can, term)
		})
		term.onData(function(val) {
			if (submode || keyskip) { keyskip = false; return }
			can.onimport._input(can, item, val)
		})
		term.onTitleChange(function(title) { can.isCmdMode() && can.user.title(title) })
		term.onCursorMove(function(e) { can.onexport.term(can, term) })

		can.term[item.hash] = item._term = target._term = term, term._target = target, term._item = item
		can.runAction(can.request(event, item), "select"), item._term.focus()
		return can.onimport._plug(can, item), can.onexport.term(can, term)
	},
	_input: function(can, item, val) {
		can.runAction(can.request({}, item), "input", [btoa(val)], function() {})
	},
	_size: function(can, item, size) {
		can.runAction(can.request({}, size, item), "resize", [])
	},
	_plug: function(can, item) { can.onmotion.clear(can, can.ui.profile)
		can.onimport.plug(can, item.extra, can.ui.profile, function(sub) { item._plugin = sub
			can.page.style(can, sub._output, html.MAX_WIDTH, can.ConfWidth()*3/4)
		})
	},
	grow: function(can, msg, type) { var term = can.term[msg.Option(mdb.HASH)]
		switch (type) {
			case "data": term.write(atob(msg.Option(mdb.TEXT))); break
			case "exit": can.onmotion.clear(can, term._target); break
		}
	},
})
Volcanos(chat.ONACTION, {help: "操作数据", list: [mdb.CREATE, lex.SPLIT, mdb.PRUNES],
	_trans: {split: "分屏", theme: "主题"},
	create: function(event, can) {
		can.user.input(event, can, [mdb.TYPE, mdb.NAME, "background", ctx.INDEX, ctx.ARGS], function(args, data) {
			can.onimport._create(can, args, data)
		})
	},
	split: function(event, can) { can.request(event, {name: "term", nrow: 2, ncol: 2})
		can.user.input(event, can, [mdb.TYPE, mdb.NAME, "nrow", "ncol"], function(data) {
			can.onimport.tabs(can, [data], function(event) { if (can.onmotion.cache(can, function() { return data.name }, can.ui.content)) { return }
				can.core.List(parseInt(data.nrow), function(nrow) { var row = can.page.Append(can, can.ui.content, [{view: "row", style: {height: can.ConfHeight()/data.nrow}}]).first
					can.core.List(parseInt(data.ncol), function(ncol) { var col = can.page.Append(can, row, [{view: "col", style: {height: can.ConfHeight()/data.nrow, width: can.ConfWidth()/data.ncol-2}}]).first
						can.runAction({}, mdb.CREATE, [mdb.TYPE, data.type, mdb.NAME, can.core.Keys(data.name, nrow, ncol)], function(msg) { can.onimport._connect(can, {hash: msg.Result()}, col) })
					})
				})
			})
		})
	},
})
Volcanos(chat.ONDETAIL, {help: "操作数据", list: ["share", "plugin", "theme", "rename", "remove"],
	share: function(event, can, button, item) { var msg = can.request(event); msg.Option("args", "")
		can.onmotion.share(event, can, [{name: chat.TITLE, value: item.name}, {name: chat.TOPIC, values: [cli.WHITE, cli.BLACK]}], [
			mdb.NAME, "web.code.xterm", mdb.TEXT, JSON.stringify([can.sup._hash]),
		])
	},
	plugin: function(event, can, button, item) {
		can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(args, data) {
			can.runAction(event, mdb.MODIFY, args), can.base.Copy(item.extra, data), can.onimport._plug(can, item)
		})
	},
	theme: function(event, can, button, item) {
		can.user.input(event, can, ["background", "selection", "cursor", "foreground"], function(args, data) {
			can.runAction(event, mdb.MODIFY, args), can.base.Copy(item.extra, data), item._term.setOption("theme", data)
		})
	},
	rename: function(event, can, button, item) {
		can.user.input(event, can, [mdb.NAME], function(args) {
			can.runAction(event, button, args), item.name = item._item.innerText = item._tabs.innerText = args[1]
		})
	},
	remove: function(event, can, button, item) {
		can.runAction(event, button)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [mdb.TOTAL, mdb.TYPE, "background", "rows", "cols", "cursorY", "cursorX", ctx.INDEX],
	term: function(can, term) { item = term._item
		can.core.List(can.onexport.list, function(key) {
			can.Status(key, can.base.getValid(item[key], item.extra[key], term[key], term.buffer.active[key], ""))
		})
		can.Status(mdb.TOTAL, can.page.Select(can, can.ui.project, html.DIV_ITEM).length)
		can.Status(mdb.TYPE, item[mdb.TYPE]||"")
		return term
	},
})
