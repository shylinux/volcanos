Volcanos(chat.ONFIGURE, {help: "控件详情", img: {
	_init: function(can, target) { can.onmotion.hidden(can, target)
		for (var i = 0; i < 1; i++) {
		can.page.Append(can, target.parentNode, [{type: html.DIV, style: {width: 90, height: 90, "background-color": "yellow"}, onclick: function(event) {
			can.user.upload(event, can, function(msg) {
				target.value = can.core.Split(target.value).concat([msg.Result()]).join(ice.FS)
				can.page.Append(can, event.target, [{img: can.misc.MergeURL(can, {_path: "/share/cache/"+msg.Result()}, true), width: 90, height: 90}])
			})
		}}])
		}
	},
}})
