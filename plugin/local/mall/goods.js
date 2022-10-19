Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(item) {
			return {view: html.ITEM, list: [
				{view: wiki.IMAGE, list: [{img: can.misc.MergeCache(can, can.core.Split(item.image)[0]), width: 150}]},
				{view: wiki.CONTENT, list: [
					{view: [wiki.TITLE, html.DIV, item.name]},
					{view: [wiki.CONTENT, html.DIV, item.text]},
					{view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)]},
					{view: [mall.COUNT, html.DIV, "还剩 "+(item.count||0)]},
					{view: html.ACTION, inner: item.action},
				]},
			], onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT) && event.target.type == html.BUTTON) {
					can.run(can.request(event, item), [ctx.ACTION, event.target.name])
				} else {
					can.Option(mdb.HASH, item.hash), can.Update()
				}
			}}
		})), can.onimport.layout(can)
	},
	layout: function(can) { var width = can.onexport.width(can)
		can.page.Select(can, can._output, "div.item>div.content", function(target) { can.page.styleWidth(can, target, width-190) })
		can.isCmdMode() && can.page.styleHeight(can, can._output, can.ConfHeight())
	},
}, [""])
Volcanos(chat.ONEXPORT, {
	width: function(can) { if (can.ConfWidth() < 343) { return 343 } for (var i = 2; i < 10; i++) { if (can.ConfWidth() < 343*i) { return can.ConfWidth()/(i-1) } } },
})