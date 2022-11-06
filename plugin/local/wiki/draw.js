Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.onmotion.clear(can)
		can.onimport._show(can, msg), can.onmotion.delay(can, function() {
			can.core.Item(kit.Dict(svg.FONT_SIZE, 24, svg.FONT_FAMILY, svg.MONOSPACE, svg.STROKE_WIDTH, 2, svg.STROKE, cli.YELLOW, svg.FILL, cli.PURPLE,
				"go", ice.RUN, svg.SHAPE, svg.RECT, svg.GRID, 10,
			), function(key, value) { can.svg.Value(key, can.Action(key, can.svg.Value(key)||value)) })
			var pid = can.Option(svg.PID)||can.svg.Value(svg.PID); if (!pid) { return }
			can.page.Select(can, can.svg, ice.PT+pid, function(target) { can.onimport._profile(can, target), can.ondetail.run({target: target}, can) })
		}), can.keylist = [], can.onkeymap._build(can), can.onmotion.hidden(can, can._action)
	},
	_show: function(can, msg) { can.svg = null, can.group = null, can.temp = null, can.current = null, can.point = []
		can.ui = can.onlayout.profile(can), can.page.Modify(can, can.ui.content, msg.Result()||can.onexport.content(can)), can.onmotion.hidden(can, can.ui.project)
		can.page.Select(can, can.ui.content, html.SVG, function(target) { can.svg = can.group = can.onimport._block(can, target), can.onimport._group(can, target).click()
			can.page.Select(can, target, mdb.FOREACH, function(target) { can.onimport._block(can, target), can.page.tagis(target, svg.G) && target.Value(html.CLASS) && can.onimport._group(can, target) })
			can.core.ItemCB(can.onaction, function(key, cb) { target[key] = function(event) { cb(event, can) } })
		}), can.page.style(can, can.ui.display, html.MIN_HEIGHT, 80, html.MAX_HEIGHT, can.ConfHeight()-can.svg.Val(html.HEIGHT)-52)
	},
	_group: function(can, target) { var name = target.Groups()
		return name && can.onimport.item(can, {name: name}, function(event) { can.group = target
			can.core.List([svg.STROKE_WIDTH, svg.STROKE, svg.FILL, svg.FONT_SIZE], function(key) {
				can.Action(key, target.Value(key)||can.Action(key))
			}), can.onaction.show(event, can), can.Status(svg.GROUP, name)
		}, function(event) { can.user.carteRight(event, can, can.onaction, can.onaction.menu_list) }, can.ui.project)
	},
	_block: function(can, target) {
		target.Val = function(key, value) { return parseInt(target.Value(key, value == undefined? value: parseInt(value)||0))||0 }
		target.Value = function(key, value) { if (can.base.isUndefined(key)) { return }
			if (can.base.isObject(key)) { can.core.Item(key, target.Value); return }
			var figure = can.onfigure._get(can, target); key = can.core.Value(figure, ["data", "trans", key])||key
			var _cb = can.core.Value(figure, ["data", key]); if (can.base.isFunc(_cb)) { return _cb(can, value, key, target) }
			if (key == ice.SHIP) { return value != undefined && target.setAttribute(key, JSON.stringify(value)), can.base.Obj(target.getAttribute(key), []) }
			if (key == html.INNER) { return value != undefined && (target.innerHTML = value), target.innerHTML }
			return value != undefined && target.setAttribute(key, value), target.getAttribute(key||html.CLASS)
				|| target[key]&&target[key].baseVal&&target[key].baseVal.value || target[key]&&target[key].baseVal || ""
		}
		target.Group = function() { for (var item = target; item; item = item.parentNode) { if (can.page.tagis(item, svg.G, html.SVG)) { return item } } return can.svg }
		target.Groups = function() { var list = []; if (target == can.svg) { return html.SVG }
			for (var item = target; item && !can.page.tagis(item, html.SVG); item = item.parentNode) { can.page.tagis(item, svg.G) && item.Value(html.CLASS) && list.push(item.Value(html.CLASS)) }
			return list.reverse().join(ice.PT)
		}
		target.oncontextmenu = function(event) {
			var carte = can.user.carte(event, can, can.ondetail, null, function(ev, button, meta) { meta[button](event, can, button) })
			can.page.style(can, carte._target, {left: event.clientX, top: event.clientY})
		}
		return target
	},
	_profile: function(can, target, list) { can.Option(svg.PID, can.onexport._pid(can, target))
		if (can.onmotion.cache(can, function() { return target.Value(svg.PID) }, can.ui.profile, can.ui.display)) { return }
		var ui = can.page.Append(can, can.ui.profile, [html.ACTION, html.OUTPUT])
		can.onappend._action(can, can.ondetail.list, ui.action, {_engine: function(event, can, button) { can.ondetail[button]({target: target}, can, button) }})
		var figure = can.onfigure._get(can, target); can.page.Append(can, ui.output, [{view: [html.CONTENT, html.TABLE], list: [
			{th: [mdb.KEY, mdb.VALUE]}, {td: [mdb.TYPE, target.tagName]}, {td: [svg.PID, target.Value(svg.PID)]},
		].concat(can.core.List((list||[]).concat(figure.data.copy, [svg.X, svg.Y, mdb.INDEX, ctx.ARGS]), function(key) {
			return key = can.core.Value(figure.data, can.core.Keys("trans", key))||key, {td: [key, target.Value(key)], ondblclick: function(event) {
				can.onmotion.modify(can, event.target, function(event, value, old) { target.Value(key, value), can.ondetail._move(can, target) })
			}}
		})) }])
	},
	draw: function(event, can, value, group) {
		var figure = can.onfigure[value.shape], data = figure.draw(event, can, value.point, value.style); can.core.Item(value.style, function(key, value) { data[key] = value })
		var target = can.onimport.block(can, figure.data.name||value.shape, data, group||can.group||can.svg); can.core.ItemCB(value, function(key, cb) { target[key] = cb })
		return can.onimport._block(can, target), value._init && value._init(target), target
	},
	group: function(can, name, value, group) { group = group||can.group||can.svg
		var g = document.createElementNS('http://www.w3.org/2000/svg', svg.G); group.append(g)
		can.onimport._block(can, g), g.Value(html.CLASS, name), can.onimport._group(can, g).click()
		return value && g.Value(value), g
	},
	block: function(can, type, value, target) {
		var _target = document.createElementNS("http://www.w3.org/2000/svg", type)
		return target.appendChild(can.onimport._block(can, _target)), _target.Value(value), _target
	},
}, [""])
Volcanos(chat.ONACTION, {list: [
		[svg.FONT_SIZE, 12, 16, 18, 24, 32],
		[svg.STROKE_WIDTH, 1, 2, 3, 4, 5],
		[svg.STROKE, cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE],
		[svg.FILL, cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE, "#0000"],

		["go", ice.RUN, ice.AUTO, "manual"],
		["mode", "draw", "resize"],
		[svg.SHAPE, svg.TEXT, svg.CIRCLE, svg.ELLIPSE, svg.RECT, svg.LINE, svg.BLOCK],
		[svg.GRID, 1, 2, 3, 4, 5, 10, 20],
	], menu_list: [ice.HIDE, ice.SHOW, mdb.CREATE, web.CLEAR, mdb.REMOVE],
	_change: function(can, key, value) { can.Action(key, value), can.group.Value(key, value) },
	"font-size": function(event, can, key, value) { can.onaction._change(can, key, value) },
	"stroke-width": function(event, can, key, value) { can.onaction._change(can, key, value) },
	stroke: function(event, can, key, value) { can.onaction._change(can, key, value) },
	fill: function(event, can, key, value) { can.onaction._change(can, key, value) },

	go: function(event, can, key, value) { can.Action(key, value) },
	mode: function(event, can, key, value) { can.Action(key, value) },
	shape: function(event, can, key, value) { can.Action(key, value) },

	edit: function(event, can) { can.Action("go", can.Action("go") == ice.RUN? ice.AUTO: ice.RUN) },
	save: function(event, can, button) { can.runAction(can.request(event, {text: can.onexport.content(can, can.svg)}), button, [can.Option(nfs.PATH)]) },

	hide: function(event, can) { can.onmotion.hide(can, {interval: 100, length: 10}, null, can.group) },
	show: function(event, can) { can.onmotion.show(can, {interval: 10, length: 1}, null, can.group) },
	create: function(event, can) { can.user.input(event, can, [svg.GROUP], function(list) { can.onimport.group(can, list[0]) }) },
	clear: function(event, can) { can.onmotion.clear(can, can.group), delete(can.temp), can.point = [] },
	remove: function(event, can) { if (can.group == can.svg) { return } can.page.Remove(can, can.group) },

	_mode: {
		run: function(event, can) { can.onimport._profile(can, event.target) },
		draw: function(event, can, point) { var shape = can.Action(svg.SHAPE), figure = can.onfigure[shape]
			if (event.type == html.CLICK) {
				debugger
			}
			figure.grid && figure.grid(event, can, point); if (figure.data.points && figure.data.points != point.length) { return }
			var data = figure.draw && figure.draw(event, can, point, {}), target = data && can.onimport.block(can, figure.data.name||shape, data, can.group)
			if (event.type == html.CLICK) { can.point = []; if (target) {
				var pid = can.onexport._pid(can, target); can.core.List(point, function(p, i) { if (!p.target) { return }
					p.target.Value(ice.SHIP, p.target.Value(ice.SHIP).concat([{pid: pid, which: i+1, anchor: p.anchor}]))
				})
			} }
			return target
		},
		resize: function(event, can, point, target) { target = target||event.target
			if (event.type == html.CLICK) { if (point.length > 1) { return can.point = [], delete(can.current) }
				return can.current = {target: target, begin: can.core.List([target], function(target) { if (can.page.tagis(target, svg.G)) { return }
					return {target: target, height: target.Val(html.HEIGHT), width: target.Val(html.WIDTH), x: target.Val(svg.X), y: target.Val(svg.Y),
						ship: can.core.List(target.Value(ice.SHIP), function(ship) { return ship.pid && (ship.target = can.page.Select(can, can.svg, ice.PT+ship.pid)[0]) && ship })
					}
				}), pos: can.onexport.cursor(event, can, target)}
			}
			can.current && can.core.List(can.current.begin, function(item) { var figure = can.onfigure._get(can, item.target)
				can.onexport.resize(event, item.target, item, point[0], point[1], can.current.pos)
				can.page.Select(can, can.svg, ice.PT+item.target.Value(mdb.TEXT), function(text) { text.Value(can.onexport._text(can, item.target, figure, {})) })
				can.ondetail._move(can, item.target, item.ship)
			})
		},
	},
	_auto: function(can, target) { if (can.point.length > 0 || can.page.tagis(target, html.TEXT)) { return }
		var pos = can.onexport.cursor(event, can, target); if (target == can.svg) { switch (pos) {
			case 5: can.Action(ice.MODE, "draw"), can.Action(svg.SHAPE, html.BLOCK), can.page.style(can, target, {cursor: "crosshair"}); break
			default: can.Action(ice.MODE, "resize")
		} } else { switch (pos) {
			case 5:
			case 9: can.Action(ice.MODE, "resize"); break
			default: can.Action(ice.MODE, "draw"), can.Action(svg.SHAPE, svg.LINE)
		} }
	},
	_figure: function(event, can, points, target) { can.temp && can.page.Remove(can, can.temp) && delete(can.temp)
		can.temp = can.core.CallFunc([can.onaction._mode, can.Action(ice.MODE)], [event, can, points, target]), can.point.length == 0 && delete(can.temp)
	},
	onmousemove: function(event, can) { var point = can.onexport._point(event, can)
		if (can.Action("go") == ice.RUN) { return } can.onexport.cursor(event, can, event.target)
		if (can.Action("go") == ice.AUTO) { can.onaction._auto(can, event.target) }
		can.onaction._figure(event, can, can.point.concat(point))
	},
	onmouseover: function(event, can) { can.onexport._show(can, event.target) },
	onclick: function(event, can) { var point = can.onexport._point(event, can)
		if (can.Action("go") == ice.RUN) { return can.onimport._profile(can, event.target), event.shiftKey? can.onaction._mode.run(event, can): can.ondetail.run(event, can) }
		can.onaction._figure(event, can, can.point = can.point.concat(point))
	},
	ondblclick: function(event, can) { can.ondetail.label(event, can) },
})
Volcanos(chat.ONDETAIL, {help: "组件详情", list: [cli.START, ice.RUN, ice.COPY, html.LABEL, mdb.MODIFY, "toimage", mdb.REMOVE],
	start: function(event, can) { var target = event.target
		var list = [target], dict = {}
		for (var i = 0; i < list.length; i++) { var ship = list[i].Value("ship")
			for (var j = 0; j < ship.length; j++) { var pid = ship[j].pid
				can.page.Select(can, can.svg, ice.PT+pid, function(item) {
					var pid = item.Value("ship")[1].pid
					can.page.Select(can, can.svg, ice.PT+pid, function(item) {
						!dict[pid] && list.push(item), dict[pid] = true
					})
				})
			}
		}
		can.core.Next(list, function(item, next) { can.onmotion.delay(can, function() {
			can.onmotion.show(can, {interval: 300, length: 10}, null, item) 
			can.user.toast(can, item.Value("index"))
			can.ondetail.run({target: item}, can), next()
		}) })
	},
	run: function(event, can) { var target = event.target
		if (!target.Value(svg.PID)) { can.onexport._pid(can, target) }
		if (can.onmotion.cache(can, function() { return target.Value(svg.PID) }, can.ui.display)) { return }

		can.onmotion.clear(can, can.ui.display), can.svg.Value(svg.PID, target.Value(svg.PID))
		var index = target.Value(mdb.INDEX); index && can.onappend.plugin(can, {type: chat.STORY, index: index, args: target.Value(ctx.ARGS)}, function(sub) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(event, index, cmds, cb) }
			sub.ConfHeight(can.ConfHeight()-can.svg.Val(html.HEIGHT)-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
			can.onmotion.hidden(can, sub._legend), can.onmotion.toggle(can, can.ui.display, true)
		}, can.ui.display)
	},
	toimage: function(event, can) { can.user.toimage(event, can, can.Option(nfs.PATH).split(ice.PS).pop().split(ice.PT)[0], can.svg) },
	copy: function(event, can) { can.ondetail._copy(event, can, event.target) },
	label: function(event, can) { var target = event.target
		var def = target.Value(mdb.TEXT); def && can.page.Select(can, can.svg, ice.PT+def, function(item) { def = item.Value(html.INNER) })

		can.user.input(event, can, [{name: html.LABEL, value: def}], function(list) { var text = list[0]
			if (target.tagName == html.TEXT) { return target.innerHTML = text }
			if (def && can.page.Select(can, can.svg, ice.PT+def, function(item) { item.Value(html.INNER, text) }).length > 0) { return }

			var figure = can.onfigure._get(can, target)
			var data = can.onexport._text(can, target, figure, {inner: text})
			var item = can.onimport.block(can, html.TEXT, data, target.Group())
			target.Value(mdb.TEXT, can.onexport._pid(can, item))
		})
	},
	modify: function(event, can) { can.onimport._profile(can, event.target) },
	remove: function(event, can) { var target = event.target
		if (target == can.svg) { return }
		can.core.List(target.Value(ice.SHIP), function(value) {
			can.page.Select(can, can.svg, ice.PT+value.pid, function(item) {
				can.page.Remove(can, item)
			})
		})
		target.Value(mdb.TEXT) && can.page.Select(can, can.svg, ice.PT+target.Value(mdb.TEXT), function(item) {
			can.page.Remove(can, item)
		}), can.page.Remove(can, target)
	},
	_copy: function(event, can, target) {
		var data = {}, figure = can.onfigure._get(can, target), size = figure.data.size
		can.core.List(figure.data.copy, function(item) { data[item] = target.Value(item) })
		data[size.x||svg.X] = target.Val(size.x||svg.X)+10
		data[size.y||svg.Y] = target.Val(size.y||svg.Y)+10
		return can.onimport.block(can, target.tagName, data, can.group)
	},
	_move: function(can, target, list) {
		can.core.List(list||target.Value(ice.SHIP), function(ship) {
			ship.target = can.page.Select(can, can.svg, ice.PT+ship.pid)[0]
			var p = can.onexport.anchor(target, ship.anchor, {}) 
			if (ship.which == 1) {
				ship.target.Val(svg.X1, p.x), ship.target.Val(svg.Y1, p.y)
			} else if (ship.which == 2) {
				ship.target.Val(svg.X2, p.x), ship.target.Val(svg.Y2, p.y)
			}
		})
	},
})
Volcanos(chat.ONEXPORT, {list: [svg.GROUP, "figure", "index", "pos"],
	_point: function(event, can) { var p = can.svg.getBoundingClientRect(), point = {x: event.clientX-p.x, y: event.clientY-p.y}
		point.x = point.x - point.x % parseInt(can.Action(svg.GRID)), point.y = point.y - point.y % parseInt(can.Action(svg.GRID))
		return can.Status("pos", point.x+ice.FS+point.y), point
	},
	
	_show: function(can, target) { var figure = can.onfigure._get(can, target)
		function show() { return can.onexport._size(can, target, figure)+ice.SP+can.onexport._position(can, target, figure) }
		can.Status("figure", target.tagName+ice.DF+target.Value(svg.PID)+ice.SP+(figure? (figure.show||show)(can, target, figure): ""))
		can.Status(svg.GROUP, target.Groups()||can.group.Groups()||html.SVG)
		can.Status("index", target.Value("index"))
	},
	_pid: function(can, target) { if (target.Value(svg.PID)) { return target.Value(svg.PID) }
		var pid = "p"+can.svg.Val(mdb.COUNT, can.svg.Val(mdb.COUNT)+1)
		return target.Value(html.CLASS, (target.Value(html.CLASS)+ice.SP+target.Value(svg.PID, pid)).trim()), pid
	},
	_size: function(can, target, figure) { var trans = can.core.Value(figure.data, "trans")||{}
		return "<("+target.Val(trans[html.HEIGHT]||html.HEIGHT)+ice.FS+target.Val(trans[html.WIDTH]||html.WIDTH)+")"
	},
	_position: function(can, target, figure) { var trans = can.core.Value(figure.data, "trans")||{}
		return "@("+target.Val(trans[svg.X]||svg.X)+ice.FS+target.Val(trans[svg.Y]||svg.Y)+")"
	},
	_text: function(can, target, figure, data) { var trans = can.core.Value(figure.data, "trans")||{}
		if (figure.text) { return figure.text(can, data, target) }
		return data.x = target.Val(trans[svg.X]||svg.X), data.y = target.Val(trans[svg.Y]||svg.Y), data
	},
	content: function(can, svg) {
		return ['<svg vertion="1.1" xmlns="https://www.w3.org/2000/svg" text-anchor="middle" dominant-baseline="middle"'].concat(
			svg? can.core.List([html.HEIGHT, html.WIDTH, mdb.COUNT, svg.PID, svg.GRID, svg.STROKE_WIDTH, svg.STROKE, svg.FILL, svg.FONT_SIZE], function(item) {
				return svg.Value(item)? ice.SP + item + '="' + svg.Value(item) + '"': ""
			}): [" height="+((can.ConfHeight()||450)-50)+" width="+(can.ConfWidth()||600)]).concat(['>', svg? svg.innerHTML: "", "</svg>"]).join("")
	},

	cursor: function(event, can, item, show) {
		var p = item.getBoundingClientRect()
		var q = {x: event.clientX, y: event.clientY}

		var pos = 5, margin = 20
		var y = (q.y-p.y)/p.height
		if (y < 0.2 && q.y-p.y < margin) {
			pos -= 3
		} else if (y > 0.8 && q.y-p.y-p.height > -margin) {
			pos += 3
		}
		var x = (q.x-p.x)/p.width
		if (x < 0.2 && q.x-p.x < margin) {
			pos -= 1
		} else if (x > 0.8 && q.x-p.x- p.width > -margin) {
			pos += 1
		}

		return (show||can.svg).style.cursor = [
			"nw-resize", "n-resize", "ne-resize",
			"w-resize", "move", "e-resize",
			"sw-resize", "s-resize", "se-resize",
		][pos-1], pos
	},
	anchor: function(target, pos, point) {
		switch (pos) {
			case 1:
			case 2:
			case 3:
				point.y = target.Val(svg.Y)
				break
			case 4:
			case 5:
			case 6:
				point.y = target.Val(svg.Y) + target.Val(html.HEIGHT) / 2
				break
			case 7:
			case 8:
			case 9:
				point.y = target.Val(svg.Y) + target.Val(html.HEIGHT)
				break
		}

		switch (pos) {
			case 1:
			case 4:
			case 7:
				point.x = target.Val(svg.X)
				break
			case 2:
			case 5:
			case 8:
				point.x = target.Val(svg.X) + target.Val(html.WIDTH) / 2
				break
			case 3:
			case 6:
			case 9:
				point.x = target.Val(svg.X) + target.Val(html.WIDTH)
				break
		}
		return point
	},
	resize: function(event, item, begin, p0, p1, pos) {
		switch (pos) {
			case 5:
				item.Value(svg.X, begin.x + p1.x - p0.x)
				item.Value(svg.Y, begin.y + p1.y - p0.y)
				return
		}

		switch (pos) {
			case 1:
			case 2:
			case 3:
				item.Value(svg.Y, begin.y + p1.y - p0.y)
				item.Value(html.HEIGHT, begin.height - p1.y + p0.y)
				break
		}
		switch (pos) {
			case 1:
			case 4:
			case 7:
				item.Value(sve.X, begin.x + p1.x - p0.x)
				item.Value(html.WIDTH, begin.width - p1.x + p0.x)
				break
		}
		switch (pos) {
			case 3:
			case 6:
			case 9:
				item.Value(html.WIDTH, begin.width + p1.x - p0.x)
				break
		}
		switch (pos) {
			case 7:
			case 8:
			case 9:
				item.Value(html.HEIGHT, begin.height + p1.y - p0.y)
				break
		}
	},
})
Volcanos(chat.ONFIGURE, {
	_get: function(can, target, name) { return can.onfigure[name]||can.onfigure[target.getAttribute(mdb.NAME)]||can.onfigure[target.tagName] },

	svg: { // <svg height="200" width="600" grid="10" count="0" font-size="24" stroke-width="2" stroke="yellow" fill="purple"/>
		show: function(can, target, figure) { return can.onexport._size(can, target, figure) }
	},
	text: { // <text x="60" y="10">hi</text>
		data: {points: 1, copy: [html.INNER]},
		draw: function(event, can, point, style) { var p0 = point[0]
			return {x: p0.x, y: p0.y, inner: style.inner||can.user.prompt(mdb.TEXT)}
		},
		show: function(can, target, figure) { return can.onexport._position(can, target, figure) }
	},
	rect: { // <rect height="30" width="30" rx="10" ry="10" x="60" y="10"/>
		data: {points: 2, rx: 4, ry: 4, copy: [html.HEIGHT, html.WIDTH, svg.RX, svg.RY]},
		draw: function(event, can, point, style) { var p0 = point[0], p1 = point[1]
			return {height: Math.abs(p0.y-p1.y), width: Math.abs(p0.x-p1.x), x: Math.min(p0.x, p1.x), y: Math.min(p0.y, p1.y), rx: style.rx == undefined? this.data.rx: style.rx, ry: style.ry == undefined? this.data.ry: style.ry}
		},
		text: function(can, target, data) { return data.x = target.Val(svg.X)+target.Val(html.WIDTH)/2, data.y = target.Val(svg.Y)+target.Val(html.HEIGHT)/2, data },
	},
	block: { // <rect height="30" width="30" rx="10" ry="10" x="60" y="10"/>
		data: {points: 2, rx: 4, ry: 4, copy: [html.HEIGHT, html.WIDTH, svg.RX, svg.RY]},
		draw: function(event, can, point, style) {
			this._temp && can.page.Remove(can, this._temp) && delete(this._temp), this._temp = can.onimport.block(can, svg.G, {}, can.group)
			var target = can.onimport.block(can, svg.RECT, can.onfigure.rect.draw(event, can, point, style), this._temp)
			if (event.type == html.CLICK) { can.onexport._pid(can, target), delete(this._temp) }
		},
		text: function(can, target, data) { can.onfigure.rect.text(can, data, target) },
	},
	line: { // <line x1="10" y1="50" x2="110" y2="150"/>
		data: {points: 2, trans: {x: svg.X1, y: svg.Y1}, copy: [svg.X1, svg.Y1, svg.X2, svg.Y2]},
		grid: function(event, can, point) { var target = event.target; if (target == can.svg) { return }
			var p = point[point.length-1], pos = can.onexport.cursor(event, can, target); can.onexport.anchor(target, pos, p)
			return p.target = target, p.anchor = pos, point
		},
		draw: function(event, can, point) { var p0 = point[0], p1 = point[1], ship = []
			p0.target && p0.target.Value && ship.push({pid: p0.target.Value(svg.PID)})
			p1.target && p1.target.Value && ship.push({pid: p1.target.Value(svg.PID)})
			return {x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, ship: ship.length > 0? ship: undefined}
		},
		text: function(can, target, data) { return data.x = (target.Val(svg.X1)+target.Val(svg.X2))/2, data.y = (target.Val(svg.Y1)+target.Val(svg.Y2))/2, data },
		show: function(can, target, figure) { return "<("+(target.Val(svg.Y2)-target.Val(svg.Y1))+ice.FS+(target.Val(svg.X2)-target.Val(svg.X1))+")"+can.onexport._position(can, target, figure) },
	},
	circle: { // <circle cx="25" cy="75" r="20"/>
		data: {points: 2, trans: {height: svg.R, width: svg.R, x: svg.CX, y: svg.CY}, copy: [svg.R]},
		draw: function(event, can, point) { var p0 = point[0], p1 = point[1]
			return {cx: p0.x, cy: p0.y, r: parseInt(Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)))}
		},
	},
	ellipse: { // <ellipse cx="75" cy="75" rx="20" ry="5"/>
		data: {points: 2, trans: {height: svg.RY, width: svg.RX, x: svg.CX, y: svg.CY}, copy: [svg.RY, svg.RX]},
		draw: function(event, can, point) { var p0 = point[0], p1 = point[1]
			return {cx: p0.x, cy: p0.y, ry: Math.abs(p0.y - p1.y), rx: Math.abs(p0.x - p1.x)}
		},
	},
}, [])
Volcanos(chat.ONKEYMAP, {help: "键盘交互",
	_mode: {
		normal: {
			gr: function(event, can) { can.Action("go", "run") },
			ga: function(event, can) { can.Action("go", "auto") },
			gm: function(event, can) { can.Action("go", "manual") },

			ad: function(event, can) { can.Action("mode", "draw") },
			ar: function(event, can) { can.Action("mode", "resize") },

			st: function(event, can) { can.Action(svg.SHAPE, svg.TEXT) },
			sr: function(event, can) { can.Action(svg.SHAPE, svg.RECT) },
			sl: function(event, can) { can.Action(svg.SHAPE, svg.LINE) },
			sc: function(event, can) { can.Action(svg.SHAPE, svg.CIRCLE) },
			se: function(event, can) { can.Action(svg.SHAPE, svg.ELLIPSE) },

			cr: function(event, can) { can.onaction._change(can, svg.STROKE, cli.RED) },
			cb: function(event, can) { can.onaction._change(can, svg.STROKE, cli.BLUE) },
			cg: function(event, can) { can.onaction._change(can, svg.STROKE, cli.GREEN) },
			cy: function(event, can) { can.onaction._change(can, svg.STROKE, cli.YELLOW) },
			cp: function(event, can) { can.onaction._change(can, svg.STROKE, cli.PURPLE) },
			cc: function(event, can) { can.onaction._change(can, svg.STROKE, cli.CYAN) },
			ch: function(event, can) { can.onaction._change(can, svg.STROKE, cli.BLACK) },
			cw: function(event, can) { can.onaction._change(can, svg.STROKE, cli.WHITE) },

			fr: function(event, can) { can.onaction._change(can, svg.FILL, cli.RED) },
			fb: function(event, can) { can.onaction._change(can, svg.FILL, cli.BLUE) },
			fg: function(event, can) { can.onaction._change(can, svg.FILL, cli.GREEN) },
			fy: function(event, can) { can.onaction._change(can, svg.FILL, cli.YELLOW) },
			fp: function(event, can) { can.onaction._change(can, svg.FILL, cli.PURPLE) },
			fc: function(event, can) { can.onaction._change(can, svg.FILL, cli.CYAN) },
			fh: function(event, can) { can.onaction._change(can, svg.FILL, cli.BLACK) },
			fw: function(event, can) { can.onaction._change(can, svg.FILL, cli.WHITE) },
		},
	}, _engine: {},
})
