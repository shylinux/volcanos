Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can); if (msg.Length() == 0) { return }

		can.ConfDefault({root: "ice", field: msg.append[0], split: ice.PS})
		can.dir_root = msg.Option(nfs.DIR_ROOT)||can.Conf("root")
		can._tree = can.onimport._tree(can, msg.Table(), can.Conf(mdb.FIELD), can.Conf(lex.SPLIT))
		if (!can._tree[""]) { return } can._tree[""].name = can.Conf("root")

		can.size = parseInt(can.Action("size")||24)
		can.margin = parseInt(can.Action("margin")||30)
		can.page.ClassList.add(can, can._fields, "draw")
		can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
			can.base.isFunc(cb) && cb(msg), can.onimport.layout(can)
		})
	},
	_tree: function(can, list, field, split) {
		var node = {}; can.core.List(list, function(item) { if (!item[field]) { return }
			can.core.List(can.base.trimPrefix(item[field], can.dir_root+split).split(split), function(value, index, array) {
				var last = array.slice(0, index).join(split)||"", name = array.slice(0, index+1).join(split)
				if (!value || node[name]) { return }

				node[last] = node[last]||{name: last, meta: {}, list: []}
				node[last].list.push(node[name] = {
					name: value+(index==array.length-1? "": split),
					meta: item, list: [], last: node[last],
					file: item[field]||item.file, hide: true,
				})
			})
		})
		return node
	},
	_height: function(can, tree, deep) { if (!tree) { return 0 }
		tree.deep = deep||0
		if (!tree.list || tree.list.length == 0 || tree.hide) { return tree.height = 1 }

		var height = 0; can.core.List(tree.list, function(item) {
			height += can.onimport._height(can, item, (deep||0)+1)
		})
		return tree.height = height
	},
	_width: function(can, tree, deep) { if (!tree) { return 0 }
		tree.deep = deep||0
		if (!tree.list || tree.list.length == 0 || tree.hide) { if (!tree.name) { return tree.width = 20 }
			tree.view = can.onimport.draw({}, can, {shape: html.TEXT, point: [{x: 0, y: 0}], style: {inner: tree.name}})
			return tree.width = tree.view.Val("textLength")+can.margin
		}

		var width = 0; can.core.List(tree.list, function(item) {
			width += can.onimport._width(can, item, (deep||0)+1)
		})
		return tree.width = width
	},
	_color: function(can, tree) {
		return tree.meta&&tree.meta.color || (tree.list == 0? cli.PURPLE: cli.YELLOW)
	},
	layout: function(can) { can.margin = can.margin||20
		can.onmotion.clear(can), can.onimport._show(can, can.request())
		can.svg.Val(html.FONT_SIZE, can.Action("size"))
		can.page.style(can, can._output, html.MAX_HEIGHT, "")
		can.onaction[can.Action(ice.VIEW)](event, can, can.Action(ice.VIEW))
	},
}, [""])
Volcanos(chat.ONACTION, {help: "用户操作", list: [
		[ice.VIEW, "横向", "纵向"], ["size", 24, 32, 48], ["margin", 30, 50, 100],
	],
	size: function(event, can) { can.size = parseInt(can.Action("size")||30), can.onimport.layout(can) },
	margin: function(event, can) { can.margin = parseInt(can.Action("margin")||30), can.onimport.layout(can) },
	"横向": function(event, can, button) {
		can.onimport._height(can, can._tree[""])
		can.sup.view = button, can.onmotion.clear(can, can.svg)

		can.svg.Val(html.HEIGHT, can._tree[""].height*can.margin+2*can.margin)
		can.width = 0, can.onaction._draw_horizontal(can, can._tree[""], can.margin, can.margin)
		can.svg.Val(html.WIDTH, can.width+can.margin)
	},
	"纵向": function(event, can, button) {
		can.onimport._width(can, can._tree[""])
		can.sup.view = button, can.onmotion.clear(can, can.svg)

		can.svg.Val(html.WIDTH, can._tree[""].width+2*can.margin)
		can.height = 0, can.onaction._draw_vertical(can, can._tree[""], can.margin, can.margin+can.margin)
		can.svg.Val(html.HEIGHT, can.height+can.margin)
	},
	_draw: function(can, tree, x, y, style) { var color = can.onimport._color(can, tree)
		if (!tree.name) { return }
		tree.view = can.onimport.draw({}, can, {shape: html.TEXT, point: [{x: x, y: y}], style: can.base.Copy(kit.Dict(
			html.STROKE, color, html.FILL, color, html.TEXT_ANCHOR, "start", "inner", tree.name||tree.file,
		), style), }), can.core.ItemCB(can.ondetail, tree.view, can, tree)
	},
	_draw_vertical: function(can, tree, x, y) { tree.x = x, tree.y = y
		can.onaction._draw(can, tree, x+tree.width/2, y, kit.Dict(html.TEXT_ANCHOR, "middle"))

		tree.height = can.margin
		if (y+tree.height > can.height) { can.height = y+tree.height }
		if (tree.hide) { return }

		var offset = 0; can.core.List(tree.list, function(item) { if (!item) { return }
			item.name && item.name != " " && can.onimport.draw({}, can, {shape: svg.PATH2V, point: [
				{x: x+tree.width/2, y: y+tree.height-can.margin/2},
				{x: x+offset+item.width/2, y: y+tree.height+can.margin/2},
			], style: {stroke: cli.CYAN}})
			can.onaction._draw_vertical(can, item, x+offset, y+tree.height+can.margin), offset += item.width
		})
	},
	_draw_horizontal: function(can, tree, x, y) { tree.x = x, tree.y = y
		can.onaction._draw(can, tree, x, y+tree.height*can.margin/2, kit.Dict(html.TEXT_ANCHOR, "start"))

		tree.width = tree.view&&tree.view.Val("textLength")||(tree.name||"").length*10
		if (x+tree.width > can.width) { can.width = x+tree.width }
		if (tree.hide) { return }

		var offset = 0; can.core.List(tree.list, function(item) { if (!item || !item.name) { return }
			can.onimport.draw({}, can, {shape: svg.PATH2H, point: [
				{x: x+tree.width+can.margin/8, y: y+tree.height*can.margin/2},
				{x: x+tree.width+can.margin*2-2*can.margin/8, y: y+offset+item.height*can.margin/2}
			], style: {stroke: cli.CYAN}})

			can.onaction._draw_horizontal(can, item, x+tree.width+2*can.margin, y+offset)
			offset += item.height*can.margin
		})
	},
})
Volcanos(chat.ONDETAIL, {help: "用户交互",
	onmouseenter: function(event, can, tree) { var y = tree.y+tree.height*can.margin/2
		can.page.Remove(can, can.pos), can.pos = can.onimport.draw({}, can, {shape: svg.RECT, point: [
			{x: tree.x-can.margin/4, y: y-can.margin/2}, {x: tree.x+tree.width+can.margin/8, y: y+can.margin/2},
		], style: {stroke: cli.RED, fill: html.NONE}}), can.onkeymap.prevent(event)
	},
	onclick: function(event, can, tree) {
		if (tree.list.length > 0 || tree.tags || tree.name.endsWith(can.Conf(lex.SPLIT))) {
			return tree.hide = !tree.hide, can.onaction[can.Action(ice.VIEW)](event, can)
		}

		for (var node = tree; node; node = node.last) { can.request(event, node.meta) }

		can.run(can.request(event, can.Option()), can.base.Obj(can.Conf(lex.PREFIX), []).concat([can.Option("repos")||"", tree.file||"", tree.name]), function(msg) {
			if (msg.Length() == 0) { return can.ondetail.plugin(can, "web.code.inner", [can.dir_root, tree.file, tree.line], code.INNER) }
			if (msg.Append(mdb.INDEX)) { msg.Table(function(value) { can.ondetail.plugin(can, value.index, []) }); return }

			if (msg.Option(lex.SPLIT)) {
				tree.list = can.onimport._tree(can, msg.Table(), msg.Option(mdb.FIELD)||msg.append[0], msg.Option(lex.SPLIT))[""].list||[]
				can.core.List(tree.list, function(item) { item.last = tree })
			} else {
				msg.Table(function(item) { tree.list.push({
					type: "tags", name: item.name||item.file||item[msg.append[0]],
					meta: item, list: [], last: tree,
					file: item.file, line: item.line, hide: true,
				}) })
			}
			tree.tags = true, tree.hide = !tree.hide, can.onaction[can.Action(ice.VIEW)](event, can)
		}, true)
	},
	plugin: function(can, index, args, prefix) {
		can.onappend.plugin(can, {type: chat.STORY, mode: chat.FLOAT, index: index, args: args}, function(sub) {
			sub.run = function(event, cmds, cb) { can.runAction(can.request(event), prefix||[ice.RUN, index], cmds, cb) }
			sub.onaction.close = function() { can.page.Remove(can, sub._target) }
			can.getActionSize(function(left, top, width, height) { left = left||0
				var top = can.Mode() == undefined? 120: 0; if (can.user.isMobile) { top = can.user.isLandscape()? 0: 48 }
				sub.ConfHeight(height-top-2*html.ACTION_HEIGHT-(can.user.isMobile&&!can.user.isLandscape()? 2*html.ACTION_HEIGHT: 0)), sub.ConfWidth(width)
				can.onmotion.move(can, sub._target, {left: left, top: top})
			})
		})
	},
})
