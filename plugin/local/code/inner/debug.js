Volcanos(chat.ONIMPORT, {_init: function(can, msg) {
	can.core.List(can.misc._list, function(item) {
		msg.Push(mdb.TIME, item[0])
		msg.Push(nfs.FILE, item[1].split(ice.DF)[0].split("?")[0])
		msg.Push(nfs.LINE, item[1].split(ice.DF)[1])
		msg.Push(mdb.TYPE, item[2])
		msg.Push(mdb.NAME, item[3])
		msg.Push(mdb.TEXT, item.slice(4).join(ice.SP)||"")
	}), msg.StatusTimeCount(), can.onmotion.clear(can), can.onappend.table(can, msg)
	can.page.Select(can, can._option, "input[name=name]", function(target) {
		target.onkeyup = function(event) { can.onmotion.highlight(can, target.value) }
	})
}})
