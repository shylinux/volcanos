Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb, target) {
		var width = can.onexport.width(can); can.user.isMobile && can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
		can.page.Appends(can, target, msg.Table(function(item) {
			return {view: html.ITEM, style: {width: width}, list: [
				{view: wiki.IMAGE, list: [{img: can.misc.MergeURL(can, {_path: "/share/cache/"+can.core.Split(item.image)[0]}), width: 150}]},
				{view: wiki.CONTENT, list: [
					{view: [wiki.TITLE, html.DIV, item.name], style: {width: width-190}},
					{view: [wiki.CONTENT, html.DIV, item.text]},
					{view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)]},
					{view: [mall.COUNT, html.DIV, "还剩 "+(item.count||0)]},
					{view: html.ACTION, inner: item.action, style: {width: width-190}},
				]},
			], onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT) && event.target.type == html.BUTTON) {
					can.run(can.request(event, item), [ctx.ACTION, event.target.name])
				} else {
					can.Option(mdb.HASH, item.hash), can.Update()
				}
			}}
		})), can.base.isFunc(cb) && cb(msg)
	},
	layout: function(can) { can.user.isMobile && can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
		var width = can.onexport.width(can); can.page.Select(can, can._output, html.DIV_ITEM, function(target) {
			can.page.style(can, target, html.WIDTH, width), can.page.Select(can, target, "div.title,div.action", function(target) {
				can.page.style(can, target, html.WIDTH, width-190)
			})
		})
	},
}, [""])
Volcanos(chat.ONEXPORT, {
	width: function(can) { if (can.ConfWidth() < 343) { return 343 } for (var i = 2; i < 10; i++) { if (can.ConfWidth() < 343*i) { return can.ConfWidth()/(i-1) } } },
})