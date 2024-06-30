Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { can.onappend.style(can, wiki.FEEL)
		can.user.isMobile && (can.onaction.list = [web.UPLOAD])
		can.run({}, [], function(_msg) { can.db.albums = _msg
			can.ui = can.onappend.layout(can), cb && cb(msg)
			if (can.base.isIn(can.Action("sort")||"", mdb.TIME, "")) {
				can.onimport._project(can, msg)
			} else {
				can.onaction.sort({}, can, "sort", can.Action("sort"))
			} can.onimport.page(can, can.db.list, can.db.begin = 0)
			can.onmotion.toggle(can, can.ui.display, can.user.isMobile || can.page.isDisplay(can.ui.project)), can.onimport.layout(can)
		})
	},
	_project: function(can, msg) { can.db.list = [], can.db.dir_root = msg.Option(nfs.DIR_ROOT)
		can.ui.albums = can.page.Appends(can, can.ui.project, ["albums"])._target
		can.db.albums.Table(function(value) {
			can.page.Append(can, can.ui.albums, [{view: "item album "+(can.base.beginWith(can.Option(nfs.PATH), value.path)? "select": ""), background: value.cover, list: [
				{img: can.misc.Resource(can, value.cover||"usr/icons/background.jpg")}, {text: value.name},
			], onclick: function(event) {
				can.Option(nfs.PATH, value.path), can.Update()
			}, oncontextmenu: function(event) {
				can.user.carteItem(event, can, value)
			}}])
		})
		can.page.Append(can, can.ui.albums, [{view: ["item album create", "", "+"], onclick: function(event) {
			can.Update(event, [ctx.ACTION, mdb.CREATE])
		}}])
		can.ui.filter = can.onappend.filter(can, can.ui.project)
		// var action = can.page.Append(can, can.ui.project, ["action"])._target
		// can.onappend._action(can, can.onaction.list, action)
		msg.Table(function(item) { item.name = can.base.trimPrefix(item.path, can.Option(nfs.PATH))
			can.base.endWith(item.path, "/") && (item.nick = [{img: can.misc.Resource(can, "usr/icons/dir.png")}, {text: [item.name, "", mdb.NAME]}])
			can.base.endWith(item.path, nfs.PS)? can.onimport.item(can, item, function(event) { can.Option(nfs.PATH, item.path) && can.Update(event) }): can.db.list.push(item)
		})
		can.onmotion.cacheClear(can, "", can.ui.content)
		can.db.hash[0] && msg.path.indexOf(can.db.hash[0]) == -1 && (can.db.hash[0] = "")
		can.core.List(can.db.list, function(item, index) { var last = can.onexport.progress(can, "p."+item.path);
			(!can.db.hash[0] || can.db.hash[0] == can.Option(nfs.PATH) || can.db.hash[0].indexOf(can.Option(nfs.PATH)) == -1) && (can.db.hash[0] = item.path)
			item.nick = [item.cover? {img: can.misc.Resource(can, item.cover)}:
				can.misc.isImage(can, item.path)? {img: can.misc.Resource(can, item.path)}:
				can.misc.isVideo(can, item.path)? {img: can.misc.Resource(can, "usr/icons/QuickTime Player.png")}:
				can.misc.isAudio(can, item.path)? {img: can.misc.Resource(can, "usr/icons/Music.png")}: null,
				{text: [item.name, "", mdb.NAME]}, {text: [last||"", "", "progress"]},
				can.Option(nfs.PATH) != "usr/icons/" && can.base.isIn(can.Action("sort")||"", mdb.TIME, "")? {text: [can.base.TimeTrim(item.time), "", mdb.TIME]}: {text: [item.size, "", nfs.SIZE]},
			]
			item.title = [item.time, item.path, item.size].join("\n")
			item._hash = item.path, item._title = item.path.split("/").pop()
			item._target = can.onimport.item(can, item, function(event, item, show, target) { can.onimport._content(can, item, index, target) })
			item.title = ""
		})
	},
	_content: function(can, item, index, target) { can.Option(nfs.FILE, item.name), can.Status(item), can.ui.video = item._video, can.ui.current = item
		if (can.onexport.progress(can, "p."+item.path) == "100%") { can.onexport.progress(can, "p."+item.path, ""), can.onexport.progress(can, item.path, "") }
		if (can.misc.isImage(can, item.path)) { can.onmotion.delay(can, function() { can.onaction.playnext(can) }, 5000) }
		if (!can.onmotion.cache(can, function() { return item.path }, can.ui.content)) { var progress
			item._cb = function(event, video) { can.ui.video = item._video = video
				var p = parseInt(video.currentTime*100/video.duration)
				can.page.Select(can, target, "span.progress", function(target) { target.innerText = p+"%" })
				if (!progress) { progress = can.page.Append(can, can.ui.content, ["progress"])._target } can.page.style(can, progress, html.WIDTH, can.ui.content.offsetWidth*p/100)
			}
			var _target = can.onimport.file(can, item.path, item, index, can.ui.content, true); _target.focus()
			can.onappend._toggle(can, can.ui.content, function() { can.onaction.prev({}, can) }, function() { can.onaction.next({}, can) })
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
		can.onappend._toggle(can, can.ui.display, function(event) { can.onaction.prevpage(event, can) }, function(event) { can.onaction.nextpage(event, can) })
		can.Status({begin: begin, limit: can.db.limit, total: list.length})
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	png: function(can, item) { return can.onfigure.image(can, item) },
	jpg: function(can, item) { return can.onfigure.image(can, item) },
	jpeg: function(can, item) { return can.onfigure.image(can, item) },
	image: function(can, item) { return {img: item._path, title: item.title, onclick: function(event) { item._target.click() }} },
	video: function(can, item, auto) { var init, last = can.onexport.progress(can, item.path)||0
		var meta =  {type: html.VIDEO, title: item.title, data: {src: item._path, controls: auto, autoplay: auto},
			onclick: function(event) { item._target.click() },
			onratechange: function(event) { can.onexport.storage(can, "rate", event.target.playbackRate) },
			onvolumechange: function(event) { can.onexport.storage(can, "volume", event.target.volume) },
			onloadedmetadata: function(event) { item._cb && item._cb(event, event.target)
				event.target.volume = can.onexport.storage(can, "volume")||0.5
				event.target.playbackRate = can.onexport.storage(can, "rate")||1
			},
			ontimeupdate: function(event) { if (event.target.currentTime == 0) { return } item._cb && item._cb(event, event.target)
				can.Status("position", can.onexport.position(can, event.target.currentTime-1, event.target.duration))
				can.onexport.progress(can, "p."+item.path, parseInt(event.target.currentTime*100/event.target.duration)+"%")
				can.onexport.progress(can, item.path, event.target.currentTime)
				if (!init) { init = true, event.target.currentTime = last }
			},
			onended: function(event) { can.onaction.playnext(can) },
		}
		if (!auto && can.misc.isVideo(can, item.path) && !can.user.isChrome) {
			return {view: html.AUDIO, list: [{img: can.misc.Resource(can, item.cover||"usr/icons/QuickTime Player.png", can.ConfSpace()), className: "cover"}, {text: [item.name, "", mdb.NAME]}], onclick: meta.onclick}
		}
		return meta
	},
	audio: function(can, item, auto) { var meta = can.onfigure.video(can, item, auto); meta.type = html.AUDIO
		return {view: html.AUDIO, list: [{img: can.misc.Resource(can, item.cover||"usr/icons/Music.png", can.ConfSpace()), className: "cover"}, {text: [item.name, "", mdb.NAME]}, meta], onclick: meta.onclick}
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
	list: [
		// "fullscreen",
		"mkdir", "upload", "record1", "record2",
		["sort", mdb.TIME, nfs.PATH, nfs.SIZE],
		["order", "loop", "range", "random"],
	],
	record0: function(event, can, name, cb) { can.user.input(event, can, [{name: nfs.FILE, value: name}], function(list) {
		var height = window.innerHeight, width = window.innerWidth
		navigator.mediaDevices.getDisplayMedia({video: {height: height*8, width: width*8}}).then(function(stream) {
			can.core.Next([3, 2, 1], function(item, next) { can.user.toast(can, item + "s 后开始截图"), can.onmotion.delay(can, next, 1000) }, function() { can.onmotion.clearFloat(can)
				can.onmotion.delay(can, function() {
					cb(stream, function(blobs, ext) { var msg = can.request(event); msg._upload = new File(blobs, list[0]+nfs.PT+ext)
						can.runAction(msg, html.UPLOAD, [], function(msg) { can.user.toast(can, "上传成功")
							can.db.hash = can.onexport.hash(can, encodeURIComponent(msg.Result())), can.Update()
						}), can.core.List(stream.getTracks(), function(item) { item.stop() })
					})
				}, 300)
			})
		}).catch(function(err) { can.user.toast(can, err.name + ": " + err.message) })
	}) },
	record1: function(event, can) { can.onaction.record0(event, can, "Screenshot "+can.base.Time(null), function(stream, cb) { var height = window.innerHeight
		var video = can.page.Append(can, document.body, [{type: html.VIDEO, height: height}])._target; video.srcObject = stream, video.onloadedmetadata = function() {
			video.play(), height = video.offsetHeight, width = video.offsetWidth
			var canvas = can.page.Append(can, document.body, [{type: html.CANVAS, height: height, width: width}])._target; canvas.getContext("2d").drawImage(video, 0, 0, width, height)
			canvas.toBlob(function(blob) { cb([blob], nfs.PNG) })
		}
	}) },
	record2: function(event, can) { if (can.ui.recorder) { return can.ui.recorder.stop() }
		can.onaction.record0(event, can, "Screenshot "+can.base.Time(null), function(stream, cb) {
			if (can.user.isChrome) {
				var recorder = new MediaRecorder(stream, {mimeType: "video/webm;codecs=vp8"})
				recorder.onstop = function() { delete(can.ui.recorder), cb(blobs, "webm") }
				// var recorder = new MediaRecorder(stream, {mimeType: 'video/mp4; codecs="avc1.4d002a"'})
				// recorder.onstop = function() { delete(can.ui.recorder), cb(blobs, "mp4") }
			} else {
				var recorder = new MediaRecorder(stream, {mimeType: "video/mp4"})
				recorder.onstop = function() { delete(can.ui.recorder), cb(blobs, "mp4") }
			}
			var blobs = []; recorder.ondataavailable = function(res) { blobs.push(res.data) }
			can.ui.recorder = recorder, recorder.start(1)
		})
	},
	fullscreen: function(event, can, button) { var show = can.onmotion.toggle(can, can.ui.project)
		can.onmotion.toggle(can, can.ui.display, show), can.onmotion.toggle(can, can._status, show)
		can.page.ClassList.set(can, can._fields, button, !show), can.page.ClassList.set(can, can.ui.content, html.FLOAT, !show)
		can.sup.onimport.size(can.sup, can.sup.ConfHeight(), can.sup.ConfWidth())
	},
	sort: function(event, can, button, value) {
		switch (value) {
			case mdb.TIME: can._msg.Sort(value, "str_r"); break
			case nfs.PATH: can._msg.Sort(value, "str"); break
			case nfs.SIZE: can._msg.Sort(value, "int_r"); break
		} can.onimport._project(can, can._msg)
	},
	playnext: function(can) {
		if (can.Action("order") == "loop") {
			if (can.ui.video) { can.ui.video.currentTime = 0, can.ui.video.play() }
		}
		if (can.Action("order") == "range") { var next = can.ui.current._target.nextSibling
			next && can.onmotion.delay(can, function() { next.click() }, 300)
		}
		if (can.Action("order") == "random") {
			can.db.list[parseInt(Math.random()*can.db.list.length)]._target.click()
		}
	},
	prev: function(event, can) { var target = can.ui.current._target; target.previousSibling? target.previousSibling.click(): can.user.toast(can, "已经是第一页了") },
	next: function(event, can) { var target = can.ui.current._target; target.nextSibling? target.nextSibling.click(): can.user.toast(can, "已经是最后一页了") },
	prevpage: function(event, can) { if (can.db.begin > 0) { can.db.begin -= can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是第一页了") } },
	nextpage: function(event, can) { if (can.db.begin + can.db.limit < can.db.list.length) { can.db.begin += can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是最后一页了") } },
})
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, mdb.NAME, nfs.SIZE, mdb.TIME, "position"],
	progress: function(can, path, time) { return can.onexport.storage(can, path.split("?")[0], time) },
	position: function(can, index, total) { total = total || can.max; return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+nfs.PS+parseInt(total) },
})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			Escape: function(event, can) { can.onaction.fullscreen(event, can) },
			ArrowLeft: function(event, can) { if (can.ui.video) { can.ui.video.currentTime -= 15 } else { can.onaction.prev(event, can) } },
			ArrowRight: function(event, can) { if (can.ui.video) { can.ui.video.currentTime += 15 } else { can.onaction.next(event, can) } },
			ArrowDown: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume -= 0.1)*100)) } catch (e) {} },
			ArrowUp: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume += 0.1)*100)) } catch (e) {} },
			" ": function(event, can) { if (can.ui.video) { can.ui.video.paused? can.ui.video.play(): can.ui.video.pause() } },
		},
	},
})
