Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
		can.path = can.request(), can.list = [], msg.Table(function(value) {
			value.path.lastIndexOf(ice.PS)==value.path.length-1? can.path.Push(value): can.list.push(value)
		})

		can.base.isFunc(cb) && cb(msg)
		can.ui = can.onlayout.display(can, target)
		can.onappend.table(can, can.path, null, can.ui.content)
		can.dir_root = msg.Option("dir_root")

		can.Action("height", msg.Option("height")||"100")
		can.Action("limit", msg.Option("limit")||"6")
		can.Action("rate", msg.Option("rate")||"1")
		can.onmotion.hidden(can, can._action)

		can.begin = msg.Option("begin")||"0"
		can.onimport.page(can, can.list)
	},
	_file: function(can, path, index) { var p = location.href.indexOf("http") == 0? "": "http://localhost:9020"
		return path.indexOf("http") == 0? path: p+can.base.Path("/share/local", can.dir_root||"", path)
	},
	file: function(can, path, index) { path = can.onimport._file(can, path, index)
		var cb = can.onfigure[can.base.Ext(path)]; can.Status("file", path)
		can.base.isFunc(cb) && can.page.Append(can, can.ui.display, [cb(can, path, index)])
	},
	page: function(can, list, begin, limit) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.begin), limit = parseInt(limit||can.Action("limit"))
		for (var i = begin; i < begin+limit; i++) { list && list[i] && can.onimport.file(can, list[i].path, i) }
		can.Status({begin: begin, limit: limit, total: can.list.length})
	},
}, ["/plugin/local/wiki/feel.css"])
Volcanos("onfigure", {help: "组件菜单", list: [],
	png: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpeg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	image: function(can, path, index) { return {img: path, height: can.Action("height"), onclick: function(event) {
		can.ondetail._init(can, index)
	}, _init: function(target) { can.Status("file", path) },
		onmouseover: function(event) { can.Status("file", path) },
	} },

	video: function(can, path) { var auto = can.user.isMobile&&can.Action("limit")!="1"? false: true, loop = true, total = 0; function cb(event) { }
		return {type: "video", style: {height: parseInt(can.Action("height"))}, className: "preview",
			data: {src: path, controls: "controls", autoplay: auto, loop: loop, playbackRate: parseFloat(can.Action("rate"))},
			oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
			onmouseover: function(event) { can.Status("file", path) },
			onloadedmetadata: function(event) { total = event.timeStamp
				event.target.currentTime = can._msg.currentTime || 0
			}, onloadeddata: cb, ontimeupdate: function(event) {
				can.Status("file") == path && can.Status("position", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
			},
		}
	},
	mp4: function(can, path) { return can.onfigure.video(can, path) },
	m4v: function(can, path) { return can.onfigure.video(can, path) },
	mov: function(can, path) { return can.onfigure.video(can, path) },
})
Volcanos("onaction", {help: "组件菜单", list: [
		["height", 100, 200, 400, 600, 800],
		["limit", 1, 3, 6, 9, 12, 15, 20, 30],
		["rate", 0.1, 0.2, 0.5, 1, 2, 3, 5, 10],
	],
	"上一页": function(event, can, key, value) {
		can.begin > 0 && (can.begin -= parseInt(can.Action("limit")), can.onimport.page(can, can.list))
	},
	"下一页": function(event, can, key, value) {
		can.begin + parseInt(can.Action("limit")) < can.list.length && (can.begin += parseInt(can.Action("limit")), can.onimport.page(can, can.list))
	},

	"height": function(event, can, key, value) { 
		can.Action("height", value), can.onimport.page(can, can.list)
	},
	"limit": function(event, can, key, value) { 
		can.Action("limit", value), can.onimport.page(can, can.list)
	},
	"rate": function(event, can, key, value) { 
		can.Action("rate", value), can.onimport.page(can, can.list)
	},

	chooseImage: function(event, can) { var msg = can.request(event)
		can.user.agent.chooseImage(function(list) { can.core.List(list, function(item) {
			can.page.Append(can, can._output, [{img: item, height: 200}])
		}) })
	},
})
Volcanos("ondetail", {help: "组件菜单", list: ["关闭", "下载", "删除", "上一个", "下一个", "设置头像", "设置背景", "复制链接"], _init: function(can, index) {
		can.onappend._init(can, {type: "story feel float"}, [], function(sub) { can.sub = sub
			sub.run = function(event, cmds, cb) { return can.run(event, cmds, cb, true) }

			sub.getActionSize(function(msg, left, top, width, height) {
				sub.page.Modify(sub, sub._target, {style: {left: left, top: top}})
				sub.page.Modify(sub, sub._output, {style: {"max-width": width, "max-height": height}})
				sub.onappend._action(can, can.ondetail.list, sub._action, can.ondetail)

				can.order = index, can.show = function(order) {
					path = can.onimport._file(can, can.list[order].path)
					sub.page.Appends(sub, sub._output, [{img: path, style: {"max-width": width, "max-height": height-2*html.ACTION_HEIGHT}}])
					sub.Status("begin", order+1+ice.PS+can.list.length), sub.Status("file", path)
				}, can.show(can.order)
			})
		}, document.body)
	},
	"关闭": function(event, can) { can.page.Remove(can, can.sub._target) },
	"下载": function(event, can) { can.user.download(can, path = can.onimport._file(can, can.list[can.order].path)) },
	"删除": function(event, can) {
		can.run(event, [ctx.ACTION, mdb.REMOVE, can.list[can.order].path], function(msg) { can.user.toast(can, "删除成功") }, true)
	},
	"上一个": function(event, can) { can.order > 0? can.show(--can.order): can.user.toast(can, "已经是第一张啦!") },
	"下一个": function(event, can) { can.order < can.list.length-1? can.show(++can.order): can.user.toast(can, "已经是最后一张啦!") },
	"设置头像": function(event, can) { var msg = can.request(event, {url: can.onimport._file(can, can.list[can.order].path)})
		can.search(event, ["Header.onimport.avatar"], null, true)
	},
	"设置背景": function(event, can) { var msg = can.request(event, {url: can.onimport._file(can, can.list[can.order].path)})
		can.search(event, ["Header.onimport.background"], null, true)
	},
	"复制链接": function(event, can) {
		can.user.copy(event, can, can.misc.MergeURL(can, {_path: can.onimport._file(can, can.list[can.order].path)}, true))
	},
})
Volcanos("onexport", {help: "导出数据", list: ["begin", "limit", "total", "position", "file"],
	position: function(can, index, total) { total = total || can.max
		return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+ice.PS+parseInt(total)
	},
})
