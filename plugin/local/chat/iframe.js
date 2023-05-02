Volcanos(chat.ONIMPORT, {_init: function(can, msg) {
		can.current = msg.TableDetail(), can.onimport.layout(can)
	},
	layout: function(can) { var item = can.current; can.sup.onexport.title(can, item.name||item.link.split("?")[0])
		var target = can.page.Appends(can, can._output, [{type: html.IFRAME, src: item.link, height: can.ConfHeight(), width: can.ConfWidth(), style: {border: 0}}])._target
		can.onmotion.delay(can, function() {
			can.page.style(can, target.contentDocument.body, "background-color", "transparent")
		})
	},
})
Volcanos(chat.ONACTION, {open: function(event, can) { can.user.open(can.current.link) }})
