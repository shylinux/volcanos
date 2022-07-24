Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.onlayout.profile_auto(can), can.base.isFunc(cb) && cb(msg)
		can.onimport.layout(can), can.onappend._status(can), can.term = {}

		can.requireModules(["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
			if (can.Option(mdb.HASH) != "") {
				var item = {hash: can.Option(mdb.HASH)}; msg.Table(function(value) { can.core.Value(item, value.key, value.value) })
				return can.onmotion.delay(can, function() { can.onimport._connect(can, item).writeln() }, 1000)
			}

			var hash = can.sup._hash||(location.hash||"#").slice(1)||true, list = msg.Table(function(value) {
				var item = can.onimport._item(can, value); value.hash == hash && (item.click(), hash = false)
			});
			hash && can.runAction({}, mdb.CREATE, [mdb.TYPE, "", mdb.NAME, "term"], function(msg) {
				can.onimport._item(can, {hash: msg.Result(), name: msg.Option(mdb.NAME)}).click()
			})
		})
	},
	layout: function(can) {
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
	},
	_size: function(can, item, size) {
		can.runAction(can.request({}, size, item), "resize", [], function() {})
	},
	_input: function(can, item, val) {
		can.runAction(can.request({}, item), "input", [val], function() {})
	},
	_item: function(can, item) { item.extra = can.base.Obj(item.extra, {})
		return can.onimport.item(can, item, function(event) { can.runAction(can.request(event, item), "select")
			item._menu = shy(can.ondetail, can.ondetail.list, function(event, button, meta) { can.request(event, item), meta[button](event, can, button, item) })
			item._tabs? item._tabs.click(): item._tabs = can.onimport.tabs(can, [item], function(event) {
				can.onimport._connect(can, item)
			})
		}, function(event) {
			can.user.carteRight(event, can, can.ondetail, can.ondetail.list, function(event, button) {
				can.request(event, item, item.extra)
				can.ondetail[button](event, can, button, item)
			})
		})
	},
	_plug: function(can, item) {
		can.onmotion.clear(can, can.ui.profile)
		can.onimport.plug(can, item.extra, can.ui.profile, function() {
		})
	},
	_connect: function(can, item, target) { target = target||can.ui.content
		can.sup._hash = item.hash, can.isCmdMode() && (location.hash = item.hash)
		if (can.onmotion.cache(can, function() { return item.hash }, target, can.ui.profile)) {
			return can.onexport.term(can, item, can.term[item.hash])
		}

		var term = new Terminal({theme: item.extra, cursorBlink: true, tabStopWidth: 4})
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon)
		term.loadAddon(new WebLinksAddon.WebLinksAddon())

		term.open(target||can.ui.content)
		term.onData(function(val) { can.onimport._input(can, item, val) })
		term.onResize(function(size) { can.onimport._size(can, item, size) })
		fitAddon.fit()

		var submode = false
		term.onCursorMove(function(e) {
			can.misc.Debug(e)
		})
		term.onKey(function(e) { var event = e.domEvent
			if (submode) { switch (event.key) {
				case "l": target.nextSibling && target.nextSibling._term && target.nextSibling._term.focus(); break
				case "h": target.previousSibling && target.previousSibling._term && target.previousSibling._term.focus(); break
			} }
			submode = event.ctrlKey && event.key == "g"
			can.onexport.term(can, item, term)
		})
		term.onTitleChange(function(title) { can.isCmdMode() && can.user.title(title) })

		can.term[item.hash] = target._term = term, term._target = target
		can.runAction(can.request(event, item), "select")
		can.onexport.term(can, item, term)
		can.onimport._plug(can, item)
		item._term = term
		return term
	},
	grow: function(can, msg, str) { var data = can.base.Obj(str), term = can.term[msg.Option(mdb.HASH)]
		switch (data.type) {
			case "data": term.write(atob(data.text)); break
			case "exit": can.onmotion.clear(can, term._target); break
		}
	},
})
Volcanos(chat.ONACTION, {help: "操作数据", list: ["create", "split", "prunes"],
	_trans: {split: "分屏", theme: "主题"},
	create: function(event, can) {
		can.user.input(event, can, [mdb.TYPE, mdb.NAME, "background", "index", "args"], function(args, data) {
			can.runAction({}, mdb.CREATE, args, function(msg) { data.hash = msg.Result()
				can.onimport._item(can, {hash: msg.Result(), name: msg.Option(mdb.NAME)}).click()
			})
		})
	},
	split: function(event, can) { can.request(event, {name: "term", nrow: 2, ncol: 2})
		can.user.input(event, can, [mdb.TYPE, mdb.NAME, "nrow", "ncol"], function(data) {
			can.onimport.tabs(can, [data], function(event) {
				if (can.onmotion.cache(can, function() { return data.name }, can.ui.content)) { return }
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
			item._term && item._term.setOption("theme", data), can.runAction(event, mdb.MODIFY, args)
		})
	},
	rename: function(event, can, button, item) {
		can.user.input(event, can, [mdb.NAME], function(args) {
			can.runAction(event, button, args)
		})
	},
	remove: function(event, can, button, item) {
		can.runAction(event, button)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["type", "background", "rows", "cols", "cursorY", "cursorX", "index"],
	term: function(can, item, term) {
		can.core.List(can.onexport.list, function(key) {
			can.Status(key, can.base.getValid(item[key], item.extra[key], term[key], term.buffer.active[key], ""))
		})
		return term
	},
})
