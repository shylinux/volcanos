Volcanos(chat.ONACTION, {
	run: function(event, can) { can.run(can.request(event, {_method: http.POST})) }, refresh: function(event, can) { can.run(can.request(event, {_method: http.GET})) },
	list: function(event, can) { can.sup.isSimpleMode() || can.run(can.request(event, {_toast: event.isTrusted? ice.PROCESS: "" , _method: http.GET})) }, back: function(event, can) { can.sup.onimport.back(event, can.sup) },
	onclick: function(event, can) { can.Conf(mdb.TYPE) == html.BUTTON && can.run(event, [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input())), can.onkeymap.prevent(event) },
	onchange: function(event, can) { if (can.Conf(mdb.TYPE) != html.SELECT) { return }
		can.sup.onexport.session && can.sup.onexport.session(can.sup, "action:"+can.Conf(mdb.NAME), event.target.value)
		can.run(can.request(event, {_toast: event.isTrusted? can.user.trans(can, ice.PROCESS, "处理"): "" , _method: http.GET}))
	},
	onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target); if (can.Conf(mdb.TYPE) == html.TEXTAREA && !event.ctrlKey) { return }
		if (event.key == code.ENTER) { return can.onkeymap.prevent(event), can.run(event), can.onmotion.focus(can, event.target) }
		if (!event.ctrlKey) { return } switch (event.key) {
			case "m": can.CloneField(); break
			case "b": can.CloneInput(); break
			default: can.onkeymap.selectOutput(event, can.sup); return
		} can.onkeymap.prevent(event)
	},
})
