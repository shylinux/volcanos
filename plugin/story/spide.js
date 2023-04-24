Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.page.requireDraw(can, function() { can.ConfDefault({field: msg.append[0], split: nfs.PS})
		can.dir_root = can.Conf(nfs.DIR_ROOT)||msg.Option(nfs.DIR_ROOT), can._tree = can.onimport._tree(can, msg.Table(), can.Conf(mdb.FIELD), can.Conf(lex.SPLIT))
		can.onaction.list = [], can.base.isFunc(cb) && cb(msg), can.onimport.layout(can)
		can.onappend._status(can, msg.Option(ice.MSG_STATUS))
	}) },
	_tree: function(can, list, field, split) { var node = {}; can.core.List(list, function(item) { can.core.List(item[field].split(split), function(value, index, array) {
		var last = array.slice(0, index).join(split)||can.dir_root, name = array.slice(0, index+1).join(split)
		value && !node[name] && (node[last] = node[last]||{name: last, meta: {}, list: []}).list.push(node[name] = {
			name: value+(index==array.length-1? "": split), file: item[field]||item.file, hide: true, meta: item, list: [], last: node[last],
		})
	}) }); return node },
	_height: function(can, tree) { tree.height = 0; if (tree.list.length == 0 || tree.hide) { return tree.height = 1 }
		can.core.List(tree.list, function(item) { tree.height += can.onimport._height(can, item) }); return tree.height
	},
	_width: function(can, tree) { tree.width = 0; if (tree.list.length == 0 || tree.hide) {
		return tree.width = can.onimport.draw(can, {shape: html.TEXT, points: [{x: 0, y: 0}], style: {inner: tree.name}}).Val(svg.TEXT_LENGTH)+can.margin
	} can.core.List(tree.list, function(item) { tree.width += can.onimport._width(can, item) }); return tree.width },
	_color: function(can, tree) { return tree.meta.color || (tree.list == 0? cli.PURPLE: cli.YELLOW) },
	layout: function(can) { can.page.ClassList.has(can, can._fields, html.FLOAT) || can.page.style(can, can._output, html.MAX_HEIGHT, "")
		can.svg && can.svg.Val(svg.FONT_SIZE, can.size = parseInt(can.Action(html.SIZE)||24)), can.margin = parseInt(can.Action(html.MARGIN)||10)
		can.core.CallFunc(can.onaction[can.Action(ice.VIEW)||"横向"], [event, can, can.Action(ice.VIEW)])
	},
})
Volcanos(chat.ONACTION, {list: [[ice.VIEW, "横向", "纵向"], [html.SIZE, 24, 32, 48], [html.MARGIN, 10, 30, 50]],
	size: function(event, can) { can.onimport.layout(can) }, margin: function(event, can) { can.onimport.layout(can) },
	"横向": function(event, can, button) { can.onimport._height(can, can._tree[can.dir_root]), can.onmotion.clear(can, can.svg)
		can.svg.Val(html.HEIGHT, can._tree[can.dir_root].height*(can.size+can.margin)+2*can.margin), can.svg.Value(svg.TEXT_ANCHOR, "start")
		can.onaction._draw_horizontal(can, can._tree[can.dir_root], can.margin, can.margin)
	},
	"纵向": function(event, can, button) { can.onimport._width(can, can._tree[can.dir_root]), can.onmotion.clear(can, can.svg)
		can.svg.Val(html.WIDTH, can._tree[can.dir_root].width+2*can.margin), can.svg.Value(svg.TEXT_ANCHOR, "middle")
		can.onaction._draw_vertical(can, can._tree[can.dir_root], can.margin, can.margin+(can.size+can.margin)/2)
	},
	_draw: function(can, tree, x, y, style) { var color = can.onimport._color(can, tree)
		tree.view = can.onimport.draw(can, {shape: html.TEXT, points: [{x: x, y: y}], style: can.base.Copy(kit.Dict(html.INNER, tree.name||" "), style)})
		return can.core.ItemCB(can.ondetail, tree.view, can, tree), tree.view
	},
	_draw_vertical: function(can, tree, x, y) {
		tree.height = can.size+can.margin, can.onaction._draw(can, tree, tree.x = x+tree.width/2, tree.y = y); if (y+tree.height > can.svg.Val(html.HEIGHT)) { can.svg.Val(html.HEIGHT, y+tree.height) }
		var offset = 0; tree.hide || can.core.List(tree.list, function(item) {
			can.onimport.draw(can, {shape: svg.PATH2V, points: [
				{x: x+tree.width/2, y: y+tree.height/2-can.margin/2}, {x: x+offset+item.width/2, y: y+tree.height/2+8*can.margin-can.margin/2},
			]}), can.onaction._draw_vertical(can, item, x+offset, y+tree.height+8*can.margin), offset += item.width
		})
	},
	_draw_horizontal: function(can, tree, x, y) { var height = can.size+can.margin
		tree.width = can.onaction._draw(can, tree, tree.x = x, tree.y = y+tree.height*(can.size+can.margin)/2).Val(svg.TEXT_LENGTH)||(tree.name.length*16); if (x+tree.width > can.svg.Val(html.WIDTH)) { can.svg.Val(html.WIDTH, x+tree.width) }
		var offset = 0; tree.hide || can.core.List(tree.list, function(item) {
			can.onimport.draw(can, {shape: svg.PATH2H, points: [
				{x: x+tree.width+can.margin/2, y: y+tree.height*height/2-can.size/4}, {x: x+tree.width+8*can.margin-can.margin/2, y: y+offset+item.height*height/2-can.size/4}
			]}), can.onaction._draw_horizontal(can, item, x+tree.width+8*can.margin, y+offset), offset += item.height*(can.size+can.margin)
		})
	},
})
Volcanos(chat.ONEXPORT, {list: [mdb.TIME, mdb.COUNT]})
Volcanos(chat.ONDETAIL, {
	onclick: function(event, can, tree) {
		if (tree.list.length > 0 || tree.name.endsWith(can.Conf(lex.SPLIT))) { return tree.hide = !tree.hide, can.onaction[can.Action(ice.VIEW)||"横向"](event, can) }
		for (var node = tree; node; node = node.last) { can.request(event, node.meta) }
		can.run(can.request(event, can.Option()), can.base.Obj(can.Conf(lex.PREFIX), []).concat([tree.file||"", tree.name]), function(msg) {
			if (msg.Length() == 0) { return can.onappend._float(can, web.CODE_INNER, [can._msg.Option(nfs.DIR_ROOT), tree.file, tree.line], code.INNER) }
			if (msg.Append(mdb.INDEX)) { return msg.Table(function(value) { can.onappend._float(can, value.index, value.args) }) }
		}, true)
	},
})
