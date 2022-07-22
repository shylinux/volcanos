Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
	can.require(["/node_modules/xterm/lib/xterm.js", "/node_modules/xterm/css/xterm.css"], function() {
		can.term = new Terminal();
		can.term.open(can._output)
		can.term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
		can.term.onData(function(val) {
			can.runAction(can.request({}, {"channel": can.Conf("channel")}), "input", [val], function(msg) {
				can.term.write(msg.Result())
			})
		})
	})
}, grow: function(can, str) {
	can.term.write(str.replaceAll("\n", "\r\n"))
}
})
