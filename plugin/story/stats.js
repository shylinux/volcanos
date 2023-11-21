Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, "stats", can._output)
		var stats = {}, units = {}, index = {}; msg.Table(function(value) { units[value.name] = value.units
			stats[value.name] = parseFloat(stats[value.name]||"0") + parseFloat(value.value)
			index[value.name] = value.index
		})
		function fmts(value) { var ls = []
			while (value > 0) { ls.push(value%1000)
				if (ls.length == 1) { ls[0] = ls[0].toFixed(2) }
				value = parseInt(value/1000)
			} return ls.reverse().join(", ")
		}
		can.core.Item(stats, function(name, value) { can.page.Append(can, can._output, [{view: [[html.ITEM, name]], list: [
			{view: mdb.VALUE, list: [{text: can.base.trimSuffix(fmts(parseFloat(value).toFixed(2))+"", ".00")}, {text: [units[name], "", "units"]}]},
			{view: [mdb.NAME, "", can.user.trans(can, name, null, html.INPUT)]},
		], onclick: function() {
			can.onappend.plugin(can, {index: index[name], style: html.FLOAT})
		}}]) }), can.isCmdMode() && can.onappend.table(can, msg)
	},
})
