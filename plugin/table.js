Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
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
			return {view: html.ITEM, list: [
				{view: [wiki.TITLE, html.DIV, value.name]},
				{view: [wiki.CONTENT, html.DIV, value.text]},
				{view: html.ACTION, inner: value.action, onclick: function(event) {
					can.run(can.request(event, value), [ctx.ACTION, event.target.name])
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
})
