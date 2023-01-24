Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.page.requireDraw(can, function() {
			can.onimport.layout(can), can.onmotion.clear(can, can.ui.project), can.onmotion.toggle(can, can.ui.project, true)
			can.onappend.table(can, msg, null, can.ui.project), can.page.Select(can, can.ui.project, html.TR, function(tr, index) {
				can.page.Modify(can, tr, {onmouseenter: function(event) { can._draw(index-1) }})
			}), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, [].concat(msg.append, ["weight"]))
		})
	},
	_draw: function(can, msg, field, color, x, y, r, margin, which) { if (which == can._last) { return } can._last = which, field = field||mdb.VALUE
		if (msg.Length() == 1) { return can.onimport.draw(can, {shape: svg.CIRCLE, points: [{x: x, y: y}, {x: x, y: y+r}], style: {fill: color[0]}}) }
		function pos(x, y, r, angle) { angle -= 90; return [x + r * Math.cos(angle * Math.PI / 180), y + r * Math.sin(angle * Math.PI / 180)] }
		function pie(x, y, r, begin, span, color, cb) { can.onimport.draw(can, {shape: svg.PATH, style: kit.Dict(
			svg.STROKE, color, svg.FILL, color, "d", can.base.joins([
				["M", x, y], ["L"].concat(pos(x, y, r, begin)), ["A", r, r, "0", span>180? "1": "0", "1"].concat(pos(x, y, r, begin+span)), ["Z"]
			], ice.SP, ice.FS),
		), onmouseenter: function(event) { can.base.isFunc(cb) && cb(event) } }) }

		can.onmotion.clear(can, can.svg), can.svg.Value(mdb.COUNT, 0)
		var total = 0; msg.Table(function(value) { total += can.onimport._parseInt(can, value[field]) })
		var begin = 0; msg[cli.COLOR] = [], msg["weight"] = [], msg.Table(function(value, index) { var span = can.onimport._parseInt(can, value[field])/total*360
			var p = index==which? pos(x, y, margin, begin+span/2): [x, y], c = color[index%color.length]
			pie(p[0], p[1], r, begin, span, c, function(event) { can.onimport._draw(can, msg, field, color, x, y, r, margin, index) }), begin += span
			msg.Push(cli.COLOR, '<span style="background-color:'+c+'">     </span>').Push("weight", parseInt(span*100/360)+"%")
			if (index == which) { can.Status(value), can.Status("weight", parseInt(span*100/360)+"%") }
		})
	},
	_parseInt: function(can, value) { value = value.toLowerCase()
		if (can.base.endWith(value, "mi")) { return parseInt(value)*1000000 }
		if (can.base.endWith(value, "gi")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "g")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "m")) { return parseInt(value)*1000000 }
		return parseInt(value)
	},
	layout: function(can) { var color = ["#3300FF", "#2196F3", "#4CAF50", "#CDDC39", "#FFEB3B", "#9C27B0", "#795548", "#607D8B", "#CC33FF"]
		var height = can.base.Max(can.ConfHeight(), can.ConfWidth()), margin = 20, r = height/2-margin; can.svg.Val(html.WIDTH, height), can.svg.Val(html.HEIGHT, height)
		can._draw = function(which) { can.onimport._draw(can, can._msg, can.Conf(mdb.FIELD), color, r+margin, r+margin, r, margin, which) }, can._draw(0)
		can.page.style(can, can.ui.project, html.MAX_WIDTH, can.ConfWidth()-height)
	},
})
