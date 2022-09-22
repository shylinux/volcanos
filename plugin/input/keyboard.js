Volcanos(chat.ONFIGURE, {help: "控件详情", keyboard: {
	onclick: function(event, can, meta, cb, target) {
		can.onfigure.keyboard._make(event, can, meta, cb, target)
	},
	onfocus: function(event, can, meta, cb, target, last) {
		can.onfigure.keyboard._make(event, can, meta, cb, target)
	},
	_make: function(event, can, meta, cb, target, last) {
		var sub = target._can; if (sub && sub._cbs) { return }
		cb(function(sub, cbs) { sub._cbs = cbs
			can.onfigure.keyboard._show(sub, target)
		})
	},
	_show: function(can, target) { can.require(["/plugin/input/keyboard.css"])
		var  msg = can.request({}); can.onfigure.keyboard._normal(can, msg)
		var keys = {}; function hold(value, div) { keys[value.name] = div, can.page.ClassList.add(can, div, "hold") }
		msg.Table(function(value) { value.type == "head" && can.page.Append(can, can._output, "br")
			var t = value.type+" "+value.name+(value.name.indexOf("\n")>-1? " double": value.name.length>1? " special": "")
			var div = can.page.Append(can, can._output, [{view: t, list: [{text: [value.name]}], onclick: function(event) {
				switch (value.name) {
					case "Esc":
						can.page.Remove(can, can._target)
						delete(target._can)
						break
					case "Ctrl":
						can._ctrl = !can._ctrl, hold(value, div)
						break
					case "Shift":
						can._shift = !can._shift, hold(value, div)
						break
					case "Backspace":
						if (can.base.isFunc(target)) {
							target(value.name)
						} else {
							target.value = target.value.slice(0, -1)
						}
						target.focus(), can.user.toast(can, value.name)
						break
					case "Enter":
						break
					case "Esc":
						break
					default:
						function add(value) {
							if (can.base.isFunc(target)) {
								target(value)
							} else {
								target.value += value
								target.focus(), can.user.toast(can, value.name)
							}
						}

						can._shift = can._shift||event.shiftKey
						if (value.name == "Tab") {
							add("\t")
						} else if (value.name == "Space") {
							add(" ")
						} else if (value.name.indexOf("\n") > -1) {
							var ls = can.core.Split(value.name, "\n", "\n", "\n")
							add(can._shift? ls[0]: ls[1])
						} else if (can._shift) {
							add(value.name.toUpperCase())
						} else {
							add(value.name)
						}
						can.core.Item(keys, function(key, div) {
							can.page.ClassList.del(can, div, "hold")
						}), can._ctrl = false, can._shift = false
				}
			} }]).first
		})
	},
	_normal: function(can, msg) {
		can.core.List([["Esc"],
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
