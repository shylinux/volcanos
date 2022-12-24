Volcanos(chat.ONIMPORT, {list: ["main", "filter", "grep:button", "history", "last"], _init: function(can, msg) {
	can.misc.Debug("what")
	can.onmotion.clear(can), can.onappend.table(can, msg)
	can.onmotion.delay(can, function() {
		can.page.Select(can, can._option, "input[name=filter]", function(target) {
			target.onkeyup = function(event) { can.onmotion.highlight(can, target.value) }
		})
	})
}})
Volcanos(chat.ONACTION, {
	"grep": function(event, can, button) {
		can.runAction(event, nfs.GREP, [can.Option("main")], function(msg) { can.onimport._init(can, msg) })
	},
})
