Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onappend.style(can, [web.STATS, html.FLEX], can._output)
		var FIELD = can.Conf(mdb.FIELD)||mdb.NAME, VALUE = can.Conf(mdb.VALUE)||mdb.VALUE
		var list = {}, stats = {}, units = {}, trans = {}, index = {}; msg.Table(function(value) {
			stats[value[FIELD]] = parseFloat(stats[value[FIELD]]||"0") + parseFloat(value[VALUE])
			units[value[FIELD]] = value.units, trans[value[FIELD]] = value._trans
			index[value[FIELD]] = value.index, list[value[FIELD]] = value
		})
		function fmts(value) { var ls = []
			while (value > 0) { ls.push(value%1000)
				if (ls.length == 1) { ls[0] = ls[0].toFixed(2) }
				value = parseInt(value/1000)
			} return ls.reverse().join(", ")
		}
		can.user.trans(can, trans, null, html.INPUT)
		can.core.Item(stats, function(name, value) { can.page.Append(can, can._output, [{view: [[html.ITEM, name, html.FLEX]], list: [
			{view: mdb.VALUE, list: [{text: can.base.trimSuffix(fmts(parseFloat(value).toFixed(2))+"", ".00")}, {text: [units[name], "", mall.UNITS]}]},
			{view: [mdb.NAME, "", can.user.trans(can, name, trans[name]||null, html.INPUT)]},
		], onclick: function() {
			can.onappend.plugin(can, {space: list[name].space, index: index[name], style: html.FLOAT})
		}}]) }), can.isCmdMode() && can.onappend.table(can, msg)
	},
})
