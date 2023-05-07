Volcanos(chat.ONIMPORT, {_init: function(can, msg) {
		can.current = msg.TableDetail()
		can.target = can.page.Appends(can, can._output, [{type: html.IFRAME, src: can.current.link, height: can.ConfHeight(), width: can.ConfWidth(), style: {border: 0}}])._target
		can.onimport.layout(can)
	},
	layout: function(can) { var item = can.current; can.sup.onexport.title(can, item.name||item.link.split(mdb.QS)[0])
		can.page.style(can, can.target, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
	},
})
Volcanos(chat.ONACTION, {open: function(event, can) { can.user.open(can.current.link) }})
