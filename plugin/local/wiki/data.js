Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg, list, cb) {
		can.ui = can.onlayout.display(can)
		can.base.isFunc(cb) && cb(msg)

		can.table = can.onappend.table(can, msg, function(value, key, index, line) {
			return {text: [value, "td"], oncontextmenu: function(event) {
				can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, cmd, meta) {
					var cb = meta[cmd]; cb && cb(event, can, cmd, value, key, index, line)
				})
			}, ondblclick: function(event) {
				can.page.Modify(can, event.target, {contenteditable: true})
			}, onclick: function(event) {
				if (key == "path") { can.run(event, [can.Option("path", value)]) }
			}}
		}, can.ui.content)

		can.onexport.list = msg.append
		can.onaction._compute(event, can)
	},
})
Volcanos(chat.ONFIGURE, {help: "组件菜单", list: [],
	"求和": function(event, can, res, td, index) {
		res[index] = parseInt(td.innerText) + (res[index]||0);
	},
	"最大": function(event, can, res, td, index) {
		var n = parseInt(td.innerText);
		n > (res[index]||-10000) && (res[index] = n);
	},
	"最小": function(event, can, res, td, index) {
		var n = parseInt(td.innerText);
		n < (res[index]||10000) && (res[index] = n);
	},
	"平均": function(event, can, res, td, ncol, cols, rows, nrow) {
		res[ncol] = parseInt(td.innerText) + (res[ncol]||0);
		if (nrow == rows.length - 1) {
			res[ncol] = res[ncol] / nrow
		}
	},
})
Volcanos(chat.ONACTION, {help: "组件菜单", list: ["保存", ["mode", "全选", "块选", "反选", "多选", "拖动", "编辑"], ["some", "求和", "最大", "最小", "平均"]],
	_compute: function(event, can) {
		var mul = "tr" + (can.Action("mode") == "全选"? "": ".select")
		var method = can.onfigure[can.Action("some")], res = {}

		can.page.Select(can, can.ui.content, mul, function(tr, nrow, rows) {
			(mul != "tr" || nrow > 0) && can.page.Select(can, tr, "td", function(td, ncol, cols) {
				method && method(event, can, res, td, ncol, cols, rows, nrow)
			})
		})

		can.core.Item(res, function(key, value) {
			can.Status(can._msg.append[key], value||"")
		})
	},

	"保存": function(event, can, cmd) {
		can.runAction(event, cmd, [can.Option("path"), can.onexport.file(can)])
	},
	some: function(event, can, cmd) {
		can.onaction._compute(event, can)
	},

	"全选": function(event, can, cmd) {
		cmd && can.Action("mode", cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			can.page.ClassList.del(can, item, "over")
			can.page.ClassList.del(can, item, "select")
			item.setAttribute("contenteditable", false)
			item.setAttribute("draggable", false)
			item.onmouseenter = null
			item.onclick = null
		})
		can.onaction._compute(event, can)
	},
	"块选": function(event, can, cmd) {
		cmd && can.Action("mode", cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.add(can, item, "select")
				can.onaction._compute(event, can)
			}
		})
	},
	"反选": function(event, can, cmd) {
		cmd && can.Action("mode", cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.del(can, item, "select")
				can.onaction._compute(event, can)
			}
		})
	},
	"多选": function(event, can, cmd) {
		cmd && can.Action("mode", cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			item.onclick = function() {
				can.page.ClassList.neg(can, item, "select")
				can.onaction._compute(event, can)
			}
		})
	},
	"拖动": function(event, can, cmd) {
		can.onaction["全选"](event, can, cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			item.setAttribute("draggable", true)
			item.ondragstart = function(event) { can.drag = item }
			item.ondragover = function(event) { event.preventDefault(), can.page.ClassList.add(can, item, "over")}
			item.ondragleave = function(event) { can.page.ClassList.del(can, item, "over") }
			item.ondrop = function(event) { event.preventDefault()
				can.page.Select(can, can.ui.content, "table", function(table) {
					table.insertBefore(can.drag, item)
				})
			}
		})
	},
	"编辑": function(event, can, cmd) {
		cmd && can.Action("mode", cmd)
		can.page.Select(can, can.ui.content, "tr", function(item) {
			item.setAttribute("contenteditable", true)
		})
	},
})
Volcanos(chat.ONDETAIL, {help: "组件详情", list: ["复制", "删除"],
	"复制": function(event, can, cmd, value, key, index, line) {
		var end = can.page.Append(can, can.table, [{type: "tr", list: can.core.List(can._msg.append, function(key) {
			return {text: [line[key], "td"]}
		})}]).tr
		can.table.insertBefore(end, event.target.parentNode)
	},
	"删除": function(event, can, cmd) {
		can.page.Remove(can, event.target.parentNode)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [],
	file: function(can) {
		return can.page.Select(can, can.ui.content, "tr", function(tr) {
			return can.page.Select(can, tr, "th,td", function(td) {return td.innerHTML}).join(",")
		}).join("\n")
	},
})
