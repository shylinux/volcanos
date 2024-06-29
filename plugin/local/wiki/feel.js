Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.onappend.style(can, wiki.FEEL)
		can.user.isMobile && (can.onaction.list = ["upload"])
		can.ui = can.onappend.layout(can), cb && cb(msg)
		if (can.Action("sort") != mdb.TIME) {
			can.onaction.sort({}, can, "sort", can.Action("sort"))
		} else {
			can.onimport._project(can, msg)
		}
		can.onimport.page(can, can.db.list, can.db.begin = 0)
		can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
	},
	_project: function(can, msg) { can.db.list = [], can.db.dir_root = msg.Option(nfs.DIR_ROOT)
		msg.Table(function(item) { item.name = can.base.trimPrefix(item.path, can.Option(nfs.PATH))
			can.base.endWith(item.path, "/") && (item.nick = [{img: can.misc.Resource(can, "usr/icons/dir.png")}, {text: [item.name, "", mdb.NAME]}])
			can.base.endWith(item.path, nfs.PS)? can.onimport.item(can, item, function(event) { can.Option(nfs.PATH, item.path) && can.Update(event) }): can.db.list.push(item)
		})
		can.core.List(can.db.list, function(item, index) { var last = can.onexport.progress(can, "p."+item.path)
			item.nick = [item.cover? {img: can.misc.Resource(can, item.cover)}:
				can.misc.isImage(can, item.path)? {img: can.misc.Resource(can, item.path)}:
				can.misc.isVideo(can, item.path)? {img: can.misc.Resource(can, "usr/icons/QuickTime Player.png")}:
				can.misc.isAudio(can, item.path)? {img: can.misc.Resource(can, "usr/icons/Music.png")}: null,
				{text: [item.name, "", mdb.NAME]}, last && {text: [last, "", "progress"]}, {text: [item.size, "", nfs.SIZE]},
			]
			item._hash = item.path, item._title = item.path.split("/").pop()
			item._target = can.onimport.item(can, item, function(event, item, show, target) { can.onimport._content(can, item, index, target) })
		})
	},
	_content: function(can, item, index, target) { can.Option(nfs.FILE, item.name), can.Status(item)
		if (can.onexport.progress(can, "p."+item.path) == "100%") { can.onexport.progress(can, "p."+item.path, ""), can.onexport.progress(can, item.path, "") }
		if (!can.onmotion.cache(can, function() { return item.path }, can.ui.content)) { var progress
			item._cb = function(event) { can.ui.video = event.target
				var p = parseInt(event.target.currentTime*100/event.target.duration)
				can.page.Select(can, target, "span.progress", function(target) { target.innerText = p+"%" })
				if (!progress) { progress = can.page.Append(can, can.ui.content, ["progress"])._target } can.page.style(can, progress, html.WIDTH, can.ui.content.offsetWidth*p/100)
			}
			var _target = can.onimport.file(can, item.path, item, index, can.ui.content, true); _target.focus()
			can.onappend._toggle(can, can.ui.content, function() {
				target.previousSibling? target.previousSibling.click(): can.user.toast(can, "已经是第一页了")
			}, function() {
				target.nextSibling? target.nextSibling.click(): can.user.toast(can, "已经是最后一页了")
			})
		}
		if (index < can.db.begin || index >= can.db.begin+can.db.limit) {
			can.onimport.page(can, can.db.list, can.db.begin = index-index%can.db.limit)
		} can.onmotion.select(can, can.ui.display, "*", item._display)
	},
	_file: function(can, path) {
		return (location.href.indexOf(ice.HTTP) == 0? location.origin: "http://localhost:9020")+can.misc.Resource(can, can.db.dir_root+path, can.ConfSpace())
	},
	file: function(can, path, item, index, target, auto) { item._path = path = can.onimport._file(can, path)
		var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]
		return cb && can.page.Append(can, target||can.ui.display, [cb(can, item, auto)])._target
	},
	page: function(can, list, begin) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.db.begin||0), can.db.limit = can.base.Min((parseInt(can.ui.display.offsetWidth/110)||5)-1, 3)
		for (var i = begin; i < begin+can.db.limit; i++) { if (list && list[i]) { list[i]._display = can.onimport.file(can, list[i].path, list[i], i) } }
		can.onappend._toggle(can, can.ui.display, function(event) { can.onaction.prev(event, can) }, function(event) { can.onaction.next(event, can) })
		can.Status({begin: begin, limit: can.db.limit, total: list.length})
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	png: function(can, item) { return can.onfigure.image(can, item) },
	jpg: function(can, item) { return can.onfigure.image(can, item) },
	jpeg: function(can, item) { return can.onfigure.image(can, item) },
	image: function(can, item) { return {img: item._path, onclick: function(event) { item._target.click() }} },
	video: function(can, item, auto) { var init, last = can.onexport.progress(can, item.path)||0
		return {type: html.VIDEO, data: {src: item._path, controls: auto, autoplay: auto},
			onclick: function(event) { item._target.click(), can.onkeymap.prevent(event) },
			onratechange: function(event) { can.onexport.storage(can, "rate", event.target.playbackRate) },
			onvolumechange: function(event) { can.onexport.storage(can, "volume", event.target.volume) },
			onloadedmetadata: function(event) {
				event.target.volume = can.onexport.storage(can, "volume")||0.5
				event.target.playbackRate = can.onexport.storage(can, "rate")||1
			},
			ontimeupdate: function(event) { if (event.target.currentTime == 0) { return } item._cb && item._cb(event)
				can.Status("position", can.onexport.position(can, event.target.currentTime-1, event.target.duration))
				can.onexport.progress(can, "p."+item.path, parseInt(event.target.currentTime*100/event.target.duration)+"%")
				can.onexport.progress(can, item.path, event.target.currentTime)
				if (!init) { init = true, event.target.currentTime = last }
			},
			onended: function(event) { var next = item._target.nextSibling
				next && can.onmotion.delay(can, function() { next.click() }, 300)
			},
		}
	},
	audio: function(can, item, auto) { var meta = can.onfigure.video(can, item, auto); meta.type = html.AUDIO
		return {view: html.AUDIO, list: [{img: can.misc.Resource(can, item.cover, can.ConfSpace()), className: "cover"}, {text: [item.name, "", mdb.NAME]}, meta], onclick: meta.onclick}
	},
	webm: function(can, item, auto) { return can.onfigure.video(can, item, auto) },
	mov: function(can, item, auto) { return can.onfigure.video(can, item, auto) },
	m4v: function(can, item, auto) { return can.onfigure.video(can, item, auto) },
	mp4: function(can, item, auto) { return can.onfigure.video(can, item, auto) },
	mp3: function(can, item, auto) { return can.onfigure.audio(can, item, auto) },
})
Volcanos(chat.ONACTION, {
	_trans: {
		"fullscreen": "全屏",
		icons: {
			"fullscreen": "bi bi-fullscreen",
		},
	},
	list: ["upload", "record1", "record2", "fullscreen", ["sort", "time", "path", "size"]],
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
			canvas.toBlob(function(blob) { cb([blob], nfs.PNG) })
		}
	}) },
	record2: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) {
		var recorder = new MediaRecorder(stream, {mimeType: 'video/webm'}), blobs = []; recorder.ondataavailable = function(res) { blobs.push(res.data) }
		recorder.onstop = function() { cb(blobs, nfs.WEBM) }, recorder.start(1)
	}) },
	fullscreen: function(event, can) {
		var show = can.onmotion.toggle(can, can.ui.project); can.onmotion.toggle(can, can.ui.display, show), can.onimport.layout(can)
		can.page.ClassList.set(can, can.ui.content, html.FLOAT, !show)
	},
	sort: function(event, can, button, value) {
		switch (value) {
			case mdb.TIME: can._msg.Sort(value, "str_r"); break
			case nfs.PATH: can._msg.Sort(value, "str"); break
			case nfs.SIZE: can._msg.Sort(value, "int_r"); break
		}
		can.onmotion.clear(can, can.ui.project), can.ui.filter = can.onappend.filter(can, can.ui.project), can.onimport._project(can, can._msg)
	},
	prev: function(event, can) { if (can.db.begin > 0) { can.db.begin -= can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是第一页了") } },
	next: function(event, can) { if (can.db.begin + can.db.limit < can.db.list.length) { can.db.begin += can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是最后一页了") } },
})
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, mdb.NAME, nfs.SIZE, mdb.TIME, "position"],
	progress: function(can, path, time) { return can.onexport.storage(can, path.split("?")[0], time) },
	position: function(can, index, total) { total = total || can.max; return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+nfs.PS+parseInt(total) },
})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			Escape: function(event, can) { can.onaction.fullscreen(event, can) },
			ArrowLeft: function(event, can) { can.ui.video.currentTime -= 15 },
			ArrowRight: function(event, can) { can.ui.video.currentTime += 15 },
			ArrowDown: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume -= 0.1)*100)) } catch (e) {} },
			ArrowUp: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume += 0.1)*100)) } catch (e) {} },
		},
	},
})
