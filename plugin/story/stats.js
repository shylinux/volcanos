Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, "stats", can._output)
		var units = {}, stats = {}; msg.Table(function(value) { units[value.name] = value.units
			stats[value.name] = parseFloat(stats[value.name]||"0") + parseFloat(value.value)
		})
		function fmts(value) { var ls = []
			while (value > 0) { ls.push(value%1000)
				if (ls.length == 1) { ls[0] = ls[0].toFixed(2) }
				value = parseInt(value/1000)
			}
			return ls.reverse().join(", ")
		}
		can.core.Item(stats, function(name, value) { can.page.Append(can, can._output, [{view: [[html.ITEM, name]], list: [
			{view: [mdb.VALUE, "", can.base.trimSuffix(fmts(parseFloat(value).toFixed(2))+"", ".00")+" "+units[name]]},
			{view: [mdb.NAME, "", can.user.trans(can, name, null, html.INPUT)]},
		]}]) }), can.isCmdMode() && can.onappend.table(can, msg)
	},
})
