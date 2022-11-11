Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) {
		can.current = msg.TableDetail(), can.onimport.layout(can), can.base.isFunc(cb) && cb(msg)
	},
	layout: function(can) { var item = can.current; can.onmotion.clear(can), can.onimport.title(can, item.name||item.link)
		can.page.Append(can, can._output, [{type: html.IFRAME, src: item.link, height: can.ConfHeight(), width: can.ConfWidth(), style: {border: 0}}])
	},
})
Volcanos(chat.ONACTION, {
	open: function(can) { can.user.open(can.current.link) },
})
