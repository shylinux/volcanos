Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.page.requireDraw(can, function() { can.list = can.onimport._data(can, msg, can.Conf(mdb.FIELD))
		can.core.List(can.list, function(item) { msg.Push(cli.COLOR, '<span style="background-color:'+item.color+'">     </span>').Push("weight", parseInt(item.span*100/360)+"%") })
		can.onaction.list = [], can.ui.display = can.page.Append(can, can._output, [html.DISPLAY])._target
		can.onappend.table(can, msg, null, can.ui.display), can.page.Select(can, can.ui.display, html.TR, function(tr, index) {
			can.page.Modify(can, tr, {onmouseenter: function(event) { can._draw(index-1) }})
		}), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append)
	}) },
	_data: function(can, msg, field) { var list = []
		var color = ["#3300FF", "#2196F3", "#4CAF50", "#CDDC39", "#FFEB3B", "#9C27B0", "#795548", "#607D8B", "#CC33FF"]
		var total = 0; msg.Table(function(value) { total += can.onimport._parseInt(can, value[field]) })
		var begin = 0; msg[cli.COLOR] = [], msg["weight"] = [], msg.Table(function(value, index) {
			list.push({span: can.onimport._parseInt(can, value[field])/total*360, color: color[index%color.length], value: value})
		}); return list
	},
	_draw: function(can, x, y, r, margin, which) { if (which == can._last) { return } can._last = which
		if (can.list.length == 1) { return can.onimport.draw(can, {shape: svg.CIRCLE, points: [{x: x, y: y}, {x: x, y: y+r}], style: {fill: "blue"}}) }
		function pos(x, y, r, angle) { angle -= 90; return [x + r * Math.cos(angle * Math.PI / 180), y + r * Math.sin(angle * Math.PI / 180)] }
		function pie(x, y, r, begin, span, color, cb) { can.onimport.draw(can, {shape: svg.PATH, style: kit.Dict(
			svg.STROKE, color, svg.FILL, color, "d", can.base.joins([
				["M", x, y], ["L"].concat(pos(x, y, r, begin)), ["A", r, r, "0", span>180? "1": "0", "1"].concat(pos(x, y, r, begin+span)), ["Z"]
			], lex.SP, mdb.FS),
		), onmouseenter: function(event) { can.base.isFunc(cb) && cb(event) } }) }
		can.onmotion.clear(can, can.svg), can.svg.Value(mdb.COUNT, 0)
		var begin = 0; can.core.List(can.list, function(item, index) { var p = index==which? pos(x, y, margin, begin+item.span/2): [x, y]
			pie(p[0], p[1], r, begin, item.span, item.color, function(event) { can.onimport._draw(can, x, y, r, margin, index) }), begin += item.span
			index == which && can.Status(item.value)
		})
	},
	_parseInt: function(can, value) { value = value.toLowerCase()
		if (can.base.endWith(value, "mi")) { return parseInt(value)*1000000 }
		if (can.base.endWith(value, "gi")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "g")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "m")) { return parseInt(value)*1000000 }
		return parseInt(value)
	},
	layout: function(can) {
		var height = can.base.Max(can.ConfHeight(), can.ConfWidth()/2), margin = 20, r = height/2-margin; can.svg.Val(html.WIDTH, height), can.svg.Val(html.HEIGHT, height)
		can._draw = function(which) { can.onimport._draw(can, r+margin, r+margin, r, margin, which) }, can._draw(0)
	},
})
