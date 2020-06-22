Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb) {
        can._target.innerHTML = "", can.ui = can.page.Append(can, can._target, [
            {view: "content"}, {view: "display"},
        ])
        can.table = can.onappend.table(can, can.ui.content, "table", msg, function(value, key, index, line) {
            return {text: [value, "td"], oncontextmenu: function(event) {
                can.onappend.carte(can, can.ondetail, can.ondetail.list, function(ev, cmd, meta) {
                    var cb = meta[cmd]; cb && cb(event, can, cmd, value, key, index, line)
                })
            }, ondblclick: function(event) {
                can.page.Modify(can, event.target, {contenteditable: true})
            }}
        })

        can.core.List(msg.result, function(item) {
            var ls = item.split("/")
            var ls = ls[ls.length-1].split(".")
            var ext = ls[ls.length-1].toLowerCase()
            can.page.Append(can, can.ui.content, [can.onfigure[ext](can, item)])
        })
    },
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (!msg.append || msg.append.length == 0) {return}

        var list = msg.Table()
        function view(index, width, auto, cb) {var item = list[can.page.Select(can, table, "tr")[index+1].dataset.index];
            function menu(event) {var target = event.target;
                can.user.carte(event, shy("", can.ondetail, can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                    typeof cb == "function" && cb(event, can, item, index, "path", cmd, target);
                }))
            }

            var items = item.path.split(".");
            switch (items[items.length-1]) {
                case "png":
                case "jpg":
                case "JPG":
                    return {className: "preview", img: "/share/local/web.wiki.feel/"+item.path, width: width, oncontextmenu: menu}
                case "MOV":
                case "m4v":
                default:
                    return
            }
        }

        var table = can.page.AppendTable(can, output, msg, msg.append);

        var begin = 0, limit = 3;
        var rate = 1, width = 600;
        var control = can.page.Append(can, output, [{view: ["control"], list: [
            {select: [["width", 100, 200, 400, 600, 800], function(event, value) {width = parseInt(value), page(begin, limit)}]},
            {select: [["rate", 0.1, 0.2, 0.5, 1, 2, 3, 5, 10], function(event, value) {rate = value}]},
            {button: ["prev", function() {
                begin > 0 && (begin -= limit, page(begin, limit));
            }]},
            {text: [begin+"-"+(begin+limit)], name: "offset"},
            {button: ["next", function() {
                begin < msg[msg.append[0]].length && (begin += limit, page(begin, limit));
            }]},
            {text: [list.length]},
            {select: [["limit", 3, 6, 9, 12, 15], function(event, value) {limit = parseInt(value), page(begin, limit)}]},
        ]}])
        control.rate.value = rate
        control.width.value = width

        var preview = can.page.Append(can, output, [{view: ["preview"]}]).last
        function page(begin, limit) {
            control.offset.innerHTML = begin+"-"+(begin+limit);
            can.page.Appends(can, preview, msg.Table(function(item, index) {
                if (begin <= index && index < begin+limit) {return view(index, width, false, function(event) {var video = event.target;
                    switch (event.type) {
                        case "loadeddata": video.playbackRate = rate; break
                        case "timeupdate": video.playbackRate = rate; break
                    }
                })}
            }));
        }
        page(begin, limit);

        function show(index) {var item = list[can.page.Select(can, table, "tr")[index+1].dataset.index];
            var video = {};
            var timer = can.user.toast({text: "", list: [{view: "control", list: [
                {button: ["close", function(event) {video.pause(), timer.toast.Hide()}]},
                {select: [["width", 100, 200, 400, 600, 800], function(event, value) {timer.toast.Show(event, parseInt(value)+20), 
                        width = value
                    timer.toast.preview.setAttribute("width", value)
                        // video.width = value
                }]},
                {select: [["rate", 0.1, 0.2, 0.5, 1, 2, 3, 5, 10], function(event, value) {rate = video.playbackRate = value}]},
                {button: ["prev", function(event) {show(index-1)}]},
                {text: index+"/"+list.length},
                {button: ["next", function(event) {show(index+1)}]},
                {type: "br"}, {text: item.path},
                {type: "br"}, {text: item.label},
            ]}].concat([view(index, 600, true, function(event) {video = event.target;
                switch (event.type) {
                    case "loadeddata": video.playbackRate = rate; break
                    case "ended": show(index+1); break
                }
            })]), width: 600+20, height: 620, duration: -1})
            timer.toast.width.value = 600;
            timer.toast.rate.value = rate;
        }

        table.onclick = function(event) {switch (event.target.tagName) {
            case "TD":
                can.onimport.which(event, table, msg.append, function(index, key) {
                    var name = event.target.innerHTML.trim()
                    if (name.endsWith("/")) {
                        can.Option("name", name), can.run(event, [name])
                    } else {
                        show(index);
                    }
                })
                break
            case "TH":
                break
            case "TR":
            case "TABLE":
        }}
        table.oncontextmenu = function(event) {var target = event.target;
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.user.carte(event, shy("", can.ondetail, can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                            var id = msg.Ids(index);
                            var sub = can.Event(event);
                            msg.append.forEach(function(key) {sub.Option(key, msg[key][index].trim())})
                            typeof cb == "function"? cb(event, can, msg, index, key, cmd, target):
                                // can.run(event, [id, typeof cb == "string"? cb: cmd, key, target.innerHTML], function(msg) {
                                can.run(event, ["action", typeof cb == "string"? cb: cmd, key, target.innerHTML], function(msg) {
                                    can.onimport.init(can, msg, cb, output, option)
                                }, true)
                        }))
                    })
                    event.stopPropagation()
                    event.preventDefault()
                    break
                case "TH":
                case "TR":
                case "TABLE":
            }
        }
        return typeof cb == "function" && cb(msg), table;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
})

Volcanos("onfigure", {help: "组件菜单", list: [],
    image: function(can, path) {
        return {img: "/share/local/"+path}
    },
    jpg: function(can, path) { return can.onfigure.image(can, path) },
    qrc: function(can, path) { return can.onfigure.image(can, path) },

    video: function(can, path) {
        function cb(event) {
        }
        return {className: "preview", type: "video", width: width, oncontextmenu: menu,
            onplay: cb, onpause: cb,
            onloadedmetadata: cb,
            onloadeddata: cb,
            ontimeupdate: cb,
            onended: cb,
            data: {src: "/share/local/"+path, controls: "controls", autoplay: auto, loop: false,
        }}
    },
    m4v: function(can, path) { return can.onfigure.image(can, path) },
})

Volcanos("onaction", {help: "组件菜单", list: ["上传"],
    "上传": function(event, can) { can.onappend.upload(can) },
})
Volcanos("ondetail", {help: "组件详情", list: ["标签"],
    "标签": function(event, can, msg, index, key, cmd, target) {
        can.user.prompt("目标", function(kind) {
            can.run(event, ["action", "标签", msg.path, kind], function() {
            }, true)
        })
    },
})
Volcanos("onstatus", {help: "组件状态", list: ["begin", "width", "point", "which"],
    "begin": function(event, can, value, cmd, target) {target.innerHTML = value? value.x+","+value.y: ""},
    "width": function(event, can, value, cmd, target) {target.innerHTML = value? value.width+","+value.height: ""},
    "point": function(event, can, value, cmd, target) {target.innerHTML = value.x+","+value.y},
    "which": function(event, can, value, cmd, target) {var figure = can.onfigure[value.tagName];
        target.innerHTML = figure? figure.show(event, can, value, target): value.tagName;
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

