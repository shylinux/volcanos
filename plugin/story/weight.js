Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) {
		if (msg.Length() == 0) { return }
		can.ui = can.onappend.layout(can)
		can.page.requireDraw(can, function() { can.db.delay = 50, can.onappend.style(can, "pie"), can.onaction.list = []
			can.list = can.onimport._data(can, msg, can.Conf(mdb.FIELD)||msg.append[1]||mdb.VALUE)
			can.core.List(can.list, function(item) { var weight = parseFloat(item.span*100/360).toFixed(2)
				msg.Push("weight", item.value.weight = weight+"%").Push(cli.COLOR, '<span style="background-color:'+item.color+'">    </span>')
			})
			if (can.user.isMobile) {
				can.onappend.table(can, msg, null, can.ui.display)
			} else {
				can.onappend.table(can, msg, null, can.ui.profile)
			}
			can.page.Append(can, can._output, [{view: ["total", "", "总和："+can.db.total]}])
			can.page.Select(can, can.user.isMobile? can.ui.display: can.ui.profile, html.TR, function(tr, index) { can.ui.table = tr.parentNode
				can.page.Modify(can, tr, {onmouseenter: function(event) { can._draw(can.db.which = index-1) }})
			}), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append)
		})
	},
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
		can.db.total = total
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
		var begin = 0; can.core.Next(can.list, function(item, next, index) { var p = index==which? pos(x, y, 1*margin, begin+item.span/2): [x, y]
			if (item.value.name == "rest") { return can.onmotion.delay(can, next, can.db.delay) }
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
		if (can.user.isMobile) {
			var width = can.ConfWidth(), height = can.ConfWidth(), margin = 10, r = can.base.Max(height, width)/2-1*margin-margin
			can.ui.svg.Val(html.WIDTH, width), can.ui.svg.Val(html.HEIGHT, height)
			can._draw = function(which) { can.onimport._draw(can, width/2-margin/2, height/2-margin/2, r, margin, which) }, can._draw(can.db.which||-1)
			can.onmotion.toggle(can, can.ui.display, true)
			can.page.style(can, can._output, "max-height", "unset")
			return
		}
		can.onmotion.hidden(can, can.ui.project), can.onmotion.hidden(can, can.ui.display)
		can.onmotion.toggle(can, can.ui.profile, true)
		var _width = can.base.Max(can.ConfWidth()-can.ConfHeight(), 600, 200)
		can.page.style(can, can.ui.profile, html.HEIGHT, can.ConfHeight(), html.WIDTH, _width, html.FLEX, "0 0 "+(_width)+"px")
		var width = can.ConfWidth()-_width, height = can.ConfHeight()-4, margin = 10, r = can.base.Max(height, width)/2-1*margin-margin
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, width)
		can.ui.svg.Val(html.WIDTH, width), can.ui.svg.Val(html.HEIGHT, height)
		can._draw = function(which) { can.onimport._draw(can, width/2-margin/2, height/2-margin/2, r, margin, which) }, can._draw(can.db.which||-1)
	},
})
