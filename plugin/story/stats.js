Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, "stats", can._output)
		// can.onimport.layout = function() { can.onlayout.expand(can, can._output, 150, 100) }
		var units = {}
		var stats = {}; msg.Table(function(value) {
			stats[value.name] = parseFloat(stats[value.name]||"0") + parseFloat(value.value)
			units[value.name] = value.units
		})
		can.core.Item(stats, function(name, value) {
			can.page.Append(can, can._output, [{view: [[html.ITEM, name]], list: [
				{view: [mdb.VALUE, "", can.base.trimSuffix(parseFloat(value).toFixed(2)+"", ".00")+" "+units[name]]},
				{view: [mdb.NAME, "", can.user.trans(can, name, null, html.INPUT)]},
			]}])
		})
		can.isCmdMode() && can.onappend.table(can, msg)
	},
})
