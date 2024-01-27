Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { if (msg.IsDetail()) { return msg.Dump(can) }
		var list = {}; can.ui = can.onappend.layout(can), can.onmotion.clear(can, can.ui.project)
		can.page.Appends(can, can.ui.content, msg.Table(function(item, index) { var style = {}
			if (!list[item.zone]) { if (can.user.isMobile && index > 0) { style["margin-top"] = "40px" }
				list[item.zone] = item, item._zone = can.onimport.item(can, {name: item.zone}, function() {
					can.onmotion.scrollIntoView(can, item._target, 10)
				})
			}
			return {view: [[html.ITEM, html.FLEX]], style: style, list: [
				{view: wiki.IMAGE, list: [{img: can.misc.MergeCache(can, can.core.Split(item.image)[0], item.space)}]},
				{view: wiki.CONTENT, list: [
					{view: [html.TITLE, html.DIV, item.name]},
					{view: [html.CONTENT, html.DIV, item.text]},
					{view: html.DISPLAY, list: [
						item.area? {view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)+" 万"]}: {view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)]},
						item.area? {view: [mall.COUNT, html.DIV, "面积 "+(item.area||0)+" 平"]}: {view: [mall.COUNT, html.DIV, "剩 "+(item.count||0)+" "+item.units]},
					]},
					{view: html.ACTION, inner: item.action},
				]},
			], _init: function(target) { item._target = target }, onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT) && event.target.type == html.BUTTON) {
					can.run(can.request(event, item), [ctx.ACTION, event.target.name])
				}
			}}
		})), can.onmotion.select(can, can.ui.project, html.DIV_ITEM, 0)
		can.ui.content.onscroll = function(event) { can.core.Item(list, function(zone, item) {
			if (item._target.offsetTop > can.ui.content.scrollTop && item._target.offsetTop < can.ui.content.scrollTop+can.ui.content.offsetHeight/4) {
				can.onmotion.select(can, can.ui.project, html.DIV_ITEM, item._zone)
			}
		}) }
	},
	layout: function(can) { if (!can.ui.content) { return }
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth)
		can.onlayout.expand(can, can.ui.content)
	},
}, [""])
