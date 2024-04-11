Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, html.FORM, can._output)
		if (can.isCmdMode()) { can.onappend.style(can, html.OUTPUT) }
		can.page.Append(can, can._output, msg.Table(function(item) {
			return {view: [[html.ITEM, item.type]], list: [item.type != html.BUTTON && {text: [can.user.trans(can, item.name, item._trans, html.INPUT), "", mdb.NAME]}, item.need == "must" && {text: ["*", "", "need"]}], _init: function(target) {
				item.type == html.BUTTON && (item.onclick = function(event) { var args = []
					can.core.Item(can.page.SelectArgs(can, can._output)[0], function(key, value) { args.push(key, value) })
					can.Update(can.request(event, {_handle: ice.TRUE}), [ctx.ACTION, item.name].concat(args), function() {
						can.Update()
					})
				}), can.onappend.input(can, item, "", target)
			}, onclick: function(event) {
				can.page.Select(can, event.currentTarget, html.INPUT, function(target) { target.focus() })
			}}
		})), can.onappend.board(can, msg)
	},
})
