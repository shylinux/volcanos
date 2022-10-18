Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can)
		var width = can.onexport.width(can); can.user.isMobile && can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
		can.page.Appends(can, target, msg.Table(function(value) {
			return {view: html.ITEM+" "+(value.status||""), style: {width: width}, list: [
				{view: "image", list: [{img: can.misc.MergeURL(can, {_path: "/share/cache/"+can.core.Split(value.image)[0]}), width: 150}]}, {view: "content", list: [
					{view: [wiki.TITLE, html.DIV, value.name], style: {width: width-190}},
					{view: [wiki.CONTENT, html.DIV, value.text]},
					{view: ["price", html.DIV, "¥ "+value.price]},
					{view: ["count", html.DIV, "还剩 "+value.count]},
					{view: html.ACTION, inner: value.action, onclick: function(event) {
						can.run(can.request(event, value), [ctx.ACTION, event.target.name])
					}},
				]},
			], onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT)) { return }
				can.Option(mdb.HASH, value.hash), can.Update()
			}}
		})), can.base.isFunc(cb) && cb(msg)
		can.page.Select(can, target, "input[type=button]", function(target) {
			if (target.value == target.name) { target.value = can.user.trans(can, target.name) }
		})
	},
	layout: function(can) { can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
		var width = can.onexport.width(can); can.page.Select(can, can._output, "div.item", function(target) {
			can.page.style(can, target, html.WIDTH, width), can.page.Select(can, target, "div.title", function(target) {
				can.page.style(can, target, html.WIDTH, width-190)
			})
		})
	},
}, [""])
Volcanos(chat.ONEXPORT, {
	width: function(can) { if (can.ConfWidth() < 343) { return 343 } for (var i = 2; i < 10; i++) { if (can.ConfWidth() < 343*i) { return can.ConfWidth()/(i-1) } } },
})