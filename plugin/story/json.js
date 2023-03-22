Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.page.ClassList.add(can, target, "json")
		can.onmotion.clear(can, target)
		can.onappend.table(can, msg), can.onimport.show(can, can.base.Obj(msg.Result(), {}), target)
		can.base.isFunc(cb) && cb(msg)
	},
	show: function(can, data, target) {
		function show(data, target, index, total) { var list
			switch (typeof data) {
				case lang.OBJECT:
					if (data == null) {
						list = can.page.Append(can, target, [{text: "null"}]).item
						break
					}
					function wrap(begin, end, add, cb) {
						can.page.Append(can, target, [{text: begin}])
						add && can.page.Append(can, target, [{text: ["...", html.SPAN, "nonce"]}]), cb()
						can.page.Append(can, target, [{text: end}])
					}
					function toggle(list) { list && can.onmotion.toggle(can, list) }
					function _item() {
						list = list || can.page.Append(can, target, [{view: html.LIST}]).list
						return can.page.Append(can, list, [{view: html.ITEM}]).item
					}

					if (can.base.isArray(data)) { // 数组
						wrap("[", "]", data.length > 0, function() { can.core.List(data, function(value, index) { var item = _item()
							show(value, item, index, data.length)
						}) })
					} else { // 对象
						var length = can.core.Item(data).length, count = 0
						wrap("{", "}", length > 0, function() { can.core.Item(data, function(key, value) { var item = _item()
							can.page.Append(can, item, [{text: ['"'+key+'"', html.SPAN, "key"], onclick: function(event) { toggle(sub) }}, {text: ': '}])
							var sub = show(value, item, count++, length)
						}) })
					}
					break
				case lang.STRING: /* 字串 */ can.page.Append(can, target, [{text: ['"'+data+'"', html.SPAN, lang.STRING]}]); break
				default: /* 其它 */ can.page.Append(can, target, [{text: [''+data+'', html.SPAN, "const"]}])
			}
			(index < total-1) && can.page.Append(can, target, [{text: ice.FS}])
			return list
		}; show(data, can.page.Append(can, target, [{view: html.ITEM}]).item, 0, 0)
	},
}, [""])
