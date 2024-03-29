Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.onmotion.clear(can)
		can.ui = can.onappend.layout(can, [html.PROJECT, [html.CONTENT, html.DISPLAY]])
		can.dir_root = msg.Option(nfs.DIR_ROOT), can.list = [], can._path = can.request(), cb && cb(msg)
		msg.Table(function(item) { item.name = can.base.trimPrefix(item.path, can.Option(nfs.PATH))
			can.base.endWith(item.path, nfs.PS)? can.onimport.item(can, item, function(event) { can.Option(nfs.PATH, item.path) && can.Update(event) }): can.list.push(item)
		})
		var rate = can.misc.localStorage(can, "web.wiki.feel:rate"); rate && can.Action("speed", rate)
		can.core.List(can.list, function(item, index) { var last = can.misc.localStorage(can, can.onexport.key(can, "p", can.onimport._file(can, item.path)))
			item.nick = (last? last+" ": "")+item.name; var target = can.onimport.item(can, item, function(_event) {
			var target = _event.target
			can.cb = function(event) { var next = _event.target.nextSibling
				can.misc.localStorage(can, can.onexport.key(can, "last"), item.path)
				can.video = event.target, can.Status(item), target.innerHTML = parseInt(event.target.currentTime*100/event.target.duration)+"% "+item.name
				if (event.type == "ratechange") { can.misc.localStorage(can, "web.wiki.feel:rate", event.target.playbackRate) }
				if (event.type == "ended" && next) { can.onmotion.delay(can, function() { next.click() }, 3000), can.user.toast(can, "3s 后即将播放下一个", "", 3000) }
			}
			can.onmotion.clear(can, can.ui.content)
			can.onimport.file(can, item.path, item, index, can.ui.content, can.ConfHeight()-can.onexport.height(can)-1, true).focus()
			can.onmotion.delay(can, function() { target.scrollIntoView(), can.onimport.layout(can, can.ConfHeight(), can.ConfWidth()) })
		}, function() {}, can.ui.project); 
			if (can.isCmdMode() && item.path == can.misc.localStorage(can, can.onexport.key(can, "last"))) {
				can.onmotion.hidden(can, can.ui.display), can.onmotion.hidden(can, can._action), can.Action(html.HEIGHT, "hide")
				target.click(), can.isCmdMode() && can.onmotion.delay(can, function() { can.onaction.full({}, can) })
			}
		})
		can.onimport.page(can, can.list, can.begin = parseInt(msg.Option(cli.BEGIN)||"0"))
	},
	_file: function(can, path) { var p = location.href.indexOf(ice.HTTP) == 0? "": "http://localhost:9020"
		return path.indexOf(ice.HTTP) == 0? path: p+can.base.Path(web.SHARE_LOCAL, can.dir_root||"", path)
	},
	file: function(can, path, item, index, target, height, auto) { path = can.onimport._file(can, path)
		var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]; can.Status(nfs.FILE, path)
		return cb && can.page.Append(can, target||can.ui.display, [cb(can, path, item, index, height, auto)])._target
	},
	page: function(can, list, begin, limit) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.begin), limit = parseInt(limit||can.Action(mdb.LIMIT))
		for (var i = begin; i < begin+limit; i++) { list && list[i] && can.onimport.file(can, list[i].path, list[i], i) }
		can.Status({begin: begin, limit: limit, total: list.length})
	},
	layout: function(can, height, width) {
		can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth)
		can.page.style(can, can.ui.display, html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth)
		can.list.length > 0 && can.page.style(can, can.ui.project, html.HEIGHT, can.base.Min(can.ui.display.offsetHeight, can.Action(html.HEIGHT), can.ConfHeight()))
		can.isCmdMode() && can.page.style(can, can.ui.project, html.HEIGHT, can.ConfHeight())
		can.isCmdMode() && can.page.Select(can, can.ui.content, html.VIDEO, function(target) {
			can.page.isDisplay(can.ui.project)?
				can.page.style(can, target, html.HEIGHT, can.ui.content.offsetHeight, html.MAX_WIDTH, can.ui.content.offsetWidth):
				can.page.style(can, target, html.HEIGHT, can.page.height(), html.MAX_WIDTH, can.page.width())
		})
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	png: function(can, path, item, index, height) { return can.onfigure.image(can, path, item, index, height) },
	jpg: function(can, path, item, index, height) { return can.onfigure.image(can, path, item, index, height) },
	jpeg: function(can, path, item, index, height) { return can.onfigure.image(can, path, item, index, height) },
	image: function(can, path, item, index, height) { return {img: path, height: height||can.onexport.height(can),
		onmouseover: function(event) { can.Status(nfs.FILE, path), can.Status(item) },
		onclick: function(event) { can.ondetail._init(can, index) },
	} },
	video: function(can, path, item, index, height, auto) { var total = 0, cb = can.cb||function cb(event) { }
		var init, last = can.misc.localStorage(can, can.onexport.key(can, path))||0
		return {type: html.VIDEO, style: {height: height||can.onexport.height(can)},
			data: {src: path, controls: "controls", autoplay: auto, playbackRate: parseFloat(can.Action(html.SPEED))},
			oncanplay: cb, onplay: cb, onpause: cb, oncontextmenu: cb, onratechange: cb, onseeked: cb,
			onmouseover: function(event) { can.Status(nfs.FILE, path), can.Status(item) },
			onloadedmetadata: function(event) { total = event.timeStamp
				event.target.currentTime = can._msg.currentTime || 0
			}, onloadeddata: cb, ontimeupdate: function(event) { cb(event)
				can.misc.localStorage(can, can.onexport.key(can, path), event.target.currentTime)
				can.misc.localStorage(can, can.onexport.key(can, "p", path), parseInt(event.target.currentTime*100/event.target.duration)+"%")
				if (!init) { init = true, event.target.currentTime = last }
				can.Status("position", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
			}, onended: function(event) { cb(event), can.misc.localStorage(can, can.onexport.key(can, path), "") },
		}
	},
	mp4: function(can, path, item, index, height, auto) { return can.onfigure.video(can, path, item, index, height, auto) },
	m4v: function(can, path, item, index, height, auto) { return can.onfigure.video(can, path, item, index, height, auto) },
	mov: function(can, path, item, index, height, auto) { return can.onfigure.video(can, path, item, index, height, auto) },
	webm: function(can, path, item, index, height, auto) { return can.onfigure.video(can, path, item, index, height, auto) },
})
Volcanos(chat.ONACTION, {list: ["full",
		[html.HEIGHT, 100, 200, 400, 600, 800, "max", "hide", ice.AUTO],
		[mdb.LIMIT, 6, 1, 3, 6, 9, 12, 15, 20, 30, 50],
		[html.SPEED, 1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5, 10],
	],
	height: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	limit: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	speed: function(event, can, key, value) { can.Action(key, value), can.onimport.page(can, can.list) },
	prev: function(event, can) { if (can.begin > 0) { can.begin -= parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list) } else { can.user.toast(can, "已经是第一页了") } },
	next: function(event, can) { if (can.begin + parseInt(can.Action(mdb.LIMIT)) < can.list.length) { can.begin += parseInt(can.Action(mdb.LIMIT)), can.onimport.page(can, can.list) } else { can.user.toast(can, "已经是最后一页了") } },
	full: function(event, can) {
		var show = can.onmotion.toggle(can, can.ui.project); can.onmotion.toggle(can, can.ui.display), can.onimport.layout(can, can.ConfHeight(), can.ConfWidth())
		can.page.ClassList.set(can, can.ui.content, "float", !show), can.page.Select(can, can.ui.content, "*", function(target) { target.focus()
			can.page.style(can, target, html.HEIGHT, can.ConfHeight()+(!show? 2*html.ACTION_HEIGHT: 0)-can.ui.display.offsetHeight)
		})
	},
	onkeydown: function(event, can) { try {
		if (event.target != can.video) {
			if (event.key == "ArrowLeft") { can.video.currentTime -= 15 }
			if (event.key == "ArrowRight") { can.video.currentTime += 15 }
		}
		if (event.key == "Escape") { can.onaction.full(event, can) }
		if (event.key == "ArrowUp") { can.user.toast(can, parseInt((can.video.volume += 0.1)*100)) }
		if (event.key == "ArrowDown") { can.user.toast(can, parseInt((can.video.volume -= 0.1)*100)) }
	} catch (e) {} },
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
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, nfs.FILE, nfs.SIZE, "position"],
	height: function(can) { var height = can.Action(html.HEIGHT); return parseInt(height == "hide"? 0: height == "max"? can.ConfHeight(): height == ice.AUTO? can.base.Min(can.ConfHeight()/4, 200): height) },
	position: function(can, index, total) { total = total || can.max; return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+nfs.PS+parseInt(total) },
	key: function(can) { return [can.Conf(ctx.INDEX)].concat(can.core.List(arguments).slice(1)).join(":") },
})
