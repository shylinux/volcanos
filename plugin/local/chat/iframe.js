Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.db.current = msg.TableDetail()
		can.Conf("_width") && can.sup.onimport.size(can.sup, can.Conf("_height"), can.Conf("_width"), false), can.page.style(can, can._output, "overflow-y", html.HIDDEN)
		can.ui.target = can.page.Appends(can, can._output, [{type: html.IFRAME, src: can.db.current.link, height: can.ConfHeight(), width: can.ConfWidth()}])._target
		can.sup.onexport.link = function() { return can.base.beginWith(can.db.current.link, "/")? location.origin+can.db.current.link: can.db.current.link }
	},
	layout: function(can) {
		var item = can.db.current; can.sup.onexport.title(can, item.name||item.link.split(mdb.QS)[0])
		can.page.style(can, can.ui.target, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
	},
})
Volcanos(chat.ONACTION, {open: function(event, can) { can.user.open(can.db.current.link) }})
