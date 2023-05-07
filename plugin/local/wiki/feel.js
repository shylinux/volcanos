Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can), can.dir_root = msg.Option(nfs.DIR_ROOT)
		can._path = can.request(), can.list = [], msg.Table(function(value) { can.base.endWith(value.path, nfs.PS)? can._path.Push(value): can.list.push(value) })
		can.ui = can.onappend.layout(can, [html.PROJECT, html.DISPLAY])
		can._path.Table(function(item) { item.name = item.path
			can.onimport.item(can, item, function() { can.Option(nfs.PATH, item.path), can.Update() }, function() {}, can.ui.project)
		}), cb(msg), can.onimport.page(can, can.list, can.begin = parseInt(msg.Option(cli.BEGIN)||"0"))
		can.isCmdMode() || can.onmotion.hidden(can, can._action), can.onmotion.delay(can, function() { can.onimport.layout(can) })
	},
	_file: function(can, path, index) { var p = location.href.indexOf(ice.HTTP) == 0? "": "http://localhost:9020"
		return path.indexOf(ice.HTTP) == 0? path: p+can.base.Path(web.SHARE_LOCAL, can.dir_root||"", path)
	},
	file: function(can, path, index) { path = can.onimport._file(can, path, index)
		var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]; can.Status(nfs.FILE, path)
		can.base.isFunc(cb) && can.page.Append(can, can.ui.display, [cb(can, path, index)])
	},
	page: function(can, list, begin, limit) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.begin), limit = parseInt(limit||can.Action(mdb.LIMIT))
		for (var i = begin; i < begin+limit; i++) { list && list[i] && can.onimport.file(can, list[i].path, i) }
		can.Status({begin: begin, limit: limit, total: list.length})
	},
	layout: function(can) {
		can.page.style(can, can.ui.display, html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth-1)
		can.page.style(can, can.ui.project, html.HEIGHT, can.ui.display.offsetHeight)
		// can.page.style(can, can.ui.display, html.WIDTH, "")
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	png: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	jpeg: function(can, path, index) { return can.onfigure.image(can, path, index) },
	image: function(can, path, index) { return {img: path, height: can.onexport.height(can),
		onmouseover: function(event) { can.Status(nfs.FILE, path) },
		onclick: function(event) { can.ondetail._init(can, index) },
	} },
	video: function(can, path) { var auto = can.user.isMobile&&can.Action(mdb.LIMIT)!="1"? false: true, loop = true, total = 0; function cb(event) { }
		return {type: html.VIDEO, style: {height: can.onexport.height(can)}, className: "preview",
			data: {src: path, controls: "controls", autoplay: false&&auto, loop: loop, playbackRate: parseFloat(can.Action(html.SPEED))},
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
	webm: function(can, path) { return can.onfigure.video(can, path) },
})
Volcanos(chat.ONACTION, {list: [
		[html.HEIGHT, ice.AUTO, 100, 200, 400, 600, 800, ice.AUTO],
		[mdb.LIMIT, 6, 1, 3, 6, 9, 12, 15, 20, 30, 50],
		[html.SPEED, 0.1, 0.2, 0.5, 1, 2, 3, 5, 10],
	],
	height: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	limit: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	speed: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	prev: function(event, can) { if (can.begin > 0) { can.begin -= parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list) } else { can.user.toast(can, "已经是第一页了") } },
	next: function(event, can) { if (can.begin + parseInt(can.Action(mdb.LIMIT)) < can.list.length) { can.begin += parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list) } else { can.user.toast(can, "已经是最后一页了") } },
	record0: function(event, can, name, cb) { can.user.input(event, can, [{name: nfs.FILE, value: name}], function(list) { var height = window.innerHeight
		navigator.mediaDevices.getDisplayMedia({video: {height: height}}).then(function(stream) {
			can.core.Next([3, 2, 1], function(item, next) { can.user.toast(can, item + "s 后开始截图"), can.onmotion.delay(can, next, 1000) }, function() { can.user.toast(can, "现在开始截图")
				cb(stream, function(blobs, ext) { var msg = can.request(event); msg._upload = new File(blobs, list[0]+nfs.PT+ext)
					can.runAction(msg, html.UPLOAD, [], function() { can.user.toast(can, "上传成功"), can.Update() })
					can.core.List(stream.getTracks(), function(item) { item.stop() })
				})
			})
		}).catch(function(err) { can.user.toast(can, err.name + ": " + err.message) })
	}) },
	record1: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) { var height = window.innerHeight
		var video = can.page.Append(can, document.body, [{type: html.VIDEO, height: height}])._target; video.srcObject = stream, video.onloadedmetadata = function() { video.play(), width = video.offsetWidth
			var canvas = can.page.Append(can, document.body, [{type: html.CANVAS, height: height, width: width}])._target; canvas.getContext("2d").drawImage(video, 0, 0, width, height)
			canvas.toBlob((blob) => { cb([blob], nfs.PNG) })
		}
	}) },
	record2: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) {
		var recorder = new MediaRecorder(stream, {mimeType: 'video/webm'}), blobs = []; recorder.ondataavailable = function(res) { blobs.push(res.data) }
		recorder.onstop = function() { cb(blobs, nfs.WEBM) }, recorder.start(1)
	}) },
})
Volcanos(chat.ONDETAIL, {list: ["关闭", "上一个", "下一个", "设置头像", "设置背景", "复制链接", "下载", "删除"], _init: function(can, index) {
		can.onappend._init(can, {type: "story feel play float"}, [], function(sub) { can.sub = sub, sub._legend.onclick = can._legend.onclick
			can.getActionSize(function(msg, left, top, width, height) { sub.onappend._action(can, can.ondetail.list, sub._action, can.ondetail), sub.onappend._status(sub, ["begin", nfs.FILE])
				sub.page.style(sub, sub._target, {left: left||0, top: top||0}), sub.page.style(sub, sub._output, html.HEIGHT, height-2*html.ACTION_HEIGHT, html.WIDTH, width)
				can.order = index, can.show = function(order) { path = can.onimport._file(can, can.list[order].path); var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]
					sub.page.Appends(sub, sub._output, [can.base.Copy(cb(can, path, index), {height: "", style: kit.Dict(html.MAX_WIDTH, width, html.MAX_HEIGHT, height-2*html.ACTION_HEIGHT)})])
					sub.Status(cli.BEGIN, order+1+nfs.PS+can.list.length), sub.Status(nfs.FILE, path)
				}, can.show(can.order)
			}), sub.run = function(can, cmds, cb) { can.run(can, cmds, cb, true) }
		}, can._root._target)
	},
	"关闭": function(event, can) { can.page.Remove(can, can.sub._target) },
	"上一个": function(event, can) { can.order > 0? can.show(--can.order): can.user.toast(can, "已经是第一张啦!") },
	"下一个": function(event, can) { can.order < can.list.length-1? can.show(++can.order): can.user.toast(can, "已经是最后一张啦!") },
	"设置头像": function(event, can) { can.setHeader(aaa.AVATAR, can.onimport._file(can, can.list[can.order].path)) },
	"设置背景": function(event, can) { can.setHeader(aaa.BACKGROUND, can.onimport._file(can, can.list[can.order].path)) },
	"复制链接": function(event, can) { can.onmotion.share(event, can, [], [mdb.LINK, can.user.copy(event, can, can.misc.MergeURL(can, {_path: can.onimport._file(can, can.list[can.order].path)}, true)) ]) },
	"下载": function(event, can) { can.user.download(can, path = can.onimport._file(can, can.list[can.order].path)) },
	"删除": function(event, can) { can.runAction(event, nfs.TRASH, [can.list[can.order].path], function(msg) { can.user.toastSuccess(can, "删除成功") }, true) },
})
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, nfs.FILE, "position"],
	height: function(can) { var height = can.Action(html.HEIGHT); return parseInt(height == ice.AUTO? can.base.Min(can.ConfHeight()/4, 200): height)||200 },
	position: function(can, index, total) { total = total || can.max; return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+nfs.PS+parseInt(total) },
})
