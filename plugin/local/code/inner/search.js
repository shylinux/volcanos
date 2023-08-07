Volcanos(chat.ONIMPORT, {list: ["value", "filter", "run:button"], _init: function(can, msg) {
	can.onmotion.clear(can), can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.highlight(can, can.Option(mdb.VALUE, msg.Option(mdb.VALUE)))
	can.page.Select(can, can._option, "input[name=filter]", function(target) { target.onkeyup = function(event) { can.onmotion.highlight(can, target.value) } })
}})
