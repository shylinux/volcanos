Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg) {
	can.onappend.table(can, msg)
	can.onappend.board(can, msg)
	var meta = {}
	msg.Table(function(value, key) { meta[value.key] = value.value })
	can.require(["/plugin/input/keyboard.js"], function() {
		can.onfigure.keyboard._show(can, can, function(value) {
			can.runAction(can.request({}, meta, can.Option()), "input", [value])
		})
	})
}})
