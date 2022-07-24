Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.onlayout.profile(can), can.base.isFunc(cb) && cb(msg)
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(can.ConfHeight()+html.ACTION_HEIGHT), html.WIDTH, can.ConfWidth())
		can.page.ClassList.add(can, can.ui.project, ice.AUTO)
		can.page.ClassList.add(can, can.ui.profile, ice.AUTO)
		can.onmotion.hidden(can, can.ui.project)
		can.onmotion.hidden(can, can._status)

		msg.Table(function(value) { can.onimport.item(can, value, function() {}, function(event) {
			can.user.carteRight(event, can, {
				"select": function() {
					can.runAction(can.request(event, value), "select", [])
				},
				"rename": function() {
					can.user.input(event, can, [mdb.NAME], function(args) {
						can.runAction(can.request(event, value), mdb.MODIFY, args)
					})
				},
			})
		}) })

		can.require(["/require/node_modules/xterm/lib/xterm.js", "/require/node_modules/xterm/css/xterm.css", "/require/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js"], function() { can.term = {}
			can.runAction({}, mdb.CREATE, ["type", "xterm", "name", "some"], function(msg) { can.onimport._connect(can, msg.Result()) })
		})
	},
	_connect: function(can, hash, target) { var term = new Terminal({theme: {background: "#060101"}}); can.term[hash] = term
		target = target||can.ui.content, target._term = term, term._target = target
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon)
		term.open(target||can.ui.content), term.onResize(function(size) {
			can.runAction(can.request({}, {"hash": hash}, size), "resize", [], function() {})
		}), fitAddon.fit()
		term.onData(function(val) {
			can.runAction(can.request({}, {"hash": hash}), "input", [val], function() {})
		})
		var submode = false
		term.onTitleChange(function(title) {
			can.isCmdMode() && can.user.title(title)
			can.misc.Debug("title", title)
		})
		term.onKey(function(e) { var event = e.domEvent
			if (submode) {
				switch (event.key) {
					case "l":
						target.nextSibling && target.nextSibling._term && target.nextSibling._term.focus()
						break
					case "h":
						target.previousSibling && target.previousSibling._term && target.previousSibling._term.focus()
						break
				}
			}
			if (event.ctrlKey && event.key == "g") {
				submode = true
			} else {
				submode = false
			}
			return false
		})
	},
	grow: function(can, msg, str) { var data = can.base.Obj(str)
		var term = can.term[msg.Option(mdb.HASH)]
		switch (data.type) {
			case "data":
				term.write(atob(data.text))
				break
			case "exit":
				can.onmotion.clear(can, term._target)
		}
	},
})
Volcanos(chat.ONACTION, {help: "操作数据", list: ["split"],
	_trans: {split: "分屏"},
	split: function(event, can) { can.request(event, {m: 2, n: 2})
		can.user.input(event, can, ["m", "n"], function(data) { can.onmotion.clear(can, can.ui.content)
			can.core.List(parseInt(data.m), function() { var row = can.page.Append(can, can.ui.content, [{view: "row", style: {height: can.ConfHeight()/data.m}}]).first
				can.core.List(parseInt(data.n), function() { var div = can.page.Append(can, row, [{view: "col", style: {height: can.ConfHeight()/data.m, width: can.ConfWidth()/data.n-2}}]).first
					can.runAction({}, mdb.CREATE, ["type", "xterm", "name", "some"], function(msg) { can.onimport._connect(can, msg.Result(), div) })
				})
			})
		})
	},
})
