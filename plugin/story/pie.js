Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)

		var color = [cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE]
		var color = ["#3300FF", "#2196F3", "#4CAF50", "#CDDC39", "#FFEB3B", "#9C27B0", "#795548", "#607D8B", "#CC33FF"]
		var height = msg.Option(html.HEIGHT)||can.ConfHeight()

		can.page.ClassList.add(can, can._fields, "draw")
		can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
			can.onimport._show(can, msg), can.onappend._status(can, [].concat(msg.append, ["weight"]))
			var margin = height/8, r = height/2-margin; can.svg.Val(html.WIDTH, 2*(r+margin)), can.svg.Val(html.HEIGHT, 2*(r+margin))
			can.onimport._draw(can, msg, can.Conf(mdb.FIELD), color, r+margin, r+margin, r, margin, 0)

			can.page.style(can, can.ui.project, html.MAX_WIDTH, can.ConfWidth()-height)
			can.onmotion.clear(can, can.ui.project), can.onmotion.toggle(can, can.ui.project, true)
			can.onappend.table(can, msg, null, can.ui.project), can.page.Select(can, can.ui.project, html.TR, function(tr, index) {
				can.page.Modify(can, tr, {onmouseenter: function(event) {
					can.onimport._draw(can, msg, can.Conf(mdb.FIELD), color, r+margin, r+margin, r, margin, index-1)
				}})
			})
		})
	},
	_draw: function(can, msg, field, color, x, y, r, margin, which) { field = field||mdb.VALUE
		function pos(x, y, r, angle) { angle -= 90; return [x + r * Math.cos(angle * Math.PI / 180), y + r * Math.sin(angle * Math.PI / 180)] }
		function pie(x, y, r, begin, span, color, cb) { can.onimport.draw({}, can, {shape: svg.PATH, style: kit.Dict(
			html.STROKE_WIDTH, 1, html.STROKE, color, html.FILL, color, "d", can.base.joins([
				["M", x, y], ["L"].concat(pos(x, y, r, begin)), ["A", r, r, "0", span>180? "1": "0", "1"].concat(pos(x, y, r, begin+span)), ["Z"]
			], ice.SP, ice.FS),
		), onmouseenter: function(event) { can.base.isFunc(cb) && cb(event) } }) }

		if (which == can._last) { return } can._last = which
		can.onmotion.clear(can, can.svg), can.svg.Value(mdb.COUNT, 0)
		var total = 0; msg.Table(function(value) { total += can.onimport._parseInt(can, value[field]) })
		var begin = 0; msg[cli.COLOR] = [], msg["weight"] = [], msg.Table(function(value, index) { var span = can.onimport._parseInt(can, value[field])/total*360
			var p = index==which? pos(x, y, margin, begin+span/2): [x, y], c = color[index%color.length]

			if (msg.Length() == 1) {
				can.onimport.draw({}, can, {shape: svg.CIRCLE, point: [{x: x, y: y}, {x: x, y: y+r}], style: {fill: color[0]}})
			} else {
				pie(p[0], p[1], r, begin, span, c, function(event) { can.onimport._draw(can, msg, field, color, x, y, r, margin, index) }), begin += span
			}
			msg.Push(cli.COLOR, '<span style="background-color:'+c+'">     </span>')
			msg.Push("weight", parseInt(span*100/360)+"%")
			if (index == which) { can.Status(value), can.Status("weight", parseInt(span*100/360)+"%") }
		})
	},
	_parseInt: function(can, value) { value = value.toLowerCase()
		if (can.base.endWith(value, "mi")) { return parseInt(value)*1000000 }
		if (can.base.endWith(value, "gi")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "g")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "m")) { return parseInt(value)*1000000 }
		return parseInt(value)
	}
})
Volcanos(chat.ONEXPORT, {help: "导出数据", _show: function(can) {}})
