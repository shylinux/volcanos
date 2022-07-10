Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can._action)
		var cbs = can.onimport[can._args[ctx.STYLE]]; if (can.base.isFunc(cbs)) {
			can.page.ClassList.add(can, target, can._args[ctx.STYLE])
			return cbs(can, msg, target)
		}

		can.onmotion.clear(can, target)
		can.onappend.table(can, msg, null, target)
		can.onappend.board(can, msg, target)
		can.onmotion.story.auto(can, target)
		can.base.isFunc(cb) && cb(msg)
	},
	card: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(value) {
			return {view: html.ITEM+" "+(value.status||""), list: [
				{view: [wiki.TITLE, html.DIV, value.name]},
				{view: [wiki.CONTENT, html.DIV, value.text]},
				{view: html.ACTION, inner: value.action, onclick: function(event) {
					can.runAction(can.request(event, value), event.target.name, [])
				}},
			]}
		}))
	},
	list: function(can, root, cb, target) { target = target||can._output
		can.core.List(root.list, function(item) {
			var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list)
				can.onmotion.select(can, target, html.DIV_ITEM, event.target)
			}}, {view: html.LIST}]); can.onimport.list(can, item, cb, ui.list)
		})
	},
	item: function(can, type, item, cb, cbs, target) { target = target||can._output
		var ui = can.page.Append(can, target, [{view: [type, html.DIV, item.nick||item.name],
			onclick: function(event) { cb(event, ui.first)
				can.onmotion.select(can, target, can.core.Keys(html.DIV, type), ui.first)
			}, onmouseenter: function(event) { cbs(event, ui.first) },
		}]); return ui.first
	},

	zone: function(can, list, target) { var color = ["blue", "red", "cyan"]
		return can.page.Append(can, target, can.core.List(list, function(zone, index) { return {view: "zone", list: [
			{view: "name", inner: zone.name, style: {background: color[index%color.length]}, onclick: function() {
				can.onmotion.toggle(can, event.target.nextSibling.nextSibling)
				can.onmotion.toggle(can, event.target.nextSibling)
			}, onmouseenter: function(event) {
				can.user.carteRight(event, can, {
					"折叠": function() {
						can.page.Select(can, event.target.nextSibling.nextSibling, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, false) })
					},
					"展开": function() {
						can.page.Select(can, event.target.nextSibling.nextSibling, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) })
					},
				}, ["折叠", "展开"])
			}, _init: function(item) { if (list.length > 1 && index > 0) { can.onmotion.delay(can, function() { item.click() }) } }},
			{view: "action", _init: function(item) {
				can.onappend._action(can, [{input: "type", onkeyup: function(event) {
					can.page.Select(can, item.nextSibling, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) })
					can.page.Select(can, item.nextSibling, html.DIV_ITEM, function(item) {
						can.page.Select(can, item, "div.name", function(name) {
							can.onmotion.toggle(can, item, name.innerText.indexOf(event.target.value) > -1)
						})
					})
				}, _init: function(item) {
					can.onmotion.delay(can, function() {
						can.page.styleWidth(can, item, item.parentNode.parentNode.parentNode.offsetWidth-32)
					})
				}}], item, {})
			}},
			{view: "list", _init: function(item) {
				can.base.isFunc(zone._init) && zone._init(item)
			}}
		]} }))
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) {
			item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
				var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split)
				if (node[name]) { return }
				var ui = can.page.Append(can, node[last], [{view: "item", list: [{view: ["switch", "div", (index==array.length-1?"":"&#8963;")]}, {view: ["name", html.DIV, value+(index==array.length-1?"":"")]}], onclick: function(event) {
					index < array.length - 1? can.onmotion.toggle(can, node[name], function() {
						can.page.ClassList.add(can, ui["switch"], "open")
					}, function() {
						can.page.ClassList.del(can, ui["switch"], "open")
					}): can.base.isFunc(cb) && cb(event, item)
					if (node[name].childElementCount == 2) { node[name].firstChild.click() }
				}}, {view: html.LIST, style: {display: html.NONE}, _init: function(list) { item.expand && can.page.style(can, list, html.DISPLAY, html.BLOCK) }}])
				node[name] = ui.list
			})
		}); return node
	},
})
