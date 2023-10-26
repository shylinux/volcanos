Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { if (msg.IsDetail()) { return msg.Dump(can) }
		var list = {}; can.ui = can.onappend.layout(can), can.onmotion.clear(can, can.ui.project)
		can.page.Appends(can, can.ui.content, msg.Table(function(item) {
			if (!list[item.zone]) { list[item.zone] = item, can.onimport.item(can, {name: item.zone}, function() {}) }
			return {view: html.ITEM, list: [
				{view: wiki.IMAGE, list: [{img: can.misc.MergeCache(can, can.core.Split(item.image)[0])}]},
				{view: wiki.CONTENT, list: [
					{view: [html.TITLE, html.DIV, item.name]},
					{view: [html.CONTENT, html.DIV, item.text]},
					{view: html.DISPLAY, list: [
						{view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)]},
						{view: [mall.COUNT, html.DIV, "剩 "+(item.count||0)+" "+item.type]},
					]},
					{view: html.ACTION, inner: item.action},
				]},
			], onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT) && event.target.type == html.BUTTON) {
					can.run(can.request(event, item), [ctx.ACTION, event.target.name])
				}
			}}
		}))
	},
	layout: function(can) {
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight())
		can.ui.content && can.onlayout.expand(can, can.ui.content, 260)
	},
}, [""])
