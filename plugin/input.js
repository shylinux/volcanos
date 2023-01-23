Volcanos(chat.ONACTION, {
	_init: function(can, meta, target) { meta.type == html.BUTTON && meta.action == ice.AUTO && can.sup._delay_init == undefined && target.click() },
	run: function(event, can) { can.run(event) }, refresh: function(event, can) { can.run(event) },
	list: function(event, can) { can.sup.isSimpleMode() || can.run(event) },
	back: function(event, can) { can.sup.onimport._back(can.sup) },
	onclick: function(event, can) { can.Conf(mdb.TYPE) == html.BUTTON && can.run(event, [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input())) },
	onchange: function(event, can) { can.Conf(mdb.TYPE) == html.SELECT && can.run(event) },
	onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target)
		if (can.Conf(mdb.TYPE) == html.TEXTAREA) { if (!event.ctrlKey) { return } }
		if (event.key == lang.ENTER) { return can.onkeymap.prevent(event), can.run(event), can.onmotion.focus(can, event.target) }
		if (!event.ctrlKey) { return } switch (event.key) {
			case "m": can.CloneField(); break
			case "b": can.CloneInput(); break
			default: can.onkeymap.selectOutput(event, can.sup); return
		} can.onkeymap.prevent(event)
	},
	onkeyup: function(event, can) {
		if (event.key == lang.ENTER) { return can.onkeymap.prevent(event) }
		if (can.Conf(mdb.NAME) == html.FILTER) {
			can.user.toast(can, "filter out "+
			can.page.Select(can, can._output, html.TR, function(tr) {
				if (!can.page.ClassList.set(can, tr, html.HIDE, tr.innerText.indexOf(event.target.value) == -1)) {
					return tr
				}
			}).length+" lines")
		}
	},
	onfocus: function(event, can) {
		can.Conf(mdb.TYPE) == html.TEXT && can.onmotion.selectRange(event.target)
	},
})
