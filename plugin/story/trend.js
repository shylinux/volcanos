Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.page.ClassList.add(can, can._fields, "draw")
		can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
			can.data = msg.Table(), can.onimport._sum(can)
			can.base.isFunc(cb) && cb(msg), can.onimport.layout(can), can.base.isFunc(cb) && cb(msg)
			can.data = msg.Table(), can.onimport._sum(can)
		})
	},
	_sum: function(can) {
		var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
		can.max = 0, can.min = 0, can.list = can.core.List(can.data, function(value, index) {
			var line = {
				date: value[can._msg.append[0]],
				text: value[can._msg.append[4]],
				add: parseInt(value[can._msg.append[1]]),
				del: parseInt(value[can._msg.append[2]]),
			}

			line.begin = rest
			line.max = rest + line.add
			line.min = rest - line.del
			line.close = rest + line.add - line.del

			begin = begin || value.date, count++
			rest = line.close, add += line.add, del += line.del

			if (line.max - line.min > max) { max = line.max - line.min }
			if (line.max > can.max) { can.max = line.max }
			if (line.min < can.min) { can.min = line.min }
			return line
		})
		can.Status({"from": begin, "commit": count, "total": add+del, "max": max})
	},
	_layout: function(can) {
		var height = can.onexport.height(can)
		var width = parseInt(can.ConfWidth()), space = parseInt(can.Action("space")||"10")
		var step = parseInt((width-2*space) / can.list.length)

		can.onmotion.clear(can, can._output), can.onimport._show(can, can._msg)
		can.svg.Val(html.HEIGHT, height), can.svg.Val(html.WIDTH, width)
		return {height: height, width: width, space: space, step: step}
	},
	layout: function(can) {
		can.onaction[can.Action(ice.VIEW)]({}, can)
	},
}, [""])
Volcanos(chat.ONACTION, {help: "组件菜单", list: [
		[ice.VIEW, "趋势图", "柱状图", "数据源"],
		[html.HEIGHT, ice.AUTO, 100, 200, 400, 600, 800, ice.AUTO],
		["space", 10, 20, 50, 100],
		[html.SPEED, 10, 20, 50, 100],
	],
	"趋势图": function(event, can) { var args = can.onimport._layout(can)
		function scale(y) { return (y - can.min)/(can.max - can.min)*(args.height-2*args.space) }
		function order(index, x, y) { return {x: args.space+args.step*index+x, y: args.height-args.space-scale(y)} }

		var black = can.onimport.group(can, cli.BLACK, kit.Dict(html.STROKE, cli.BLACK, html.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(html.STROKE, cli.WHITE, html.FILL, cli.WHITE))

		can.core.Next(can.list, function(line, next, index) { can.Status(line)
			can.onimport.draw({}, can, {shape: svg.LINE, point: [
				order(index, args.step/2, line.min), order(index, args.step/2, line.max),
			]}, line.begin < line.close? white: black)

			can.onimport.draw({}, can, {shape: svg.RECT, point: [
				order(index, args.step/4, line.close), order(index, args.step/4*3, line.begin),
			], _init: function(view) {
				can.core.ItemCB(can.ondetail, function(key, cb) { view[key] = function(event) { cb(event, can, line) } })
			}}, line.begin < line.close? white: black)

			can.core.Timer(parseInt(can.Action(html.SPEED)), next)
		})
	},
	"柱状图": function(event, can) { var args = can.onimport._layout(can)
		var max = {}, min = {}; can.core.List(can._msg.append, function(key, which) {
			can.core.List(can.data, function(value, index) {
				var v = parseInt(value[key])||0; if (index == 0) {
					return max[key] = v, min[key] = v
				}
				if (v > max[key]) { max[key] = v }
				if (v < min[key]) { min[key] = v }
			})
		})

		function scale(key, y) { return (y - min[key])/(max[key] - min[key])*(args.height-2*args.space) }

		var width = args.step/can._msg.append.length, which = 0
		can.core.List(can._msg.append, function(key, which) { if (max[key] == min[key]) { return }
			can.core.Next(can.data, function(line, next, index) { if (parseInt(line[key]) == 0) { return }
				can.onimport.draw({}, can, {shape: svg.RECT, point: [
					{x: args.space+args.step*index+width*which+2, y: args.height-args.space-scale(key, parseInt(line[key]))},
					{x: args.space+args.step*index+width*(which+1)+2, y: args.height-args.space},
				], style: kit.Dict(html.STROKE_WIDTH, 1, html.STROKE, cli.WHITE, html.FILL, cli.WHITE, svg.RX, 0, svg.RY, 0), _init: function(view) {
					can.core.ItemCB(can.ondetail, function(key, cb) { view[key] = function(event) { cb(event, can, line) } })
				}}), can.core.Timer(parseInt(can.Action(html.SPEED)), next)
			}), which++
		})
	},
	"数据源": function(event, can) {
		can.onmotion.clear(can, can._output)
		can.onappend.table(can, can._msg, null, can._output)
	},

	height: function(event, can) { can.onimport.layout(can) },
	space: function(event, can) { can.onimport.layout(can) },
	speed: function(event, can) { can.onimport.layout(can) },
})
Volcanos(chat.ONDETAIL, {help: "用户交互",
	onmouseenter: function(event, can, line) { can.Status(line) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["from", "commit", "total", "max", "date", "text", "add", "del"],
	height: function(can) { var height = can.Action(html.HEIGHT)
		if (height == ice.AUTO) { height = can.ConfHeight()
			// can.isFullMode() || (height = can.base.Max(can.ConfHeight(), 600))
		}
		if (height < 200) { height = 200 }
		return parseInt(height||can._root._height/2)
	},
})
