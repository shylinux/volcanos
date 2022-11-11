Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can, target), can.base.isFunc(cb) && cb(msg)
		can.requireModules(["gifshot/dist/gifshot.js"], function() {

		})
		var height = can.ConfHeight()
		can.ui = can.page.Append(can, can._output, [{view: html.OUTPUT}, {view: html.DISPLAY, style: {height: height/4}}])
		msg.Table(function(value) {
			can.onimport._video(can, "/chat/media/"+value.path)
		})
	},

	_action: function(can, list) {
		can.onappend._action(can, list||can.onaction.list, can._action, can.onaction)
	},
	_layout: function(can, cb) { var height = can.ConfHeight()
		can.ui.video = can.page.Appends(can, can.ui.output, [{type: html.VIDEO, data: {controls: "controls"}, style: {height: height*3/4}, _init: function(target) {
			can.onmotion.delay(can, function() { cb(target) })
		}}])._target, can.onimport._action(can, ["抓拍", "录制", "取消"])
	},
	_image: function(can, src) {
		can.page.insertBefore(can, [{img: src, style: {height: can.ConfHeight()/4}}], can.ui.display.firstChild, can.ui.display)
		return src
	},
	_video: function(can, src) {
		can.page.insertBefore(can, [{type: html.VIDEO, src: src, data: {controls: "controls"}, style: {height: can.ConfHeight()/4}}], can.ui.display.firstChild, can.ui.display)
		return src
	},
})
Volcanos(chat.ONACTION, {help: "操作数据", list: ["录屏", "摄像"],
	"录屏": function(event, can) {
		can.onimport._layout(can, function(target) {
			navigator.mediaDevices.getDisplayMedia({video: {height: can.ConfHeight()*3/4}}).then(function(stream) { can.stream = stream
				target.srcObject = stream, target.onloadedmetadata = function(e) { target.play() }
			}).catch(function(err) { can.misc.Log(err.name + ": " + err.message) })
		})
	},
	"摄像": function(event, can) {
		can.onimport._layout(can, function(target) {
			navigator.mediaDevices.getUserMedia({video: {height: can.ConfHeight()*3/4}}).then(function(stream) { can.stream = stream
				target.srcObject = stream, target.onloadedmetadata = function(e) { target.play() }
			}).catch(function(err) { can.misc.Log(err.name + ": " + err.message) })
		})
	},
	"抓拍": function(event, can) { var width = can.ui.video.offsetWidth, height = can.ui.video.offsetHeight
		var canvas = can.page.Append(can, can.ui.display, [{type: html.CANVAS, height: height, width: width}])._target
		canvas.getContext("2d").drawImage(can.ui.video, 0, 0, width, height, 0, 0, width, height)
		can.onimport._image(can, canvas.toDataURL('image/png')), can.page.Remove(can, canvas)
	},
	"录制": function(event, can) { can.ui.blobs = []
		var recorder = new MediaRecorder(can.stream, {mimeType: 'video/webm'})
		recorder.ondataavailable = function(res) { can.ui.blobs.push(res.data), can.Status("total", can.ui.blobs.length) }
		recorder.onstop = function() {
			can.onimport._layout(can, function(target) {
				target.src = can.onimport._video(can, URL.createObjectURL(new Blob(can.ui.blobs, {type: 'video/webm'})))
			}), can.onimport._action(can, ["上传", "取消"])
		}
		recorder.start(10), can.ui.recorder = recorder
		can.onimport._action(can, ["结束"])
	},
	"结束": function(event, can) {
		can.core.List(can.stream.getTracks(), function(track) { track.stop() })
	},
	"上传": function(event, can) { var msg = can.request(event)
		can.user.input(event, can, [{type: "text", name: "file", value: "some"}], function(list) {
			msg._upload = new File(can.ui.blobs, (list[0]||"some")+".webm") 
			can.runAction(event, html.UPLOAD)
		})
	},
	"取消": function(event, can) {
		can.onmotion.clear(can, can.ui.output), can.onimport._action(can)
	},
})
Volcanos(chat.ONDETAIL, {help: "操作数据", list: ["关闭", "抓拍", "录制"],
	"成图": function(event, can) {
		gifshot.createGIF({
			'video': [URL.createObjectURL(new Blob(can.ui.blobs, {type : 'video/webm'}))],
		},function(obj) {
			if(!obj.error) {
				can.user.download(can, obj.image, "some", "gif")
			}
		});
	},
	"回放": function(event, can) {
		var video = can.page.Append(can, can.ui.output, [{type: html.VIDEO, style: {width: can.ConfWidth()}}]).video
		video.src = URL.createObjectURL(new Blob(can.ui.blobs, {type : 'video/webm'})), video.play()
	},
	"下载": function(event, can) {
		can.user.download(can, URL.createObjectURL(new Blob(can.ui.blobs, {type: "video/webm"})), "record.webm")
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["total"]})
