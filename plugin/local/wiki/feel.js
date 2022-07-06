Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.path = can.request(), can.list = [], msg.Table(function(value) {
			can.base.endWith(value.path, ice.PS)? can.path.Push(value): can.list.push(value)
		}), can.base.isFunc(cb) && cb(msg)

		can.ui = can.onlayout.display(can, target)
		can.onappend.table(can, can.path, null, can.ui.content)
		can.onappend._status(can, can.onexport.list)

		can.Action(html.HEIGHT, msg.Option(html.HEIGHT)||msg._cmds[1]||"100")
		can.Action(html.SPEED, msg.Option(html.SPEED)||msg._cmds[2]||"1")
		can.Action(mdb.LIMIT, msg.Option(mdb.LIMIT)||msg._cmds[3]||"6")
		can.onmotion.hidden(can, can._action)

		can.begin = parseInt(can.begin||msg.Option(cli.BEGIN)||"0")
		can.dir_root = msg.Option(nfs.DIR_ROOT)
		can.onimport.page(can, can.list)
	},
	_file: function(can, path, index) { var p = location.href.indexOf(ice.HTTP) == 0? "": "http://localhost:9020"
		return path.indexOf(ice.HTTP) == 0? path: p+can.base.Path("/share/local", can.dir_root||"", path)
	},
	file: function(can, path, index) { path = can.onimport._file(can, path, index)
		var cb = can.onfigure[can.base.Ext(path)]||can.onfigure["image"]; can.Status(nfs.FILE, path)
		can.base.isFunc(cb) && can.page.Append(can, can.ui.display, [cb(can, path, index)])
	},
	page: function(can, list, begin, limit) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.begin), limit = parseInt(limit||can.Action(mdb.LIMIT))
		for (var i = begin; i < begin+limit; i++) { list && list[i] && can.onimport.file(can, list[i].path, i) }
		can.Status({begin: begin, limit: limit, total: can.list.length})
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "组件菜单",
	png: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpeg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	image: function(can, path, index) { return {img: path, height: can.Action(html.HEIGHT),
		onmouseover: function(event) { can.Status(nfs.FILE, path) },
		onclick: function(event) { can.ondetail._init(can, index) },
	} },

	video: function(can, path) { var auto = can.user.isMobile&&can.Action(mdb.LIMIT)!="1"? false: true, loop = true, total = 0; function cb(event) { }
		return {type: html.VIDEO, style: {height: parseInt(can.Action(html.HEIGHT))}, className: "preview",
			data: {src: path, controls: "controls", autoplay: auto, loop: loop, playbackRate: parseFloat(can.Action(html.SPEED))},
			oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
			onmouseover: function(event) { can.Status(nfs.FILE, path) },
			onloadedmetadata: function(event) { total = event.timeStamp
				event.target.currentTime = can._msg.currentTime || 0
			}, onloadeddata: cb, ontimeupdate: function(event) {
				can.Status(nfs.FILE) == path && can.Status("position", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
			},
		}
	},
	mp4: function(can, path) { return can.onfigure.video(can, path) },
	m4v: function(can, path) { return can.onfigure.video(can, path) },
	mov: function(can, path) { return can.onfigure.video(can, path) },
})
Volcanos(chat.ONACTION, {help: "组件菜单", list: [
		[html.HEIGHT, 100, 200, 400, 600, 800],
		[html.SPEED, 0.1, 0.2, 0.5, 1, 2, 3, 5, 10],
		[mdb.LIMIT, 1, 3, 6, 9, 12, 15, 20, 30, 50],
	],
	prev: function(event, can) {
		if (can.begin > 0) {
			can.begin -= parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list)
		} else {
			can.user.toast(can, "已经是第一页了")
		}
	},
	next: function(event, can) {
		if (can.begin + parseInt(can.Action(mdb.LIMIT)) < can.list.length) {
			can.begin += parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list)
		} else {
			can.user.toast(can, "已经是最后一页了")
		}
	},
	height: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	speed: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	limit: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },

	chooseImage: function(event, can) { var msg = can.request(event)
		can.user.agent.chooseImage(function(list) { can.core.List(list, function(item) {
			can.page.Append(can, can._output, [{img: item, height: 200}])
		}) })
	},
})
Volcanos(chat.ONDETAIL, {help: "组件菜单", list: ["关闭", "下载", "删除", "上一个", "下一个", "设置头像", "设置背景", "复制链接"], _init: function(can, index) {
		can.onappend._init(can, {type: "story feel float"}, [], function(sub) { can.sub = sub
			sub.run = function(event, cmds, cb) { return can.run(event, cmds, cb, true) }

			sub.getActionSize(function(msg, left, top, width, height) {
				sub.page.style(sub, sub._target, {left: left, top: top})
				sub.page.style(sub, sub._output, html.WIDTH, width, html.HEIGHT, height-2*html.ACTION_HEIGHT)
				sub.onappend._action(can, can.ondetail.list, sub._action, can.ondetail)
				sub.onappend._status(sub, ["begin", "file"])

				can.order = index, can.show = function(order) { path = can.onimport._file(can, can.list[order].path)
					var cb = can.onfigure[can.base.Ext(path)]||can.onfigure["image"]
					
					sub.page.Appends(sub, sub._output, [can.base.Copy(cb(can, path, index), {height: "", style: kit.Dict(html.MAX_WIDTH, width, html.MAX_HEIGHT, height-2*html.ACTION_HEIGHT)})])
					sub.Status(cli.BEGIN, order+1+ice.PS+can.list.length), sub.Status(nfs.FILE, path)
				}, can.show(can.order)
			})
		}, can._root._target)
	},
	"关闭": function(event, can) { can.page.Remove(can, can.sub._target) },
	"下载": function(event, can) { can.user.download(can, path = can.onimport._file(can, can.list[can.order].path)) },
	"删除": function(event, can) { can.runAction(event, nfs.TRASH, [can.list[can.order].path], function(msg) { can.user.toastSuccess(can, "删除成功") }, true) },
	"上一个": function(event, can) { can.order > 0? can.show(--can.order): can.user.toast(can, "已经是第一张啦!") },
	"下一个": function(event, can) { can.order < can.list.length-1? can.show(++can.order): can.user.toast(can, "已经是最后一张啦!") },
	"设置头像": function(event, can) { can.setHeader("avatar", can.onimport._file(can, can.list[can.order].path)) },
	"设置背景": function(event, can) { can.setHeader("background", can.onimport._file(can, can.list[can.order].path)) },
	"复制链接": function(event, can) { can.user.copy(event, can, can.misc.MergeURL(can, {_path: can.onimport._file(can, can.list[can.order].path)}, true)) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, nfs.FILE, "position"],
	position: function(can, index, total) { total = total || can.max
		return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+ice.PS+parseInt(total)
	},
})
