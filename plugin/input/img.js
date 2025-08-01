Volcanos(chat.ONFIGURE, {img: {
	_init: function(can, meta, target) { target.value == meta.value && (target.value = ""); var images = can.core.Split(target.value)
		var count = parseInt(meta.value||"9"), width = target.parentNode.offsetWidth; for (var n = 1; n < 10; n++) { if (n*n >= count) { width = (width/n); break } }
		width = can.base.Max(width, 120), can.onmotion.hidden(can, target), can.onappend.style(can, html.FLEX, target.parentNode)
		// function add(target, hash) { target._hash = hash, can.page.Appends(can, target, [{img: hash, height: width, width: width}, {icon: "bi bi-x-lg"}]) }
		// function add(target, hash) { target._hash = hash, can.page.Appends(can, target, [{img: hash, height: width, width: width}]) }
		function add(target, hash) { target._hash = hash, can.page.Appends(can, target, [{img: hash}]) }
		function set() { target.value = can.page.SelectChild(can, target.parentNode, html.DIV, function(target) { return target._hash }).join(mdb.FS) }
		function push(p) {
			if (can.page.SelectChild(can, target.parentNode, html.DIV, function(target) { return target._hash }).length >= count) { return }
			can.page.Append(can, target.parentNode, [{view: html.FLEX, style: {height: width, width: count == 1? target.parentNode.offsetWidth: width}, _init: function(target) {
				target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					can.user.upload(event, can, function(msg) {
						var link = can.misc.Resource(can, msg.Result(), msg.Option(ice.MSG_USERPOD))
						add(target, link), set(), p || push(), p = link
					}, true)
				})}, p? add(target, p): can.page.Append(can, target, [{icon: "bi bi-plus-square-dotted"}])
			} }])
		} can.core.List(images, function(p) { push(p) }), push()
	},
}})
