Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) { can.onmotion.clear(can)
		can.page.Appends(can, target, msg.Table(function(value) {
			return {view: html.ITEM+" "+(value.status||""), list: [
				{view: "image", list: [{img: can.misc.MergeURL(can, {_path: "/share/cache/"+can.core.Split(value.image)[0]}), width: 150}]}, {view: "content", list: [
					{view: [wiki.TITLE, html.DIV, value.name]},
					{view: [wiki.CONTENT, html.DIV, value.text]},
					{view: ["price", html.DIV, "¥"+value.price]},
					{view: html.ACTION, inner: value.action, onclick: function(event) {
						can.run(can.request(event, value), [ctx.ACTION, event.target.name])
					}},
				]},
			], onclick: function(event) {
				if (can.page.tagis(event.target, html.INPUT)) { return }
				can.Option(mdb.HASH, value.hash), can.Update()
			}}
		}))
		can.page.Select(can, target, "input[type=button]", function(target) {
			if (target.value == target.name) { target.value = can.user.trans(can, target.name) }
		})
		can.base.isFunc(cb) && cb(msg)
		can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
},
	onlayout: function(can) {
		can.page.style(can, can._output, html.HEIGHT, can.ConfHeight())
	},
}, [""])