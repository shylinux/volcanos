Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.page.requireDraw(can, function() { can.base.isFunc(cb) && cb(msg)
		can.Conf(ice.VIEW) && can.Action(ice.VIEW, can.Conf(ice.VIEW)), can.onmotion.toggle(can, can._option, !can.user.isMobile || !can.isFullMode())
		can.db.data = msg.Table(), can.onimport.layout(can)
	}) },
	_sum: function(can) { if (can.db.list) { return can.db.list }
		var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
		can.max = 0, can.min = 0, can.db.list = can.core.List(can.db.data, function(value, index) {
			var item = {date: value[can._msg.append[0]], text: value[can._msg.append[4]], add: parseInt(value[can._msg.append[1]]), del: parseInt(value[can._msg.append[2]]), hash: value.hash}
			item.begin = rest, item.max = rest + item.add, item.min = rest - item.del, item.close = rest + item.add - item.del
			begin = begin || item.date, count++, rest = item.close, add += item.add, del += item.del
			if (item.max - item.min > max) { max = item.max - item.min }
			if (item.max > can.max) { can.max = item.max }
			if (item.min < can.min) { can.min = item.min }
			return item
		}), can.Status({"from": begin, "commit": count, "total": add+del, "max": max})
		return can.db.list
	},
	_layout: function(can) { var height = can.onexport.height(can), width = parseInt(can.ConfWidth())
		can.onmotion.clear(can, can.svg), can.svg.Val(html.HEIGHT, height), can.svg.Val(html.WIDTH, width)
		var margin = parseInt(can.Action(html.MARGIN)), step = parseFloat((width-2*margin) / can._msg.Length())
		can.page.style(can, can._output, html.MAX_HEIGHT, "")
		return {height: height, width: width, margin: margin, step: step}
	},
	layout: function(can) { can.db.data && can.core.CallFunc(can.onaction[can.Action(ice.VIEW)], [{}, can]) },
	// transform: function(can, target) { target.Value("transform", "scale(1, -1)") },
	transform: function(can, target) { target.Value("transform", "translate(0, "+parseInt(can.ConfHeight())+") scale(1, -1)") },
})
Volcanos(chat.ONACTION, {list: [[ice.VIEW, "趋势图", "柱状图", "折线图", "数据源"],
		[html.HEIGHT, ice.AUTO, 100, 200, 400, 600, 800], [html.MARGIN, 10, 20, 50, 100], [html.SPEED, 10, 20, 50, 100],
	],
	"趋势图": function(event, can) { var args = can.onimport._layout(can)
		function scale(y) { return (y - can.min)/(can.max - can.min)*(args.height-2*args.margin) }
		function order(index, x, y) { return {x: args.margin+args.step*index+x, y: args.height-args.margin-scale(y)} }
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		can.core.Next(can.onimport._sum(can), function(item, next, index) { can.core.Timer(parseInt(can.Action(html.SPEED)), next), can.Status(item)
			can.onimport.draw(can, {shape: svg.LINE, points: [order(index, args.step/2, item.min), order(index, args.step/2, item.max)]}, item.begin < item.close? white: black)
			can.onimport.draw(can, {shape: svg.RECT, points: [order(index, args.step/4, item.close), order(index, args.step/4*3, item.begin)], style: {rx: 0, ry:0}, _init: function(target) {
				can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, can, item) }) } })
			}}, item.begin < item.close? white: black)
		})
	},
	"折线图": function(event, can) { var args = can.onimport._layout(can); args.step = parseFloat((args.width-2*args.margin) / (can._msg.Length()-1))
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		var group = can.getHeaderTheme() == cli.BLACK? white: black;
		var color = can.core.List(can.base.Obj(can.Conf(cli.COLOR), []), function(color) { return can.onimport.group(can, color, kit.Dict(svg.STROKE, color, svg.FILL, color)) })
		can.onimport.transform(can, black), can.onimport.transform(can, white), can.core.List(color, function(color) { can.onimport.transform(can, color) })
		var max, min; can.core.List(can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) {
			if (can.base.isIn(field, "time", "id")) { return } return field
		}), function(field, index) { max = can.db.data[0][field], min = can.db.data[0][field]
			for (var i = 1; i < can.db.data.length; i += 1) { var value = can.db.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			max = parseFloat(can.Conf("max")||max), min = parseFloat(can.Conf("min")||min)
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			for (var i = 1; i < can.db.data.length; i += 1) { can.onimport.draw(can, {shape: svg.LINE, points: [{x: order(i-1), y: scale(can.db.data[i-1][field])}, {x: order(i), y: scale(can.db.data[i][field])}]}, color[index]||group) }
		}), can.onappend._status(can, can._msg.Option(ice.MSG_STATUS))
		var gray = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.GRAY, svg.FILL, cli.GRAY)); can.onimport.transform(can, gray)
		var vline = can.onimport.draw(can, {shape: svg.LINE, points: [{x: 0, y: 0}, {x: 0, y: can.ConfHeight()}]}, gray)
		var hline = can.onimport.draw(can, {shape: svg.LINE, points: [{x: 0, y: 0}, {x: can.ConfWidth(), y: 0}]}, gray)
		can.svg.onmousemove = function(event) { var p = can._output.getBoundingClientRect(); p = {x: event.clientX - p.x, y: event.clientY - p.y}
			vline.Val("x1", p.x), vline.Val("x2", p.x), hline.Val("y1", can.ConfHeight()-p.y), hline.Val("y2", can.ConfHeight()-p.y)
			var item = can.db.data[parseInt((p.x - args.margin)/args.step)]
			item && can.Status(item), can.Status("cursor", parseInt((can.ConfHeight()-p.y-args.margin)/(can.ConfHeight()-2*args.margin)*max))
		}
	},
	"柱状图": function(event, can) { var args = can.onimport._layout(can)
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		var group = can.getHeaderTheme() == cli.BLACK? black: white
		can.onimport.transform(can, black), can.onimport.transform(can, white)
		can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) { var max = can.db.data[0][field], min = can.db.data[0][field]
			for (var i = 1; i < can.db.data.length; i += 1) { var value = can.db.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			can.core.Next(can.db.data, function(item, next, i) { can.core.Timer(parseInt(can.Action(html.SPEED)), next)
				can.onimport.draw(can, {shape: svg.RECT, style: {rx: 0, ry: 0}, points: [{x: order(i)+args.step/8.0, y: args.margin}, {x: order(i)+args.step/8.0*7, y: scale(item[field])}], _init: function(target) {
					can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, can, item) }) } })
				}}, group)
			})
		})
	},
	"数据源": function(event, can) { can.onmotion.clear(can), can.onappend.table(can, can._msg) },
	height: function(event, can) { can.onimport.layout(can) },
	margin: function(event, can) { can.onimport.layout(can) },
	speed: function(event, can) { can.onimport.layout(can) },
})
Volcanos(chat.ONDETAIL, {
	onmouseenter: function(event, can, item) { can.Status(item) },
	onclick: function(event, can, item) { can.run(can.request(event, item, can.Option()), [mdb.DETAIL], function(msg) {
		can.getActionSize(function(left, top, width, height) { msg.Option(html.HEIGHT, height*3/4), msg.Option(html.WIDTH, width*3/4)
			can.sup.onimport._field(can.sup, msg, function(sub) { can.onmotion.move(can, sub._target, {left: left||0, top: (top||0)+height/4}) })
		})
	}) },
})
Volcanos(chat.ONEXPORT, {list: ["from", "commit", "total", "max", "date", "text", "add", "del"],
	height: function(can) { var height = can.Action(html.HEIGHT)
		if (height == ice.AUTO) { height = can.ConfHeight() } if (height < 200) { height = 200 }
		return parseInt(height||can.page.height()/2)
	},
})
