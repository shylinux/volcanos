Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
		can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can._action)
		var cbs = can.onimport[can._args["style"]]; if (can.base.isFunc(cbs)) {
			can.page.ClassList.add(can, target, can._args["style"])
			return cbs(can, msg, target)
		}
		can.onmotion.clear(can, target)
		can.onappend.table(can, msg, null, target)
		can.onappend.board(can, msg, target)
		can.onmotion.story.auto(can, target)
		can.base.isFunc(cb) && cb(msg)
	},

	_process: function(can, msg) {
		msg.Option(ice.MSG_TOAST) && can.user.toast(can, msg.Option(ice.MSG_TOAST))
		return can.core.CallFunc([can.onimport, msg.Option(ice.MSG_PROCESS)], [can, msg])
	},
	card: function(can, msg, target) {
		can.page.Append(can, target, msg.Table(function(value) {
			return {view: "item", list: [
				{view: ["title", "div", value.name]},
				{view: ["content", "div", value.text]},
				{view: "operate", inner: value.action, onclick: function(event) {
					can.request(event, value)
					can.run(event, [ctx.ACTION, event.target.name])
				}},
			]}
		}))
	},
})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

