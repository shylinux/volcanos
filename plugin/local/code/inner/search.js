Volcanos(chat.ONIMPORT, {
	list: ["value", "filter", "close:button"],
	_init: function(can, msg) {
		msg.Defer(function() { can.onappend.scroll(can, can._output) })
		can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.highlight(can, can.Option(mdb.VALUE, msg.Option(mdb.VALUE)))
		can.page.Select(can, can._option, "input[name=filter]", function(target) { target.onkeyup = function(event) { can.onmotion.highlight(can, target.value) } })
	},
})
