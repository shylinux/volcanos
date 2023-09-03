Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { cb && cb(msg)
		can._output.innerHTML = can.misc.sessionStorage(can, [can.ConfIndex(), "output"])||""
		can.page.style(can, can._output, html.MIN_HEIGHT, 200, html.WIDTH, can.ConfWidth(), "white-space", "pre", "padding", "10px")
	},
})