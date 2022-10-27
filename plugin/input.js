Volcanos(chat.ONACTION, {
	_init: function(can, meta, target) { meta.type == html.BUTTON && meta.action == ice.AUTO && !can.sup._delay_init && target.click() },
	run: function(event, can) { can.run(can.request(event, {_toast: ice.PROCESS})) },
	list: function(event, can) { can.sup.Conf("mode") != chat.SIMPLE && can.run(event) },
	back: function(event, can) { can.sup.onimport._back(can.sup) },
	refresh: function(event, can) { can.run(event) },

	onclick: function(event, can) { can.Conf(mdb.TYPE) == html.BUTTON && can.run(can.request(event, {_toast: ice.PROCESS}), [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input())) },
	onchange: function(event, can) { can.Conf(mdb.TYPE) == html.SELECT && can.run(can.request(event, {_toast: ice.PROCESS})) },
	onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target)
		if (can.Conf(mdb.TYPE) == html.TEXTAREA) { if (!event.ctrlKey) { return } }
		if (event.key == lang.ENTER) { return can.run(event), can.onmotion.focus(can, event.target), can.onkeymap.prevent(event) }
		if (!event.ctrlKey) { return }
		switch (event.key) {
			case "b": can.CloneInput(); break
			case "m": can.CloneField(); break
			default: return
		} can.onkeymap.prevent(event)
	},
})
