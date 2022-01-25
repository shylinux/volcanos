Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
		can.onimport.select(can, msg)
		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
		can.onappend.table(can, msg), can.onappend.board(can, msg)
		can.core.Timer(12000, function() { can.onaction.play(event, can) })
		can.page.Select(can, can._output, "td a", function(a) {
			can.page.Modify(can, a, {target: ""})
		})
	},
	select: function(can, msg) {
		msg.Clear(), can.page.Select(can, document.body, can.Option("tags"), function(a, index) {
			msg.Push(mdb.INDEX, index)
			msg.Push(mdb.NAME, a.innerText)
			msg.Push(mdb.LINK, a.href)
			a.href == location.href && can.core.Timer(100, function() {
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
Volcanos("onaction", {help: "控件交互", list: [],
	next: function(event, can) { var msg = can._msg
		msg.Table(function(line, index) {
			if (line.link == location.href) {
				location.href = msg.link[index+1]
			}
		})
	},
	play: function(event, can) {
		can.page.SelectAll(can, document.body, html.VIDEO, function(video) {
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
Volcanos("onexport", {help: "导出数据", list: []})

