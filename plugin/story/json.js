Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.onmotion.clear(can, target), can.onappend.table(can, msg)
		can.onappend.style(can, nfs.JSON, can._output), can.onimport.show(can, can.base.Obj(msg.Result(), {}), target, msg)
	},
	show: function(can, data, target, msg) {
		if (data.append && !can.page.tagis(can._fields, "fieldset.float")) {
			var msg = can.request(); msg.Copy(data), can.onappend.table(can, msg)
			msg._xhr = {responseText: msg.Result()}
			can.onmotion.delay(can, function() { can.onappend._status(can, msg) })
			return
		}
		var hidden = data.detail && data.option
		function show(data, target, index, total) { var list
			switch (typeof data) {
				case code.OBJECT: if (data == null) { can.page.Append(can, target, [{text: "null"}]); break }
					function wrap(begin, end, add, cb, inner) { can.page.Append(can, target, [{text: begin}])
						add && can.page.Append(can, target, inner||[{text: [can.page.unicode.inner, html.LABEL, ["nonce", html.HIDE]]}]), cb(), can.page.Append(can, target, [{text: end}])
					}
					function format(data) { return can.page.trans(can, JSON.stringify(data)) }
					function toggle(list) { return list && can.onmotion.toggle(can, list) }
					function _item() { return can.page.Append(can, list = list || can.page.Append(can, target, [html.LIST])._target, [html.ITEM])._target }
					if (can.base.isArray(data)) { var inner = ""
						if (hidden && can.core.List(data, function(item) { if (can.base.isIn(typeof item, code.STRING, code.NUMBER, code.BOOLEAN)) { return item } }).length == data.length) {
							inner = [], can.core.List(data, function(item, index) { inner.push({text: [format(item), "", [code.STRING, code.INNER]]}, index < data.length-1 && {text: [", ", "", [code.INNER]]}) })
						}
						wrap("[", "]", data.length > 0, function() { can.core.List(data, function(value, index) { var item = _item()
							show(value, item, index, data.length)
						}) }, inner)
					} else { var length = can.core.Item(data).length, count = 0
						wrap("{", "}", length > 0, function() { can.core.Item(data, function(key, value) { var item = _item()
							can.page.Append(can, item, [{text: [format(key), "", mdb.KEY], onclick: function(event) { var display = !toggle(sub)
								sub && can.page.SelectChild(can, sub.parentNode, "span.inner", function(target) { can.onmotion.toggle(can, target, display) })
								sub && can.page.SelectChild(can, sub.parentNode, "label.nonce", function(target) { can.onmotion.toggle(can, target, display) })
							}}, {text: ": "}]); key == ice.MSG_STATUS && (value = can.base.Obj(value[0])||value)
							var sub = show(value, item, count++, length); hidden && sub && can.onmotion.hidden(can, sub)
							key == ice.MSG_STATUS && (can.page.SelectChild(can, item, "label.nonce", function(target) { can.onmotion.toggle(can, target, true) }))
						}) })
					} break
				case code.STRING: can.page.Append(can, target, [{text: [format(data), "", code.STRING]}]); break
				default: can.page.Append(can, target, [{text: [format(data), "", code.CONSTANT]}])
			} (index < total-1) && can.page.Append(can, target, [{text: mdb.FS}]); return list
		}; show(data, can.page.Append(can, target, [html.ITEM])._target, 0, 0)
	},
}, [""])
