Volcanos(chat.ONACTION, {
	run: function(event, can) { can.run(can.request(event, {_method: http.POST})) }, refresh: function(event, can) { can.run(can.request(event, {_method: http.GET})) },
	list: function(event, can) { can.sup.isSimpleMode() || can.run(can.request(event, {_method: http.GET})) }, back: function(event, can) { can.sup.onimport._back(can.sup) },
	onclick: function(event, can) { can.Conf(mdb.TYPE) == html.BUTTON && can.run(event, [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input())), can.onkeymap.prevent(event) },
	onchange: function(event, can) { can.Conf(mdb.TYPE) == html.SELECT && can.run(event) },
	onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target); if (can.Conf(mdb.TYPE) == html.TEXTAREA && !event.ctrlKey) { return }
		if (event.key == code.ENTER) { return can.onkeymap.prevent(event), can.run(event), can.onmotion.focus(can, event.target) }
		if (!event.ctrlKey) { return } switch (event.key) {
			case "m": can.CloneField(); break
			case "b": can.CloneInput(); break
			default: can.onkeymap.selectOutput(event, can.sup); return
		} can.onkeymap.prevent(event)
	},
})
