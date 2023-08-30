Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { var toast = can.user.toastProcess(can)
		can.page.requireModules(can, ["monaco-editor/min/vs/loader.js"], function() {
			require.config({paths: {vs: "/require/modules/monaco-editor/min/vs"}})
			require(["vs/editor/editor.main"], function () {
				can.require(["/plugin/local/code/vimer.js"], function(can) {
					can.onimport._last_init(can, msg, function(msg) {
						can.onappend.style(can, "monaco")
						cb && cb(msg), toast.close()
					})
				})
			})
		})
	},
	_theme: function(can) {
		if (can.base.isIn(can.getHeaderTheme(), html.LIGHT, html.WHITE)) {
			monaco.editor.setTheme("vs")
		} else {
			monaco.editor.setTheme("vs-dark")
		}
	},
}, [""])
Volcanos(chat.ONSYNTAX, {
	_split: function(can, msg, target) { can.onimport._theme(can)
		can.onengine.listen(can, chat.ONTHEMECHANGE, function() { can.onimport._theme(can) })
		can.ui.editor = monaco.editor.create(target, {value: msg.Result(), language: "javascript", automaticLayout: true})
	},
})
Volcanos(chat.ONPLUGIN, {
	monaco: shy("编辑器", {
		save: shy(function(can, msg) { can.user.toast(can, msg.Option(nfs.CONTENT)) }),
	}, [nfs.PATH, nfs.FILE, nfs.LINE, ice.LIST, nfs.SAVE], function(can, msg, meta) {
		msg.Display(meta._path)
	}),
})
