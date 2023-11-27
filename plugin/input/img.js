Volcanos(chat.ONFIGURE, {img: {
	_init: function(can, meta, target) { target.value == meta.value && (target.value = ""); var images = can.core.Split(target.value)
		var count = parseInt(meta.value||"1"), width = target.parentNode.offsetWidth; for (var n = 1; n < 10; n++) { if (n*n >= count) { width = (width/n-10); break } }
		function add(target, hash) { target._hash = hash, can.page.Appends(can, target, [{img: can.base.MergeURL(can.misc.MergeURL(can, {_path: web.SHARE_CACHE+hash}, true), {pod: meta.space||undefined}), height: width, width: width}]) }
		function set() { target.value = can.page.SelectChild(can, target.parentNode, html.DIV, function(target) { return target._hash }).join(mdb.FS) }
		can.onmotion.hidden(can, target)
		can.onappend.style(can, html.FLEX, target.parentNode)
		for (var i = 0; i < count; i++) {
			can.page.Append(can, target.parentNode, [{view: html.FLEX, style: {
				"clear": i%n == 0? "both": "none", height: width, width: width,
			}, _init: function(target) {
				if (images[i] && images[i].length > 10) { add(target, images[i]) } else { can.page.Append(can, target, [{text: "+"}]) }
				target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					can.user.upload(event, can, function(msg) { add(target, msg.Result()), set() }, true)
				})}
			} }])
		}
	},
}})
