Volcanos(chat.ONIMPORT, {_init: function(can, msg) {
		can.isCmdMode() || can.onmotion.hidden(can, can._action)
		can.OptionPath = function(value) { return can.Option(nfs.PATH, value) }
		can.OptionPid = function(value) { return can.Option(svg.PID, value) }
		can.ActionGo = function(value) { return can.Action(svg.GO, value) }
		can.ActionMode = function(value) { return can.Action(ice.MODE, value) }
		can.ActionShape = function(value) { return can.Action(svg.SHAPE, value) }
		if (can.ConfIndex() == web.WIKI_DRAW) { can.ui = can.onappend.layout(can), can.onexport.title(can, can.OptionPath())
			if (can.isCmdMode() && !can.user.isMobile) { can.onmotion.toggle(can, can.ui.profile, true) } else { can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can.ui.project) }
		} else { can.ui = {content: can._output} } can.page.Modify(can, can.ui.content, msg.Results()||can.onexport.content(can))
		can.page.Select(can, can.ui.content, html.SVG, function(target) { can.ui.svg = can.ui.group = can.onimport._block(can, target), can.onimport._project(can, target), can.ui.profile && can.core.ItemCB(can.onaction, target, can)
			can.page.Select(can, target, "", function(target) { can.onimport._block(can, target), can.page.tagis(target, svg.G) && target.Value(html.CLASS) && can.onimport._project(can, target) })
		}), can.ondetail._select(can, can.db.hash[1]||can.OptionPid()||can.ui.svg.Value(svg.PID)), can.ui.points = []
	},
	_block: function(can, target) {
		target.Value = function(key, value) { if (can.base.isUndefined(key)) { return } if (can.base.isObject(key)) { return can.core.Item(key, target.Value), key }
			var figure = can.onfigure._get(can, target); key = can.core.Value(figure, [svg.DATA, svg.TRANS, key])||key
			var _cb = can.core.Value(figure, [svg.DATA, key]); if (can.base.isFunc(_cb)) { return _cb(can, value, key, target) }
			if (value == ice.AUTO) { return target.removeAttribute(key) }
			if (key == html.INNER) { return value != undefined && (target.innerHTML = value), target.innerHTML }
			if (key == svg.SHIP) { return value != undefined && target.setAttribute(key, JSON.stringify(value)), can.base.Obj(target.getAttribute(key), []) }
			try { return value != undefined && target.setAttribute(key, value), target.getAttribute(key) || can.core.Value(target[key], "baseVal.value") || can.core.Value(target[key], "baseVal") || undefined } catch(e) { }
		}, target.Val = function(key, value) { return parseInt(target.Value(key, value == undefined? value: parseInt(value)||0))||0 }
		target.Group = function() { for (var node = target; node; node = node.parentNode) { if (can.page.tagis(node, svg.G, html.SVG)) { return node } } return can.ui.svg }
		target.Groups = function() { if (target == can.ui.svg) { return html.SVG } var list = []
			for (var node = target; node && !can.page.tagis(node, html.SVG); node = node.parentNode) { can.page.tagis(node, svg.G) && node.Value(html.CLASS) && list.push(node.Value(html.CLASS)) }
			return list.reverse().join(nfs.PT)
		}; return target
	},
	_project: function(can, target) { var groups = target.Groups(); if (!groups || !can.ui.project) { return }
		var item = can.onimport.item(can, {name: groups}, function(event) { can.ui.group = target
			can.misc.SearchHash(can, groups, can.OptionPid()), can.Status(svg.GROUP, groups), can.onaction.show(event, can)
			can.core.List([svg.FONT_SIZE, svg.STROKE_WIDTH, svg.STROKE, svg.FILL], function(key) { can.Action(key, target.Value(key)||key) })
		}, function(event) { return {meta: can.onaction, list: can.onaction.menu_list} }); target._item = item
		groups == can.db.hash[0] && can.onmotion.delay(can, function() { item.click() })
	},
	_profile: function(can, target) { if (!can.ui.profile) { return }
		can.misc.SearchHash(can, target.Groups()||html.SVG, can.OptionPid(can.onexport._pid(can, target)))
		var figure = can.onfigure._get(can, target), ui = can.page.Appends(can, can.ui.profile, [html.OUTPUT, html.ACTION])
		can.page.Appends(can, ui.output, [{view: [html.CONTENT, html.TABLE], list: [
			{th: [mdb.KEY, mdb.VALUE]}, {td: [mdb.TYPE, target.tagName]}, {td: [svg.PID, target.Value(svg.PID)]}, {td: [mdb.TEXT, target.Value(mdb.TEXT)]},
		].concat(can.core.List([].concat(can.core.Value(figure, "data.copy"), [svg.X, svg.Y, mdb.INDEX, ctx.ARGS]), function(key) {
			return key = can.core.Value(figure.data, can.core.Keys(svg.TRANS, key))||key, {td: [key, target.Value(key)], ondblclick: function(event) {
				var _target = event.target
				can.onmotion.modify(can, _target, function(event, value) {
					target.Value(key, _target.innerHTML = value), can.ondetail._move(can, target)
					if (key == ctx.INDEX || key == ctx.ARGS) { can.onimport._display(can, target) }
				}, {name: key, action: "key"})
			}}
		})) }])
		// can.onappend._action(can, can.ondetail.list, ui.action, {_engine: function(event, can, button) { can.ondetail[button]({target: target}, can, button) }})
	},
	_display: function(can, target) { if (!can.ui.display) { return }
		if (!target.Value(ctx.INDEX)) { return can.onmotion.hidden(can, can.ui.display) } can.onmotion.toggle(can, can.ui.display, true)
		if (can.onmotion.cache(can, function() { return target.Value(svg.PID) }, can.ui.display)) { return can.onimport.layout(can) }
		can.onappend.plugin(can, {index: target.Value(ctx.INDEX), args: target.Value(ctx.ARGS), height: can.ConfHeight()/2}, function(sub) {
			sub.onexport.output = function() { can.onmotion.delay(can, function() { can.page.style(can, sub._output, html.MAX_HEIGHT, "")
				sub.onimport.size(sub, can.base.Max(sub._target.offsetHeight, can.ConfHeight()/2), can.ConfWidth()-can.ui.project.offsetWidth, true), can.onimport.layout(can)
			}) }
			sub.onaction._close = function() { can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		}, can.ui.display)
	},
	block: function(can, type, value, group) { group = group||can.ui.group
		var target = document.createElementNS("http://www.w3.org/2000/svg", type)
		return group.appendChild(can.onimport._block(can, target)), target.Value(value), target
	},
	group: function(can, name, value, group) { var target = can.onimport.block(can, svg.G, value, group||can.ui.svg)
		return target.Value(html.CLASS, name), can.onimport._project(can, target), target
	},
	draw: function(can, meta, group) { group = group||can.ui.svg
		var figure = can.onfigure[meta.shape], data = figure.draw({}, can, meta.points, meta.style||{}); can.core.Item(meta.style, function(key, value) { data[key] = value })
		var target = can.onimport.block(can, figure.data.name||meta.shape, data, group); can.core.ItemCB(meta, target, can)
		return meta._init && meta._init(target), target
	},
	layout: function(can) {
		can.ui.svg && can.page.style(can, can.ui.svg, html.MIN_HEIGHT, can.ConfHeight(), html.MIN_WIDTH, can.ConfWidth())
		can.ui.layout && can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(height, width) {
			can.page.style(can, can.ui.svg, html.MIN_HEIGHT, height, html.MIN_WIDTH, width)
		})
	},
})
Volcanos(chat.ONACTION, {list: [
		[svg.GO, ctx.RUN, ice.AUTO, "manual"], [ice.MODE, web.DRAW, html.MOVE, html.RESIZE],
		[svg.SHAPE, svg.RECT, svg.LINE, svg.TEXT, svg.BLOCK, svg.CIRCLE, svg.ELLIPSE],
		[svg.STROKE_WIDTH, svg.STROKE_WIDTH, 1, 2, 3, 4, 5],
		[svg.STROKE, svg.STROKE, cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE],
		[svg.FILL, svg.FILL, cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.BLACK, cli.WHITE],
		[svg.FONT_SIZE, svg.FONT_SIZE, 12, 16, 18, 24, 32], [svg.GRID, svg.GRID, 1, 2, 3, 4, 5, 10, 20],
	], _change: function(can, key, value) {
		value == "" && (value = key), can.Action(key, value)
		key == value && (value = ice.AUTO), can.ui.group.Value(key, value)
		can.user.toast(can, key+" "+value)
	},
	"stroke-width": function(event, can, key, value) { can.onaction._change(can, key, value) },
	stroke: function(event, can, key, value) { can.onaction._change(can, key, value) },
	fill: function(event, can, key, value) { can.onaction._change(can, key, value) },
	"font-size": function(event, can, key, value) { can.onaction._change(can, key, value) },
	save: function(event, can, button) { can.runAction(can.request(event, {text: can.onexport.content(can, can.ui.svg)}), button, [can.OptionPath()]) },

	menu_list: [html.HIDE, html.SHOW, web.CLEAR, mdb.CREATE, mdb.REMOVE],
	hide: function(event, can) { can.onmotion.hide(can, {interval: 50, length: 10}, null, can.ui.group) },
	show: function(event, can) { can.onmotion.show(can, {interval: 50, length: 10}, null, can.ui.group) },
	clear: function(event, can) { can.onmotion.clear(can, can.ui.group), delete(can.ui.temp), can.ui.points = [] },
	create: function(event, can) { can.user.input(event, can, [svg.GROUP], function(list) { can.onimport.group(can, list[0], {}, can.ui.group) }) },
	remove: function(event, can) {
		if (can.ui.group == can.ui.svg) { return can.onmotion.clear(can, can.ui.svg) }
		can.page.Remove(can, can.ui.group._item), can.page.Remove(can, can.ui.group)
	},

	_mode: {
		draw: function(event, can, points) { var shape = can.ActionShape(), figure = can.onfigure[shape]
			figure.grid && figure.grid(event, can, points); if (figure.data.points && points.length < figure.data.points) { return }
			var data = figure.draw && figure.draw(event, can, points, {}), target = data && can.onimport.block(can, figure.data.name||shape, data, can.ui.group)
			if (event.type != html.CLICK) { return target } can.ui.points = []; if (!target) { return } var pid = can.onexport._pid(can, target)
			can.core.List(points, function(p, i) { p.target && p.target.Value(svg.SHIP, p.target.Value(svg.SHIP).concat([{pid: pid, which: i+1, anchor: p.anchor}])) })
		},
		move: function(event, can, points) { var target = event.target
			if (event.type == html.CLICK) { if (points.length > 1) { return can.ui.points = [], delete(can.ui.current) }
				return can.ui.current = {target: target, begin: can.core.List([target], function(target) { if (can.page.tagis(target, svg.G)) { return }
					return {target: target, height: target.Val(html.HEIGHT), width: target.Val(html.WIDTH), x: target.Val(svg.X), y: target.Val(svg.Y),
						ship: can.core.List(target.Value(svg.SHIP), function(ship) { return ship.pid && (ship.target = can.ondetail._select(can, ship.pid)) && ship })
					}
				}), pos: can.onexport.cursor(event, can, target)}
			}
			can.ui.current && can.core.List(can.ui.current.begin, function(item) { var figure = can.onfigure._get(can, item.target)
				can.onexport.resize(item.target, 5, points[0], points[1], item), can.ondetail._move(can, item.target, item.ship)
				can.ondetail._select(can, item.target.Value(mdb.TEXT), function(text) { text.Value(can.onexport._text(can, item.target, figure, {})) })
			})
		},
		resize: function(event, can, points) { var target = event.target
			if (event.type == html.CLICK) { if (points.length > 1) { return can.ui.points = [], delete(can.ui.current) }
				return can.ui.current = {target: target, begin: can.core.List([target], function(target) { if (can.page.tagis(target, svg.G)) { return }
					return {target: target, height: target.Val(html.HEIGHT), width: target.Val(html.WIDTH), x: target.Val(svg.X), y: target.Val(svg.Y),
						ship: can.core.List(target.Value(svg.SHIP), function(ship) { return ship.pid && (ship.target = can.ondetail._select(can, ship.pid)) && ship })
					}
				}), pos: can.onexport.cursor(event, can, target)}
			}
			can.ui.current && can.core.List(can.ui.current.begin, function(item) { var figure = can.onfigure._get(can, item.target)
				can.onexport.resize(item.target, can.ui.current.pos, points[0], points[1], item), can.ondetail._move(can, item.target, item.ship)
				can.ondetail._select(can, item.target.Value(mdb.TEXT), function(text) { text.Value(can.onexport._text(can, item.target, figure, {})) })
			})
		},
	},
	_figure: function(event, can, points) {
		can._undo && can._undo(), can._undo = function() { can.ui.temp && can.page.Remove(can, can.ui.temp) && delete(can.ui.temp), delete(can._undo) }
		can.ui.temp = can.core.CallFunc([can.onaction._mode, can.ActionMode()], [event, can, points]), can.ui.points.length == 0 && can._undo && can._undo()
	},
	_group: function(can) {
		can._undo && can._undo(), can._temp = can.onimport.block(can, svg.G, {}, can.ui.group)
		can._undo = function() { can._temp && can.page.Remove(can, can._temp) && delete(can._temp), delete(can._undo) }
		return can._temp
	},
	_auto: function(can, target) { if (can.ui.points.length > 0 || can.page.tagis(target, html.TEXT)) { return }
		var pos = can.onexport.cursor(event, can, target); if (target == can.ui.svg) { switch (pos) {
			case 5: can.ActionMode(web.DRAW), can.ActionShape(html.BLOCK), can.page.style(can, target, {cursor: html.CROSSHAIR}); break
			default: can.ActionMode(html.RESIZE)
		} } else { switch (pos) {
			case 5: can.ActionMode(html.MOVE); break
			case 9: can.ActionMode(html.RESIZE); break
			default: can.ActionMode(web.DRAW), can.ActionShape(svg.LINE)
		} }
	},
	onmouseover: function(event, can) { can.onexport._show(can, event.target) },
	onmousemove: function(event, can) {
		if (can.ActionGo() == ctx.RUN) { return can.page.style(can, can.ui.svg, {cursor: html.POINTER}) }
		if (can.ActionGo() == ice.AUTO) { can.onaction._auto(can, event.target) }
		if (can.ActionGo() == "manual") { if (event.target == can.ui.svg) { can.onexport._cursor(can, "") }
			if (can.ActionMode()== html.MOVE) {
				if (event.target != can.ui.svg) { can.onexport._cursor(can, html.MOVE) }
			} else if (can.ActionMode() == html.RESIZE) {
				if (event.target != can.ui.svg) { can.onaction._auto(can, event.target), can.ActionMode(html.RESIZE) }
			} else { var shape = can.ActionShape()
				can.onaction._auto(can, event.target), can.ActionMode("draw"), can.ActionShape(shape)
			}
		}
		can.onaction._figure(event, can, can.ui.points.concat(can.onexport._point(event, can)))
		can.ui.temp && can.onexport._show(can, can.ui.temp||event.target)
	},
	onclick: function(event, can) {
		if (can.ActionGo() == ctx.RUN) { return can.ondetail._select(can, event.target.Value(svg.PID)) }
		can.onaction._figure(event, can, can.ui.points = can.ui.points.concat(can.onexport._point(event, can)))
	},
	ondblclick: function(event, can) { can.page.style(can, can.ondetail.label(event, can)._target, {left: event.clientX, top: event.clientY}) },
	oncontextmenu: function(event, can) { can.page.style(can, can.user.carte(event, can, can.ondetail)._target, {left: event.clientX, top: event.clientY}) },
})
Volcanos(chat.ONDETAIL, {list: [cli.START, nfs.COPY, html.LABEL, mdb.REMOVE], _trans: {copy: "复制", label: "标签"},
	_select(can, name, cb) { if (!name) { return } var target = can.page.SelectOne(can, can.ui.svg, nfs.PT+name, cb); if (!target) { return }
		can.onimport._profile(can, target), can.onimport._display(can, target), can.onimport.layout(can); return target
	},
	_move: function(can, target, list) {
		can.core.List(list||target.Value(svg.SHIP), function(ship) { var p = can.onexport.anchor(target, ship.anchor, {})
			ship.target = can.page.SelectOne(can, can.ui.svg, nfs.PT+ship.pid)
			if (ship.which == 1) { ship.target.Val(svg.X1, p.x), ship.target.Val(svg.Y1, p.y) } else if (ship.which == 2) { ship.target.Val(svg.X2, p.x), ship.target.Val(svg.Y2, p.y) }
		})
	},
	start: function(event, can) { event = event._events||event; var target = event.target; if (target == can.ui.svg) { return }
		var list = [target], dict = {}
		for (var i = 0; i < list.length; i++) { var ship = list[i].Value(svg.SHIP)
			for (var j = 0; j < ship.length; j++) { var pid = ship[j].pid
				can.ondetail._select(can, pid, function(target) { var pid = target.Value(svg.SHIP)[1].pid
					can.ondetail._select(can, pid, function(target) { !dict[pid] && list.push(target), dict[pid] = true })
				})
			}
		}
		can.core.Next(list, function(target, next) {
			can.onimport._display(can, target), can.user.toast(can, target.Value(ctx.INDEX))
			can.onmotion.show(can, {interval: 500, length: 10}, null, target)
			can.onmotion.delay(can, function() { next() }, 1000)
		}, function() { can.user.toastSuccess(can) })
	},
	copy: function(event, can) { event = event._events||event; var target = event.target; if (target == can.ui.svg) { return }
		var figure = can.onfigure._get(can, target), trans = can.core.Value(figure, [svg.DATA, svg.TRANS])||{}, data = {}
		data[trans.x||svg.X] = target.Val(trans.x||svg.X)+10, data[trans.y||svg.Y] = target.Val(trans.y||svg.Y)+10
		can.core.List(figure.data.copy, function(key) { data[key] = target.Value(key) })
		return can.onimport.block(can, target.tagName, data, can.ui.group)
	},
	label: function(event, can) { event = event._events||event; var target = event.target; if (target == can.ui.svg) { return }
		var _target, text = target.Value(mdb.TEXT); can.ondetail._select(can, text, function(target) { _target = target, text = target.Value(html.INNER) })
		return can.user.input(event, can, [{name: html.LABEL, value: text}], function(list) {
			if (_target) { _target.Value(html.INNER, list[0]); return } if (can.page.tagis(target, html.TEXT)) { target.innerHTML = list[0]; return }
			target.Value(mdb.TEXT, can.onexport._pid(can, can.onimport.block(can, html.TEXT, can.onexport._text(can, target, can.onfigure._get(can, target), {inner: list[0]}), target.Group()) ))
		})
	},
	remove: function(event, can) { event = event._events||event; var target = event.target; if (target == can.ui.svg) { return }
		can.core.List(target.Value(svg.SHIP), function(item) { can.ondetail._select(can, item.pid, function(target) { can.page.Remove(can, target) }) })
		can.ondetail._select(can, target.Value(mdb.TEXT), function(target) { can.page.Remove(can, target) }), can.page.Remove(can, target)
	},
})
Volcanos(chat.ONEXPORT, {list: [svg.GROUP, svg.FIGURE, ctx.INDEX, "pos"],
	_point: function(event, can) { var p = can.ui.svg.getBoundingClientRect(), point = {x: event.clientX-p.x, y: event.clientY-p.y}
		point.x = point.x - point.x % can.onexport.grid(can), point.y = point.y - point.y % can.onexport.grid(can)
		return can.Status("pos", point.x+mdb.FS+point.y), point
	},
	_pid: function(can, target) { if (target.Value(svg.PID)) { return target.Value(svg.PID) }
		var pid = "p"+can.ui.svg.Val(mdb.COUNT, can.ui.svg.Val(mdb.COUNT)+1)
		return target.Value(html.CLASS, [target.Value(html.CLASS), target.Value(svg.PID, pid)].join(lex.SP).trim()), pid
	},
	_text: function(can, target, figure, data) { var trans = can.core.Value(figure.data, svg.TRANS)||{}
		if (figure.text) { return figure.text(can, target, data) }
		return data.x = target.Val(trans[svg.X]||svg.X), data.y = target.Val(trans[svg.Y]||svg.Y), data
	},
	_size: function(can, target, figure) { var trans = can.core.Value(figure.data, svg.TRANS)||{}
		return "<("+target.Val(trans[html.WIDTH]||html.WIDTH)+mdb.FS+target.Val(trans[html.HEIGHT]||html.HEIGHT)+")"
	},
	_position: function(can, target, figure) { var trans = can.core.Value(figure.data, svg.TRANS)||{}
		return "@("+target.Val(trans[svg.X]||svg.X)+mdb.FS+target.Val(trans[svg.Y]||svg.Y)+")"
	},
	_show: function(can, target) { var figure = can.onfigure._get(can, target)
		function show() { return can.onexport._position(can, target, figure)+lex.SP+can.onexport._size(can, target, figure) }
		can.Status(svg.FIGURE, can.core.Keys(target.tagName, target.Value(svg.PID))+lex.SP+(figure? (figure.show||show)(can, target, figure): ""))
		can.Status(svg.GROUP, target.Groups()||can.ui.group.Groups()||html.SVG)
		can.Status(ctx.INDEX, target.Value(ctx.INDEX)||"")
	},
	content: function(can, target) { return ['<svg xmlns="https://www.w3.org/2000/svg" vertion="1.1" text-anchor="middle" dominant-baseline="middle"'].concat(
		target? can.core.List([mdb.COUNT, svg.PID], function(item) { return target.Value(item)? can.base.joinKV([item, target.Value(item)], mdb.EQ): ""}).join(lex.SP): "").concat([">", target? target.innerHTML: "", "</svg>"]).join("")
	},
	grid: function(can) { var grid = can.Action(svg.GRID); return grid == svg.GRID || grid == ice.AUTO? 10: grid },
	_cursor: function(can, cursor) { can.page.style(can, can.ui.svg, {cursor: cursor}) },
	cursor: function(event, can, target) {
		var p = target.getBoundingClientRect(), q = {x: event.clientX, y: event.clientY}, pos = 5, margin = 20
		var y = (q.y-p.y)/p.height; if (y < 0.2 && q.y-p.y < margin) { pos -= 3 } else if (y > 0.8 && q.y-p.y-p.height > -margin) { pos += 3 }
		var x = (q.x-p.x)/p.width; if (x < 0.2 && q.x-p.x < margin) { pos -= 1 } else if (x > 0.8 && q.x-p.x- p.width > -margin) { pos += 1 }
		return can.ui.svg.style.cursor = ["nw-resize", "n-resize", "ne-resize", "w-resize", html.MOVE, "e-resize", "sw-resize", "s-resize", "se-resize"][pos-1], pos
	},
	anchor: function(target, pos, point) {
		switch (pos) {
			case 1:
			case 2:
			case 3: point.y = target.Val(svg.Y); break
			case 4:
			case 5:
			case 6: point.y = target.Val(svg.Y) + target.Val(html.HEIGHT)/2; break
			case 7:
			case 8:
			case 9: point.y = target.Val(svg.Y) + target.Val(html.HEIGHT); break
		}
		switch (pos) {
			case 1:
			case 4:
			case 7: point.x = target.Val(svg.X); break
			case 2:
			case 5:
			case 8: point.x = target.Val(svg.X) + target.Val(html.WIDTH)/2; break
			case 3:
			case 6:
			case 9: point.x = target.Val(svg.X) + target.Val(html.WIDTH); break
		} return point
	},
	resize: function(target, pos, p0, p1, begin) {
		if (pos == 5) { target.Value(svg.X, begin.x + p1.x - p0.x), target.Value(svg.Y, begin.y + p1.y - p0.y); return }
		switch (pos) {
			case 1:
			case 2:
			case 3: target.Value(svg.Y, begin.y + p1.y - p0.y), target.Value(html.HEIGHT, begin.height - p1.y + p0.y); break
			case 7:
			case 8:
			case 9: target.Value(html.HEIGHT, begin.height + p1.y - p0.y); break
		}
		switch (pos) {
			case 1:
			case 4:
			case 7: target.Value(svg.X, begin.x + p1.x - p0.x), target.Value(html.WIDTH, begin.width - p1.x + p0.x); break
			case 3:
			case 6:
			case 9: target.Value(html.WIDTH, begin.width + p1.x - p0.x); break
		}
	},
})
Volcanos(chat.ONFIGURE, {
	_get: function(can, target, name) { return can.onfigure[name]||can.onfigure[target.getAttribute(mdb.NAME)]||can.onfigure[target.tagName] },
	svg: {show: function(can, target, figure) { return can.onexport._size(can, target, figure) }},
	rect: { // <rect x="60" y="10" height="30" width="30" rx="10" ry="10"/>
		data: {points: 2, rx: 4, ry: 4, copy: [html.HEIGHT, html.WIDTH, svg.RX, svg.RY]},
		draw: function(event, can, points, style) { var p0 = points[0], p1 = points[1]
			return {x: Math.min(p0.x, p1.x), y: Math.min(p0.y, p1.y), height: Math.abs(p0.y-p1.y), width: Math.abs(p0.x-p1.x), rx: style.rx == undefined? this.data.rx: style.rx, ry: style.ry == undefined? this.data.ry: style.ry}
		},
		text: function(can, target, data) { return data.x = target.Val(svg.X)+target.Val(html.WIDTH)/2, data.y = target.Val(svg.Y)+target.Val(html.HEIGHT)/2, data },
	},
	line: { // <line x1="10" y1="10" x2="110" y2="150"/>
		data: {points: 2, trans: {x: svg.X1, y: svg.Y1}, copy: [svg.X1, svg.Y1, svg.X2, svg.Y2]},
		grid: function(event, can, points) { var target = event.target; if (target == can.ui.svg) { return }
			var p = points[points.length-1], pos = can.onexport.cursor(event, can, target); can.onexport.anchor(target, pos, p)
			return p.target = target, p.anchor = pos, points
		},
		draw: function(event, can, points) { var p0 = points[0], p1 = points[1], ship = []
			p0.target && p0.target.Value && ship.push({pid: p0.target.Value(svg.PID)})
			p1.target && p1.target.Value && ship.push({pid: p1.target.Value(svg.PID)})
			return {x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, ship: ship.length > 0? ship: undefined}
		},
		text: function(can, target, data) { return data.x = (target.Val(svg.X1)+target.Val(svg.X2))/2, data.y = (target.Val(svg.Y1)+target.Val(svg.Y2))/2, data },
		show: function(can, target, figure) { return can.onexport._position(can, target, figure)+" <("+(target.Val(svg.X2)-target.Val(svg.X1))+mdb.FS+(target.Val(svg.Y2)-target.Val(svg.Y1))+")" },
	},
	text: { // <text x="60" y="10">hi</text>
		data: {points: 1, copy: [html.INNER]},
		draw: function(event, can, points, style) { if (event.type == "mousemove") { return }
			var p0 = points[0]; return {x: p0.x, y: p0.y, inner: style.inner||can.user.prompt(mdb.TEXT)}
		},
		show: function(can, target, figure) { return can.onexport._position(can, target, figure) }
	},
	block: { // <rect x="60" y="10" height="30" width="30" rx="10" ry="10"/>
		data: {points: 2, rx: 4, ry: 4, copy: [html.HEIGHT, html.WIDTH, svg.RX, svg.RY]},
		draw: function(event, can, points, style) { var group = can.onaction._group(can)
			var target = can.onimport.block(can, svg.RECT, can.onfigure.rect.draw(event, can, points, style), group)
			if (event.type == html.CLICK) { can.onexport._pid(can, target), delete(can._temp) }
		},
		text: function(can, target, data) { can.onfigure.rect.text(can, data, target) },
	},
	circle: { // <cx="25" cy="75" r="20"/>
		data: {points: 2, trans: {x: svg.CX, y: svg.CY, height: svg.R, width: svg.R}, copy: [svg.R]},
		draw: function(event, can, points) { var p0 = points[0], p1 = points[1]; return {cx: p0.x, cy: p0.y, r: parseInt(Math.sqrt(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y, 2)))} },
	},
	ellipse: { // <ellipse cx="75" cy="75" rx="20" ry="5"/>
		data: {points: 2, trans: {x: svg.CX, y: svg.CY, height: svg.RY, width: svg.RX}, copy: [svg.RY, svg.RX]},
		draw: function(event, can, points) { var p0 = points[0], p1 = points[1]; return {cx: p0.x, cy: p0.y, ry: Math.abs(p0.y - p1.y), rx: Math.abs(p0.x - p1.x)} },
	},
}, [])
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			Escape: function(event, can) { can._undo && can._undo(), can.ui.points = [] },
			gr: function(event, can) { can.ActionGo(ctx.RUN) },
			ga: function(event, can) { can.ActionGo(ice.AUTO) },
			gm: function(event, can) { can.ActionGo("manual") },

			ad: function(event, can) { can.ActionMode(web.DRAW) },
			am: function(event, can) { can.ActionMode(html.MOVE) },
			ar: function(event, can) { can.ActionMode(html.RESIZE) },

			st: function(event, can) { can.ActionShape(svg.TEXT) },
			sr: function(event, can) { can.ActionShape(svg.RECT) },
			sl: function(event, can) { can.ActionShape(svg.LINE) },
			ss: function(event, can) { can.ActionShape(svg.LINE) },
			sc: function(event, can) { can.ActionShape(svg.CIRCLE) },
			se: function(event, can) { can.ActionShape(svg.ELLIPSE) },

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
