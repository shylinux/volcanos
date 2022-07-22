Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
		can.page.style(can, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
		can.require(["/node_modules/xterm/lib/xterm.js", "/node_modules/xterm/css/xterm.css"], function() {
			can.term = new Terminal(), can.term.open(can._output), can.term.onData(function(val) {
				can.runAction(can.request({}, {"channel": can.Conf("channel")}), "input", [val], function() {})
			})
		})
	},
	grow: function(can, str) {
		can.term.write(atob(str))
	},
})
