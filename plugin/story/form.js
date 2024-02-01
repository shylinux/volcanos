Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, html.FORM, can._output)
		if (can.isCmdMode()) { can.onappend.style(can, html.OUTPUT) }
		can.page.Append(can, can._output, msg.Table(function(item) {
			return {view: [[html.ITEM, item.type]], list: [item.type != html.BUTTON && {text: [can.user.trans(can, item.name, item._trans, html.INPUT), "", mdb.NAME]}, item.need == "must" && {text: ["*", "", "need"]}], _init: function(target) {
				can.onappend.input(can, item, "", target)
			}, onclick: function(event) { can.page.Select(can, event.currentTarget, html.INPUT, function(target) { target.focus() }) }}
		})), can.onappend.board(can, msg)
	},
})
