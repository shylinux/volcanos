Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.page.requireDraw(can, function() { can.db.delay = 50
		can.list = can.onimport._data(can, msg, can.Conf(mdb.FIELD)||msg.append[1]||mdb.VALUE)
		can.core.List(can.list, function(item) { msg.Push("weight", item.value.weight = parseInt(item.span*100/360)+"%").Push(cli.COLOR, '<span style="background-color:'+item.color+'">    </span>') })
		can.onaction.list = [], can.ui.display = can.page.Append(can, can._output, [html.DISPLAY])._target
		can.onappend.table(can, msg, null, can.ui.display), can.page.Select(can, can.ui.display, html.TR, function(tr, index) { can.ui.table = tr.parentNode
			can.page.Modify(can, tr, {onmouseenter: function(event) { can._draw(can.db.which = index-1) }})
		}), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append)
	}) },
	_data: function(can, msg, field) { var list = []
		var color = [
			"#8085e9",
			"#95a2ff",
			"#73abf5",
			"#3cb9fc",
			"#0082fc",
			"#87e885",
			"#90ed7d",
			"#22ed7c",
			"#05f8d6",
			"#cb9bff",
			"#bf19ff",
			"#f47a75",
			"#fa8080",
			"#f7a35c",
			"#ffc076",
			"#f9e264",
			"#fae768",
			"#5f45ff",
			"#02cdff",
			"#0090ff",
			"#854cff",
			"#09b0d3",
			"#1d27c9",
			"#765005",
			"#314976",
			"#009db2",
			"#024b51",
			"#0780cf",
		]
		var total = 0; msg.Table(function(value) { total += can.onimport._parseInt(can, value[field]) })
		var begin = 0; msg[cli.COLOR] = [], msg["weight"] = [], msg.Table(function(value, index) {
			list.push({span: can.onimport._parseInt(can, value[field])/total*360, color: color[index%color.length], value: value})
		}); return list
	},
	_draw: function(can, x, y, r, margin, which) { if (which == can._last) { return } can._last = which
		if (can.list.length == 1) { return can.onimport.draw(can, {shape: svg.CIRCLE, points: [{x: x, y: y}, {x: x, y: y+r}], style: {fill: cli.BLUE}}) }
		function pos(x, y, r, angle) { angle -= 90; return [x + r * Math.cos(angle * Math.PI / 180), y + r * Math.sin(angle * Math.PI / 180)] }
		function pie(x, y, r, begin, span, color, title, cb) { can.onimport.draw(can, {shape: svg.PATH, style: kit.Dict(
			svg.STROKE, color, svg.FILL, color, "d", can.base.joins([
				["M", x, y], ["L"].concat(pos(x, y, r, begin)), ["A", r, r, "0", span>180? "1": "0", "1"].concat(pos(x, y, r, begin+span)), ["Z"]
			], lex.SP, mdb.FS),
		), onmouseenter: function(event) { can.base.isFunc(cb) && cb(event) } }) }
		can.onmotion.clear(can, can.ui.svg), can.ui.svg.Value(mdb.COUNT, 0)
		var begin = 0; can.core.Next(can.list, function(item, next, index) { var p = index==which? pos(x, y, margin*4, begin+item.span/2): [x, y]
			pie(p[0], p[1], r, begin, item.span, item.color, item.name||item.command, function(event) { can.onimport._draw(can, x, y, r, margin, can.db.which = index) }), begin += item.span
			index == which && (can.db.current = item.value)
			can.onmotion.select(can, can.ui.table, html.TR, index), can.Status(item.value), can.onmotion.delay(can, next, can.db.delay)
		}, function() {
			can.onmotion.select(can, can.ui.table, html.TR, which), can.Status(can.db.current), can.db.delay = 0
		})
	},
	_parseInt: function(can, value) { value = value.toLowerCase()
		if (can.base.endWith(value, "m")) { return parseInt(value)*1000000 }
		if (can.base.endWith(value, "g")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "gi")) { return parseInt(value)*1000000000 }
		if (can.base.endWith(value, "mi")) { return parseInt(value)*1000000 }
		return parseInt(value)
	},
	layout: function(can) { if (!can.ui || !can.ui.svg) { return }
		var height = can.base.Max(can.ConfHeight(), can.ConfWidth()/2), margin = 10, r = height/2-5*margin
		can.page.style(can, can.ui.display, html.WIDTH, can.ConfWidth()-height), can.ui.svg.Val(html.HEIGHT, height), can.ui.svg.Val(html.WIDTH, height)
		can._draw = function(which) { can.onimport._draw(can, height/2-margin/2, can.ConfHeight()/2-margin/2, r, margin, which) }, can._draw(can.db.which||0)
		can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
	},
})
