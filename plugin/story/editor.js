Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) {
		can.require(["/require/modules/tinymce/tinymce.min.js", "/plugin/local/code/vimer.js"], function(can) { can.onimport._last_init(can, msg, function(msg) {
			can.onappend.style(can, "tinymce"), cb && cb(msg)
		}) })
	},
	content: function(can, text) { return can.ui.editor.setContent(text) },
	layout: function(can) { can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth()) },
}, [""])
Volcanos(chat.ONSYNTAX, {
	_split: function(can, msg, target) {
		var _target = can.page.Appends(can, target, [{type: html.TEXTAREA}])._target
		tinymce.init({target: _target, height: can.ConfHeight(), // menubar: false,
			save_onsavecallback: function () { can.onaction.save({}, can, nfs.SAVE) },
			content_style: "body#tinymce { background:transparent; color:silver; }",
			toolbar: [[
				"save code undo redo cut copy paste",
				"backcolor forecolor bold italic underline strikethrough subscript superscript",
				"alignleft aligncenter alignright alignjustify outdent indent",
				"bullist numlist table image media link charmap",
				"blockquote removeformat hr pagebreak anchor insertdatetime",
				"fullscreen wordcount preview print help",
			].join("|")],
			plugins: [
				"save",
				"code",
				"lists",
				"advlist",
				"table",
				"image",
				"media",
				"link",
				"insertdatetime",
				"charmap",
				"anchor",
				"pagebreak",

				"fullscreen",
				"wordcount",
				"preview",
				"help",

				"autosave",
				"codesample",
				"directionality",
				"emoticons",
				"importcss",
				"font_size",
				"autolink",
				"nonbreaking",
				"searchreplace",
				"visualblocks",
				"visualchars",
			].join(" ")
		}).then(function(list) { can.ui.editor = list[0], can.ui.editor.setContent(msg.Result()) }).catch(function(err) { can.misc.Warn(err) })
	},
})
Volcanos(chat.ONEXPORT, {
	content: function(can) { return can.ui.editor.getContent() },
})
Volcanos(chat.ONPLUGIN, {
	tinymce: shy("富文本", {
		save: shy(function(can, msg) { can.user.toast(can, msg.Option(nfs.CONTENT)) }),
	}, [nfs.PATH, nfs.FILE, nfs.LINE, ice.LIST, nfs.SAVE], function(can, msg, meta) {
		msg.Display(meta._path)
	}),
})
