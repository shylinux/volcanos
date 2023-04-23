Volcanos(chat.ONFIGURE, {keyboard: {
	_init: function(can, meta, target) { can.onfigure.keyboard[target.value] && (target.value = "") },
	onclick: function(can, meta, target, cbs) { cbs(function(sub) { var msg = can.request()
		can.page.style(can, can._output, html.MIN_WIDTH, sub[meta.value||"_normal"](sub, msg))
		can.onfigure.keyboard._show(sub, msg, target)
	}) },
	_show: function(can, msg, target) { can.require(["/plugin/input/keyboard.css"]), can.onmotion.clear(can, can._output)
		msg.Table(function(item) { item.type == html.HEAD && can.page.Append(can, can._output, html.BR)
			function add(value) { target.value += value, target.focus(), can.user.toast(can, value||item.name) }
			function hold() { can.page.ClassList.add(can, div, "hold") }
			var div = can.page.Append(can, can._output, [{view: item.type+lex.SP+item.name+(item.name.indexOf(lex.NL)>-1? " double": item.name.length>1? " special": ""), list: [{text: [item.name]}], onclick: function(event) {
				switch (item.name) {
					case cli.CLEAR: target.value = "", target.focus(); break
					case cli.CLOSE: can.close(); break
					case lang.ESC: can.close(); break
					case lang.CTRL: can._ctrl = !can._ctrl, hold(); break
					case lang.SHIFT: can._shift = !can._shift, hold(); break
					case lang.BACKSPACE: target.value = target.value.slice(0, -1), add(""); break
					case lang.ENTER: break
					default: can._shift = can._shift||event.shiftKey
						if (item.name == lang.TAB) {
							add(lex.TB)
						} else if (item.name == lang.SPACE) {
							add(lex.SP)
						} else if (item.name.indexOf(lex.NL) > -1) { var ls = can.core.Split(item.name, lex.NL, lex.NL, lex.NL)
							add(can._shift? ls[0]: ls[1])
						} else {
							add(can._shift? item.name.toUpperCase(): item.name)
						} can._shift = false, can._ctrl = false, can.page.Select(can, can._output, "div.hold", function(target) { can.page.ClassList.del(can, div, "hold") })
				}
			} }])._target
		})
	},
	_number: function(can, msg) {
		can.core.List([
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "8", "9"],
		], function(list) { can.core.List(list, function(item, index) {
			msg.Push(can.base.isObject(item)? item: {type: [mdb.KEY, (index == 0? html.HEAD: "")].join(lex.SP), name: item})
		}) }); return 150
	},
	_normal: function(can, msg) {
		can.core.List([[lang.ESC, "close", "clear"],
			["~\n`", "!\n1", "@\n2", "#\n3", "$\n4", "%\n5", "^\n6", "&\n7", "*\n8", "(\n9", ")\n0", "_\n-", "+\n=", lang.BACKSPACE],
			[lang.TAB, "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{\n[", "}\n]", "|\n\\"],
			[lang.CTRL, "a", "s", "d", "f", "g", "h", "j", "k", "l", ":\n;", "\"\n'", lang.ENTER],
			[lang.SHIFT, "z", "x", "c", "v", "b", "n", "m",  "<\n,", ">\n.", "?\n/", lang.SHIFT],
			[lang.CTRL, lang.CMD, lang.ALT, lang.SPACE, lang.ALT, lang.CMD, lang.CTRL],
		], function(list) { can.core.List(list, function(item, index) {
			msg.Push(can.base.isObject(item)? item: {type: [mdb.KEY, index == 0? html.HEAD: index == list.length-1? "tail": ""].join(lex.SP), name: item})
		}) }); return 750
	}
}})
