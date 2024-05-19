Volcanos(chat.ONIMPORT, {list: [mdb.VALUE, "close:button"],
	_init: function(can, msg) { msg.Defer(function() { can.onappend.scroll(can, can._output) })
		can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.highlight(can, can.Option(mdb.VALUE, msg.Option(mdb.VALUE)))
		can.page.Select(can, can._option, "input[name=value]", function(target) { can.onmotion.hidden(can, target) })
	},
})
