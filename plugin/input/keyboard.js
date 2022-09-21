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
			can.onfigure.keyboard._show(can, sub, target)

		})
	},
	_show: function(can, sub, target) {
			can.require(["/plugin/input/keyboard.css"])
			var  msg = can.request({}); can.onfigure.keyboard._normal(can, msg)
			var keys = {}; function hold(value, div) { keys[value.name] = div, can.page.ClassList.add(can, div, "hold") }
			msg.Table(function(value) { value.type == "head" && can.page.Append(can, can._output, "br")
				var t = value.type+" "+value.name+(value.name.indexOf("\n")>-1? " double": value.name.length>1? " special": "")
				var div = can.page.Append(can, sub._output, [{view: t, list: [{text: [value.name]}], onclick: function(event) {
					switch (value.name) {
						case "Ctrl":
							can._ctrl = !can._ctrl, hold(value, div)
							break
						case "Shift":
							can._shift = !can._shift, hold(value, div)
							break
						case "Backspace":
							target.value = target.value.slice(0, -1)
							break
						case "Enter":
							break
						case "Esc":
							break
						default:
							if (can.base.isFunc(target)) {
								target(value.name)
								return
							}
							can._shift = can._shift||event.shiftKey
							if (value.name == "Space") {
								target.value += " "
							} else if (value.name.indexOf("\n") > -1) {
								var ls = can.core.Split(value.name, "\n", "\n", "\n")
								target.value += can._shift? ls[0]: ls[1]
							} else if (can._shift) {
								target.value += value.name.toUpperCase()
							} else {
								target.value += value.name
							}
							can.core.Item(keys, function(key, div) {
								can.page.ClassList.del(can, div, "hold")
							}), can._ctrl = false, can._shift = false
					}
					target.focus(), can.user.toast(can, value.name)
				} }]).first
			})
	},
	_normal: function(can, msg) {
		msg.Push({type: "key head", name: "Esc"})

		msg.Push({type: "key head", name: "~\n`"})
		msg.Push({type: "key", name: "!\n1"})
		msg.Push({type: "key", name: "@\n2"})
		msg.Push({type: "key", name: "#\n3"})
		msg.Push({type: "key", name: "$\n4"})
		msg.Push({type: "key", name: "%\n5"})
		msg.Push({type: "key", name: "^\n6"})
		msg.Push({type: "key", name: "&\n7"})
		msg.Push({type: "key", name: "*\n8"})
		msg.Push({type: "key", name: "(\n9"})
		msg.Push({type: "key", name: ")\n0"})
		msg.Push({type: "key", name: "_\n-"})
		msg.Push({type: "key", name: "+\n="})
		msg.Push({type: "key", name: "Backspace"})

		msg.Push({type: "key head", name: "Tab"})
		msg.Push({type: "key", name: "q"})
		msg.Push({type: "key", name: "w"})
		msg.Push({type: "key", name: "e"})
		msg.Push({type: "key", name: "r"})
		msg.Push({type: "key", name: "t"})
		msg.Push({type: "key", name: "y"})
		msg.Push({type: "key", name: "u"})
		msg.Push({type: "key", name: "i"})
		msg.Push({type: "key", name: "o"})
		msg.Push({type: "key", name: "p"})
		msg.Push({type: "key", name: "{\n["})
		msg.Push({type: "key", name: "}\n]"})
		msg.Push({type: "key tail", name: "|\n\\"})

		// msg.Push({type: "key head", name: "CapsLock"})
		msg.Push({type: "key head", name: "Ctrl"})
		msg.Push({type: "key", name: "a"})
		msg.Push({type: "key", name: "s"})
		msg.Push({type: "key", name: "d"})
		msg.Push({type: "key", name: "f"})
		msg.Push({type: "key", name: "g"})
		msg.Push({type: "key", name: "h"})
		msg.Push({type: "key", name: "j"})
		msg.Push({type: "key", name: "k"})
		msg.Push({type: "key", name: "l"})
		msg.Push({type: "key", name: ":\n;"})
		msg.Push({type: "key", name: "\"\n'"})
		msg.Push({type: "key", name: "Enter"})

		msg.Push({type: "key head", name: "Shift"})
		msg.Push({type: "key", name: "z"})
		msg.Push({type: "key", name: "x"})
		msg.Push({type: "key", name: "c"})
		msg.Push({type: "key", name: "v"})
		msg.Push({type: "key", name: "b"})
		msg.Push({type: "key", name: "n"})
		msg.Push({type: "key", name: "m"})
		msg.Push({type: "key", name: "<\n,"})
		msg.Push({type: "key", name: ">\n."})
		msg.Push({type: "key", name: "?\n/"})
		msg.Push({type: "key tail", name: "Shift"})

		msg.Push({type: "key head", name: "Ctrl"})
		msg.Push({type: "key", name: "Win"})
		msg.Push({type: "key", name: "Alt"})
		msg.Push({type: "key", name: "Space"})
		msg.Push({type: "key", name: "Alt"})
		msg.Push({type: "key", name: "Win"})
		msg.Push({type: "key", name: "Ctrl"})

	}
}})
