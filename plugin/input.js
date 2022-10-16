Volcanos(chat.ONACTION, {help: "控件交互", _init: function(can, meta, cb, target) {
		can.base.isFunc(cb) && cb(); switch (meta.type) {
			case html.SELECT: meta.value && (target.value = meta.value); break
			case html.BUTTON: !can.sup._delay_init && meta.action == ice.AUTO && target.click(); break
		}
	},
	run: function(event, can) { can.run(can.request(event, {_toast: "执行中..."})) },
	list: function(event, can) { can.sup.Conf("mode") != "simple" && can.run(event) },
	back: function(event, can) { can.sup.onimport._back(can.sup) },
	refresh: function(event, can) { can.run(event) },

	onclick: function(event, can) { can.sup.request(event, {_toast: "执行中..."})
		can.Conf(mdb.TYPE) == html.BUTTON && can.run(event, [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input()))
	},
	onchange: function(event, can) { can.sup.request(event, {_toast: "执行中..."})
		if (can.Conf(mdb.TYPE) == html.SELECT) { can.run(event) }
	},
	onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target)
		if (can.Conf(mdb.TYPE) == html.TEXTAREA) { if (!event.ctrlKey) { return } }
		if (event.key == lang.ENTER) {
			can.run(event), can.onmotion.focus(can, event.target)
			can.onkeymap.prevent(event)
		} if (!event.ctrlKey) { return }

		switch (event.key) {
			case "b": can.CloneInput(); break
			case "m": can.CloneField(); break
			default: return
		} can.onkeymap.prevent(event)
	},
})
