Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) {
		can.ui = can.onappend.layout(can), can.onimport._project(can, msg)
		cb && cb(msg), can.onimport.page(can, can.db.list, can.db.begin = 0)
		can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
	},
	_project: function(can, msg) { can.db.list = [], can.db.dir_root = msg.Option(nfs.DIR_ROOT)
		msg.Table(function(item) { item.name = can.base.trimPrefix(item.path, can.Option(nfs.PATH))
			can.base.endWith(item.path, nfs.PS)? can.onimport.item(can, item, function(event) { can.Option(nfs.PATH, item.path) && can.Update(event) }): can.db.list.push(item)
		})
		can.core.List(can.db.list, function(item, index) { var last = can.onexport.progress(can, "p."+can.onimport._file(can, item.path))
			item.nick = [{text: [item.name, "", mdb.NAME]}, last && {text: [last, "", "progress"]}, {text: [item.size, "", nfs.SIZE]}]
			item._hash = item.path, item._title = item.path.split("/").pop()
			var target = can.onimport.item(can, item, function(event, item, show, target) { can.onimport._content(can, item, index, target) }); item._target = target
		})
	},
	_content: function(can, item, index, target) { var progress
		can.Option(nfs.FILE, can.base.trimPrefix(item.path, can.Option(nfs.PATH)))
		if (can.onexport.progress(can, "p."+item._path) == "100%") {
			can.onexport.progress(can, "p."+item._path, ""), can.onexport.progress(can, item._path, 0)
		}
		if (!can.onmotion.cache(can, function() { return item.path }, can.ui.content)) {
			item._cb = function(event) { can.ui.video = event.target, can.Status(item), can.onexport.storage(can, "last", item.path)
				var p = parseInt(event.target.currentTime*100/event.target.duration); item.nick[1] = {text: [p+"%", "", "progress"]}, can.page.Appends(can, target, item.nick)
				if (!progress) { progress = can.page.Append(can, can.ui.content, ["progress"])._target }
				can.page.style(can, progress, html.WIDTH, can.ui.content.offsetWidth*p/100)
			}
			var _target = can.onimport.file(can, item.path, item, index, can.ui.content, true); _target.focus()
			// _target.onclick = function() { can.page.tagis(_target, html.IMG) && can.ondetail._init(can, index) }
			can.onappend._toggle(can, can.ui.content, function() {
				index == 0? can.user.toast(can, "已经是第一页了"): target.previousSibling.click()
			}, function() {
				try { target.nextSibling.click() } catch (e) { can.user.toast(can, "已经是最后一页了") }
			})
		}
		can.Status(item)
		if (index < can.db.begin || index >= can.db.begin+can.db.limit) {
			can.onimport.page(can, can.db.list, can.db.begin = index-index%can.db.limit)
		} can.onmotion.select(can, can.ui.display, "*", item._display)
	},
	_file: function(can, path) {
		return (location.href.indexOf(ice.HTTP) == 0? location.origin: "http://localhost:9020")+can.misc.Resource(can, can.db.dir_root+path, can.ConfSpace())
	},
	file: function(can, path, item, index, target, auto) { item._path = path = can.onimport._file(can, path)
		var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]
		return cb && can.page.Append(can, target||can.ui.display, [cb(can, path, item, index, auto)])._target
	},
	page: function(can, list, begin) { can.onmotion.clear(can, can.ui.display)
		begin = parseInt(begin||can.db.begin||0), can.db.limit = (parseInt(can.ui.display.offsetWidth/110)||5)-1
		for (var i = begin; i < begin+can.db.limit; i++) {
			if (list && list[i]) {
				list[i]._display = can.onimport.file(can, list[i].path, list[i], i)
			}
		}
		can.onappend._toggle(can, can.ui.display, function(event) { can.onaction.prev(event, can) }, function(event) { can.onaction.next(event, can) })
		can.Status({begin: begin, limit: can.db.limit, total: list.length})
	},
}, [""])
Volcanos(chat.ONFIGURE, {
	png: function(can, path, item, index) { return can.onfigure.image(can, path, item, index) },
	jpg: function(can, path, item, index) { return can.onfigure.image(can, path, item, index) },
	jpeg: function(can, path, item, index) { return can.onfigure.image(can, path, item, index) },
	image: function(can, path, item, index) { return {img: path, onclick: function(event) { item._target.click() }} },
	audio: function(can, path, item, index, auto) {
		var meta = can.onfigure.video(can, path, item, index, auto); meta.type = html.AUDIO;
		return {view: html.AUDIO, list: [{text: item.name}, meta], onclick: meta.onclick}
	},
	video: function(can, path, item, index, auto) {
		var cb = item._cb||function cb(event) {}
		var init, last = can.onexport.progress(can, path)||0
		// preload: auto? "auto": "metadata",
		return {type: html.VIDEO, data: {src: path, controls: auto? "controls": "", autoplay: auto, playbackRate: 1},
			onclick: function(event) { item._target.click(), can.onkeymap.prevent(event) },
			onratechange: function(event) { can.onexport.storage(can, "rate", event.target.playbackRate) },
			onvolumechange: function(event) { can.onexport.storage(can, "volume", event.target.volume) },
			onloadedmetadata: function(event) {
				event.target.volume = can.onexport.storage(can, "volume")||1
				event.target.playbackRate = can.onexport.storage(can, "rate")||1
			},
			ontimeupdate: function(event) { if (event.target.currentTime == 0) { return } cb(event)
				can.Status("position", can.onexport.position(can, event.target.currentTime-1, event.target.duration))
				can.onexport.progress(can, "p."+path, parseInt(event.target.currentTime*100/event.target.duration)+"%")
				can.onexport.progress(can, path, event.target.currentTime)
				if (!init) { init = true, event.target.currentTime = last }
			},
			onended: function(event) { var next = item._target.nextSibling
				if (next) { can.onmotion.delay(can, function() { next.click() }, 3000), can.user.toast(can, "3s 后即将播放下一个", "", 3000) }
			},
		}
	},
	webm: function(can, path, item, index, auto) { return can.onfigure.video(can, path, item, index, auto) },
	mov: function(can, path, item, index, auto) { return can.onfigure.video(can, path, item, index, auto) },
	m4v: function(can, path, item, index, auto) { return can.onfigure.video(can, path, item, index, auto) },
	mp4: function(can, path, item, index, auto) { return can.onfigure.video(can, path, item, index, auto) },
	mp3: function(can, path, item, index, auto) { return can.onfigure.audio(can, path, item, index, auto) },
})
Volcanos(chat.ONACTION, {
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
	prev: function(event, can) { if (can.db.begin > 0) { can.db.begin -= can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是第一页了") } },
	next: function(event, can) { if (can.db.begin + can.db.limit < can.db.list.length) { can.db.begin += can.db.limit, can.onimport.page(can, can.db.list) } else { can.user.toast(can, "已经是最后一页了") } },
})
Volcanos(chat.ONDETAIL, {list: ["关闭", "上一个", "下一个", "设置头像", "设置背景", "复制链接", "下载", "删除"],
	_init: function(can, index) {
		can.onappend._init(can, {type: "story feel play float"}, [], function(sub) { can.sub = sub, sub._legend.innerHTML = can._legend.innerHTML, sub._legend.onclick = can._legend.onclick, can.onappend.style(can, html.FLEX, sub._output)
			can.getActionSize(function(msg, left, top, width, height) { sub.onappend._action(can, can.ondetail.list, sub._action, can.ondetail), sub.onappend._status(sub, ["begin", nfs.FILE])
				sub.page.style(sub, sub._target, {left: left||0, top: top||0}), sub.page.style(sub, sub._output, html.HEIGHT, height-2*html.ACTION_HEIGHT, html.WIDTH, width)
				can.order = index, can.show = function(order) { path = can.onimport._file(can, can.db.list[order].path); var cb = can.onfigure[can.base.Ext(path)]||can.onfigure[wiki.IMAGE]
					sub.page.Appends(sub, sub._output, [can.base.Copy(cb(can, path, index), {height: "", style: kit.Dict(html.MAX_WIDTH, width, html.MAX_HEIGHT, height-2*html.ACTION_HEIGHT)})])
					sub.Status(cli.BEGIN, order+1+nfs.PS+can.db.list.length), sub.Status(nfs.FILE, path)
				}, can.show(can.order)
			}), sub.run = function(can, cmds, cb) { can.run(can, cmds, cb, true) }
		}, can._root._target)
	},
	"关闭": function(event, can) { can.page.Remove(can, can.sub._target) },
	"上一个": function(event, can) { can.order > 0? can.show(--can.order): can.user.toast(can, "已经是第一张啦!") },
	"下一个": function(event, can) { can.order < can.db.list.length-1? can.show(++can.order): can.user.toast(can, "已经是最后一张啦!") },
	"设置头像": function(event, can) { can.setHeader(aaa.AVATAR, can.onimport._file(can, can.db.list[can.order].path)) },
	"设置背景": function(event, can) { can.setHeader(aaa.BACKGROUND, can.onimport._file(can, can.db.list[can.order].path)) },
	"复制链接": function(event, can) { can.onmotion.share(event, can, [], [web.LINK, can.user.copy(event, can, can.misc.MergeURL(can, {_path: can.onimport._file(can, can.db.list[can.order].path)}, true)) ]) },
	"下载": function(event, can) { can.user.download(can, path = can.onimport._file(can, can.db.list[can.order].path)) },
	"删除": function(event, can) { can.runAction(event, nfs.TRASH, [can.db.list[can.order].path], function(msg) { can.user.toastSuccess(can, "删除成功") }, true) },
})
Volcanos(chat.ONEXPORT, {list: [cli.BEGIN, mdb.LIMIT, mdb.TOTAL, mdb.NAME, nfs.SIZE, mdb.TIME, "position"],
	progress: function(can, path, time) { return can.onexport.storage(can, path.split("?")[0], time) },
	position: function(can, index, total) { total = total || can.max; return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+nfs.PS+parseInt(total) },
})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			Escape: function(event, can) { can.onaction.full(event, can) },
			ArrowLeft: function(event, can) { can.ui.video.currentTime -= 15 },
			ArrowRight: function(event, can) { can.ui.video.currentTime += 15 },
			ArrowDown: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume -= 0.1)*100)) } catch (e) {} },
			ArrowUp: function(event, can) { try { can.user.toast(can, "volume: "+parseInt((can.ui.video.volume += 0.1)*100)) } catch (e) {} },
		},
	},
})
