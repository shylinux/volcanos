Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
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
})
