Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.requireDraw(function() {
		can.data = msg.Table(), can.base.isFunc(cb) && cb(msg), can.onimport.layout(can)
	}) },
	_sum: function(can) { if (can.list) { return can.list }
		var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
		can.max = 0, can.min = 0, can.list = can.core.List(can.data, function(value, index) {
			var item = {
				date: value[can._msg.append[0]],
				text: value[can._msg.append[4]],
				add: parseInt(value[can._msg.append[1]]),
				del: parseInt(value[can._msg.append[2]]),
			}

			item.begin = rest
			item.max = rest + item.add
			item.min = rest - item.del
			item.close = rest + item.add - item.del

			begin = begin || value.date, count++
			rest = item.close, add += item.add, del += item.del

			if (item.max - item.min > max) { max = item.max - item.min }
			if (item.max > can.max) { can.max = item.max }
			if (item.min < can.min) { can.min = item.min }
			return item
		})
		can.Status({"from": begin, "commit": count, "total": add+del, "max": max})
		return can.list
	},
	_layout: function(can) {
		var height = can.onexport.height(can), width = parseInt(can.ConfWidth())
		can.onmotion.clear(can, can._output), can.onimport._show(can, can._msg)
		can.svg.Val(html.HEIGHT, height), can.svg.Val(html.WIDTH, width)
		var margin = parseInt(can.Action(html.MARGIN)), step = parseFloat((width-2*margin) / can._msg.Length())
		return {height: height, width: width, margin: margin, step: step}
	},
	layout: function(can) {
		can.onmotion.toggle(can, can._option, !can.user.isMobile || !can.isFullMode())
		can.Conf(ice.VIEW) && can.Action(ice.VIEW, can.Conf(ice.VIEW))
		can.onaction[can.Action(ice.VIEW)]({}, can)
	},
	transform: function(can, target) {
		target.Value("transform", "translate(0, "+parseInt(can.ConfHeight())+") scale(1, -1)")
	},
}, [""])
Volcanos(chat.ONACTION, {list: [
		[ice.VIEW, "趋势图", "柱状图", "折线图", "数据源"],
		[html.HEIGHT, ice.AUTO, 100, 200, 400, 600, 800],
		[html.MARGIN, 10, 20, 50, 100],
		[html.SPEED, 10, 20, 50, 100],
	],
	"趋势图": function(event, can) { var args = can.onimport._layout(can)
		function scale(y) { return (y - can.min)/(can.max - can.min)*(args.height-2*args.margin) }
		function order(index, x, y) { return {x: args.margin+args.step*index+x, y: args.height-args.margin-scale(y)} }
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		can.core.Next(can.onimport._sum(can), function(item, next, index) { can.core.Timer(parseInt(can.Action(html.SPEED)), next), can.Status(item)
			can.onimport.draw(can, {shape: svg.LINE, points: [
				order(index, args.step/2, item.min), order(index, args.step/2, item.max),
			]}, item.begin < item.close? white: black)

			can.onimport.draw(can, {shape: svg.RECT, points: [
				order(index, args.step/4, item.close), order(index, args.step/4*3, item.begin),
			], style: {rx: 0, ry:0}, _init: function(target) {
				can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { cb(event, can, item) } })
			}}, item.begin < item.close? white: black)
		})
	},
	"折线图": function(event, can) { var args = can.onimport._layout(can); args.step = parseFloat((args.width-2*args.margin) / (can._msg.Length()-1))
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		var group = can.getHeaderTopic() == cli.BLACK? black: white
		can.onimport.transform(can, black), can.onimport.transform(can, white)
		can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) { var max = can.data[0][field], min = can.data[0][field]
			for (var i = 1; i < can.data.length; i += 1) { var value = can.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			for (var i = 1; i < can.data.length; i += 1) {
				can.onimport.draw(can, {shape: svg.LINE, points: [{x: order(i-1), y: scale(can.data[i-1][field])}, {x: order(i), y: scale(can.data[i][field])}]}, group)
			}
		})
	},
	"柱状图": function(event, can) { var args = can.onimport._layout(can)
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		var group = can.getHeaderTopic() == cli.BLACK? black: white
		can.onimport.transform(can, black), can.onimport.transform(can, white)
		can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) { var max = can.data[0][field], min = can.data[0][field]
			for (var i = 1; i < can.data.length; i += 1) { var value = can.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			can.core.Next(can.data, function(item, next, i) { can.core.Timer(parseInt(can.Action(html.SPEED)), next)
				can.onimport.draw(can, {shape: svg.RECT, style: {rx: 0, ry: 0}, points: [{x: order(i)+args.step/8.0, y: args.margin}, {x: order(i)+args.step/8.0*7, y: scale(item[field])}], _init: function(target) {
					can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { cb(event, can, item) } })
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
})
Volcanos(chat.ONEXPORT, {list: ["from", "commit", "total", "max", "date", "text", "add", "del"],
	height: function(can) { var height = can.Action(html.HEIGHT)
		if (height == ice.AUTO) { height = can.ConfHeight() } if (height < 200) { height = 200 }
		return parseInt(height||can.page.height()/2)
	},
})

Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.requireDraw(function() {
		can.data = msg.Table(), can.base.isFunc(cb) && cb(msg), can.onimport.layout(can)
	}) },
	_sum: function(can) { if (can.list) { return can.list }
		var begin = "", count = 0, rest = 0, add = 0, del = 0, max = 0
		can.max = 0, can.min = 0, can.list = can.core.List(can.data, function(value, index) {
			var item = {
				date: value[can._msg.append[0]],
				text: value[can._msg.append[4]],
				add: parseInt(value[can._msg.append[1]]),
				del: parseInt(value[can._msg.append[2]]),
			}

			item.begin = rest
			item.max = rest + item.add
			item.min = rest - item.del
			item.close = rest + item.add - item.del

			begin = begin || value.date, count++
			rest = item.close, add += item.add, del += item.del

			if (item.max - item.min > max) { max = item.max - item.min }
			if (item.max > can.max) { can.max = item.max }
			if (item.min < can.min) { can.min = item.min }
			return item
		})
		can.Status({"from": begin, "commit": count, "total": add+del, "max": max})
		return can.list
	},
	_layout: function(can) {
		var height = can.onexport.height(can), width = parseInt(can.ConfWidth())
		can.onmotion.clear(can, can._output), can.onimport._show(can, can._msg)
		can.svg.Val(html.HEIGHT, height), can.svg.Val(html.WIDTH, width)
		var margin = parseInt(can.Action(html.MARGIN)), step = parseFloat((width-2*margin) / can._msg.Length())
		return {height: height, width: width, margin: margin, step: step}
	},
	layout: function(can) {
		can.onmotion.toggle(can, can._option, !can.user.isMobile || !can.isFullMode())
		can.Conf(ice.VIEW) && can.Action(ice.VIEW, can.Conf(ice.VIEW))
		can.onaction[can.Action(ice.VIEW)]({}, can)
	},
	transform: function(can, target) {
		target.Value("transform", "translate(0, "+parseInt(can.ConfHeight())+") scale(1, -1)")
	},
}, [""])
Volcanos(chat.ONACTION, {list: [
		[ice.VIEW, "趋势图", "柱状图", "折线图", "数据源"],
		[html.HEIGHT, ice.AUTO, 100, 200, 400, 600, 800],
		[html.MARGIN, 10, 20, 50, 100],
		[html.SPEED, 10, 20, 50, 100],
	],
	"趋势图": function(event, can) { var args = can.onimport._layout(can)
		function scale(y) { return (y - can.min)/(can.max - can.min)*(args.height-2*args.margin) }
		function order(index, x, y) { return {x: args.margin+args.step*index+x, y: args.height-args.margin-scale(y)} }
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		can.core.Next(can.onimport._sum(can), function(item, next, index) { can.core.Timer(parseInt(can.Action(html.SPEED)), next), can.Status(item)
			can.onimport.draw(can, {shape: svg.LINE, points: [
				order(index, args.step/2, item.min), order(index, args.step/2, item.max),
			]}, item.begin < item.close? white: black)

			can.onimport.draw(can, {shape: svg.RECT, points: [
				order(index, args.step/4, item.close), order(index, args.step/4*3, item.begin),
			], style: {rx: 0, ry:0}, _init: function(target) {
				can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { cb(event, can, item) } })
			}}, item.begin < item.close? white: black)
		})
	},
	"折线图": function(event, can) { var args = can.onimport._layout(can); args.step = parseFloat((args.width-2*args.margin) / (can._msg.Length()-1))
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		can.onimport.transform(can, black), can.onimport.transform(can, white)
		can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) { var max = can.data[0][field], min = can.data[0][field]
			for (var i = 1; i < can.data.length; i += 1) { var value = can.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			for (var i = 1; i < can.data.length; i += 1) {
				can.onimport.draw(can, {shape: svg.LINE, points: [{x: order(i-1), y: scale(can.data[i-1][field])}, {x: order(i), y: scale(can.data[i][field])}]}, white)
			}
		})
	},
	"柱状图": function(event, can) { var args = can.onimport._layout(can)
		var black = can.onimport.group(can, cli.BLACK, kit.Dict(svg.STROKE, cli.BLACK, svg.FILL, cli.BLACK))
		var white = can.onimport.group(can, cli.WHITE, kit.Dict(svg.STROKE, cli.WHITE, svg.FILL, cli.WHITE))
		can.onimport.transform(can, black), can.onimport.transform(can, white)
		can.core.List(can.base.Obj(can.Conf(mdb.FIELD), can._msg.append), function(field) { var max = can.data[0][field], min = can.data[0][field]
			for (var i = 1; i < can.data.length; i += 1) { var value = can.data[i][field]; if (value > max) { max = value } if (value < min) { min = value } }
			function order(i) { return i*args.step+args.margin } function scale(y) { return (y - min)/(max - min)*(args.height-2*args.margin)+args.margin }
			can.core.Next(can.data, function(item, next, i) { can.core.Timer(parseInt(can.Action(html.SPEED)), next)
				can.onimport.draw(can, {shape: svg.RECT, style: {rx: 0, ry: 0}, points: [{x: order(i)+args.step/8.0, y: args.margin}, {x: order(i)+args.step/8.0*7, y: scale(item[field])}], _init: function(target) {
					can.core.ItemCB(can.ondetail, function(key, cb) { target[key] = function(event) { cb(event, can, item) } })
				}}, white)
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
})
Volcanos(chat.ONEXPORT, {list: ["from", "commit", "total", "max", "date", "text", "add", "del"],
	height: function(can) { var height = can.Action(html.HEIGHT)
		if (height == ice.AUTO) { height = can.ConfHeight() } if (height < 200) { height = 200 }
		return parseInt(height||can.page.height()/2)
	},
})
