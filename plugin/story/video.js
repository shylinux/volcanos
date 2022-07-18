Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onimport.select(can, msg)
		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
		can.onappend.table(can, msg), can.onappend.board(can, msg)
		can.onmotion.delay(can, function() { can.onaction.play(event, can) })
		can.page.Select(can, can._output, "td a", function(a) {
			can.page.Modify(can, a, {target: ""})
		})
	},
	select: function(can, msg) {
		msg.Clear(), can.page.Select(can, can._root._target, can.Option("tags"), function(a, index) {
			msg.Push(mdb.INDEX, index)
			msg.Push(mdb.NAME, a.innerText)
			msg.Push(mdb.LINK, a.href)
			a.href == location.href && can.onmotion.delay(can, function() {
				can.page.Select(can, can._output, html.TR, function(tr, i) {
					i-1 == index && can.page.ClassList.add(can, tr, "select")
				})
			})
		})
		msg.Option(ice.MSG_STATUS, JSON.stringify([
			{name: "time", value: can.base.Time(null, "%y-%m-%d %H:%M:%S")},
			{name: "count", value: msg.Length()},
		]))
	},
})
Volcanos(chat.ONACTION, {help: "控件交互",
	next: function(event, can) { var msg = can._msg
		msg.Table(function(line, index) {
			if (line.link == location.href) {
				location.href = msg.link[index+1]
			}
		})
	},
	play: function(event, can) {
		can.page.SelectAll(can, can._root._target, html.VIDEO, function(video) {
			video.playbackRate = parseFloat(can.Option("rate"))
			video.currentTime = parseInt(can.Option("skip"))
			video.ontimeupdate = function(event) {
				if (video.currentTime > parseInt(can.Option("next"))) {
					can.onaction.next(event, can)
				}
			}, video.play(), video.requestFullscreen()
		})
	},
})
