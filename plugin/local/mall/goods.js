Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(item) {
			return {view: html.ITEM, list: [
				{view: wiki.IMAGE, list: [{img: can.misc.MergeCache(can, can.core.Split(item.image)[0]), width: 150, height: 150}]},
				{view: wiki.CONTENT, list: [
					{view: [html.TITLE, html.DIV, item.name]},
					{view: [html.CONTENT, html.DIV, item.text]},
					{view: html.DISPLAY, list: [
						{view: [mall.PRICE, html.DIV, "¥ "+(item.price||0)], style: {"float": "left"}},
						{view: [mall.COUNT, html.DIV, " 还剩 "+(item.count||0)+" 件"], style: {"float": "left"}},
					]},
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
Volcanos(chat.ONACTION, {list: ["music"],
	"play": function(event, can, button) {
		can._audio = can._audio||can.page.Append(can, can._output, [{type:"audio", src: "https://m701.music.126.net/20221029062844/f7593e1bb844dc4e35003543494314a2/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/9879113394/5ffc/73bd/1a47/b11e9469bf4f6744db6e88c527a678df.m4a", _init: function(target) {
		}}])._target
		can._audio.play()
	},
	"stop": function(event, can, button) {
	},
	"music": function(event, can, button) {
	},
})
Volcanos(chat.ONEXPORT, {
	width: function(can) { if (can.ConfWidth() < 343) { return 343 } for (var i = 2; i < 10; i++) { if (can.ConfWidth() < 343*i) { return can.ConfWidth()/(i-1) } } },
})
