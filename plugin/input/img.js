Volcanos(chat.ONFIGURE, {img: {
	_init: function(can, meta, target) { var images = can.core.Split(target.value); can.onmotion.hidden(can, target)
		var count = parseInt(meta.value||"1"), width = target.parentNode.offsetWidth-12; for (var n = 1; n < 10; n++) { if (n*n >= count) { width = width/n; break } } width -= 1
		function add(target, hash) { target._hash = hash, can.page.Appends(can, target, [{img: can.misc.MergeURL(can, {_path: web.SHARE_CACHE+hash}, true), height: width, width: width}]) }
		function set() { target.value = can.page.SelectChild(can, target.parentNode, html.DIV, function(target) { return target._hash }).join(ice.FS) }
		for (var i = 0; i < count; i++) {
			can.page.Append(can, target.parentNode, [{type: html.DIV, style: {
				"background-color": "yellow", "float": "left", "clear": i%n == 0? "both": "none", "margin": 1, height: width, width: width,
			}, _init: function(target) { images[i] && add(target, images[i]), target.onclick = function(event) {
				can.user.upload(event, can, function(msg) { add(target, msg.Result()), set() }, true)
			} } }])
		}
	},
}})
