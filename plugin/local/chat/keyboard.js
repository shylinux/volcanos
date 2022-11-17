Volcanos(chat.ONIMPORT, {_init: function(can, msg) { can.onmotion.clear(can)
	var data = msg.TableDetail(), list = can.base.Obj(data.list), meta = can.base.Obj(data.meta)
	can.user.trans(can, meta._trans), can.core.List(list, function(item) {
		item._init = function(target) {
			switch (target.type) {
				case html.BUTTON:
					target.onclick = function(event) { can.request(event, data)
						can.runAction(event, web.SPACE, [ctx.ACTION, item.name], function() {})
					}
					break
				case html.TEXT:
					target.onkeydown = function(event) { can.request(event, data)
						if (event.key == lang.ENTER) {
							can.runAction(event, web.SPACE, [ctx.ACTION, item.name, target.value], function() {})
						}
					}
					break
			}
		}
		can.onappend.input(can, item, "", can._output)
	})
	can.onimport._button(can, can.sup.onaction.list, data)
	return
	can.onappend.table(can, msg), can.onappend.board(can, msg)
	can.require(["/plugin/input/keyboard.js"], function() {
		can.onfigure.keyboard._show(can, function(value) {
			can.runAction(can.request({}, meta, can.Option()), "input", [value])
		})
	})
},
	_button: function(can, item, data) { item = can.base.isObject(item)? item: {type: html.BUTTON, name: item}
		if (can.base.isArray(item)) { return can.core.List(item, function(item) { can.onimport._button(can, item, data) }) }
		item._init = item._init||function(target) {
			target.onclick = function(event) { can.request(event, data)
				can.runAction(event, web.SPACE, [ctx.ACTION, item.name], function() {})
			}
		}
		can.onappend.input(can, item, "", can._output)
	},
}, [""])
