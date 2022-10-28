Volcanos(chat.ONFIGURE, {keyboard: {
	onclick: function(can, cbs, target) { cbs(function(sub) { var msg = can.request(); sub._normal(can, msg), can.onfigure.keyboard._show(sub, msg, target) }) },
	_show: function(can, msg, target) { can.require(["/plugin/input/keyboard.css"])
		msg.Table(function(item) { item.type == "head" && can.page.Append(can, can._output, html.BR)
			function add(value) { target.value += value, target.focus(), can.user.toast(can, value||item.name) }
			function hold() { can.page.ClassList.add(can, div, "hold") }
			var div = can.page.Append(can, can._output, [{view: item.type+ice.SP+item.name+(item.name.indexOf(ice.NL)>-1? " double": item.name.length>1? " special": ""), list: [{text: [item.name]}], onclick: function(event) {
				switch (item.name) {
					case "clear": target.value = "", target.focus(); break
					case "close": can.close(); break
					case "Esc": can.close(); break
					case "Ctrl": can._ctrl = !can._ctrl, hold(); break
					case "Shift": can._shift = !can._shift, hold(); break
					case "Backspace": target.value = target.value.slice(0, -1), add(""); break
					case "Enter": break
					default: can._shift = can._shift||event.shiftKey
						if (item.name == lang.TAB) {
							add(ice.TB)
						} else if (item.name == "Space") {
							add(ice.SP)
						} else if (item.name.indexOf(ice.NL) > -1) { var ls = can.core.Split(item.name, ice.NL, ice.NL, ice.NL)
							add(can._shift? ls[0]: ls[1])
						} else {
							add(can._shift? item.name.toUpperCase(): item.name)
						} can._shift = false, can._ctrl = false, can.page.Select(can, can._output, "div.hold", function(target) { can.page.ClassList.del(can, div, "hold") })
				}
			} }]).first
		})
	},
	_normal: function(can, msg) {
		can.core.List([["Esc", "close", "clear"],
			["~\n`", "!\n1", "@\n2", "#\n3", "$\n4", "%\n5", "^\n6", "&\n7", "*\n8", "(\n9", ")\n0", "_\n-", "+\n=", "Backspace"],
			["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{\n[", "}\n]", "|\n\\"],
			["Ctrl", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":\n;", "\"\n'", "Enter"],
			["Shift", "z", "x", "c", "v", "b", "n", "m",  "<\n,", ">\n.", "?\n/", "Shift"],
			["Ctrl", "Win", "Alt", "Space", "Alt", "Win", "Ctrl"],
		], function(list) { can.core.List(list, function(item, index) {
			msg.Push(can.base.isObject(item)? item: {type: "key"+(index == 0? " head": index == list.length-1? " tail": ""), name: item})
		}) })
	}
}})
