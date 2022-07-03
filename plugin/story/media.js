Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
	can.base.isFunc(cb) && cb(msg)
}})
Volcanos(chat.ONACTION, {help: "操作数据", list: ["打开屏幕", "打开摄像", "打开录音"],
	_action: function(can, cb) {
		var ui = can.page.Append(can, can._output, [{view: html.ACTION}, {view: html.OUTPUT, list: [{type: html.VIDEO, style: {width: can.ConfWidth()}, _init: function(item) {
			can.core.Timer(10, function() { cb(item, ui) })
		}}]}])

		can.onappend._action(can, [], ui.action, {
			"关闭": function(event) {
				can.core.List(ui.stream.getTracks(), function(track) { track.stop() })
				can.page.Remove(can, ui.action), can.page.Remove(can, ui.output)
			},
			"抓拍": function(event) {
				var canvas = can.page.Append(can, ui.output, [{type: html.CANVAS}]).first; canvas.getContext("2d").drawImage(ui.video, 0, 0)
				can.page.Append(can, ui.output, [{img: canvas.toDataURL('image/png'), style: {width: can.ConfWidth()}}])
				can.page.Remove(can, canvas)
			},
			"录制": function(event) { ui.blobs = []
				ui.mediaRecorder = new MediaRecorder(ui.stream, {mimeType: 'video/webm'})
				ui.mediaRecorder.ondataavailable = (e) => { ui.blobs.push(e.data), can.misc.Log(ui.blobs.length) }
				ui.mediaRecorder.start(100)
			},
			"回放": function(event) { var blobs = ui.blobs; ui.blobs = []
				var video = can.page.Append(can, ui.output, [{type: html.VIDEO, style: {width: can.ConfWidth()}}]).video
				video.src = URL.createObjectURL(new Blob(blobs, {type : 'video/webm'})), video.play()
			},
			"下载": function(event) {
				can.user.download(can, URL.createObjectURL(new Blob(ui.blobs, {type: 'video/webm'})), 'record.webm')
			},
		})
	},
	"打开屏幕": function(event, can) {
		can.onaction._action(can, function(item, ui) {
			navigator.mediaDevices.getDisplayMedia({video: {width: can.ConfWidth()}}).then(function(stream) { ui.stream = stream
				item.srcObject = stream, item.onloadedmetadata = function(e) { item.play() }
			}).catch(function(err) { can.misc.Log(err.name + ": " + err.message) })
		})
	},
	"打开摄像": function(event, can) {
		can.onaction._action(can, function(item, ui) {
			navigator.mediaDevices.getUserMedia({video: {width: can.ConfWidth()}}).then(function(stream) { ui.stream = stream
				item.srcObject = stream, item.onloadedmetadata = function(e) { item.play() }
			}).catch(function(err) { can.misc.Log(err.name + ": " + err.message) })
		})
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: []})
