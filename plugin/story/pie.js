Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
            can.onmotion.clear(can), can.onimport._show(can, msg)
            var r = 200, margin = 20; can.svg.Val(chat.WIDTH, 2*(r+margin)), can.svg.Val(chat.HEIGHT, 2*(r+margin))
            can.onimport._draw(can, msg, "value", r+margin, r+margin, r, margin, 0)
            can.onmotion.clear(can, can.ui.project), can.onappend.table(can, msg, null, can.ui.project)
            can.page.Modify(can, can.ui.project, {style: {"max-width": 480}})
            can.page.Select(can, can.ui.project, html.TR, function(tr, index) {
                can.page.Modify(can, tr, {onmouseenter: function(event) {
                    can.onmotion.clear(can, can.svg), can.onimport._draw(can, msg, "value", r+margin, r+margin, r, margin, index-1)
                }})
            })
        })
    },
    _draw: function(can, msg, field, x, y, r, margin, which) {
        function join(list) {
            for (var i = 0; i < list.length; i++) { list[i] = list[i].join(ice.SP) }
            return list.join(ice.FS)
        }
        function pos(x, y, r, angle) { angle -= 90
            return [x + r * Math.cos(angle * Math.PI / 180), y + r * Math.sin(angle * Math.PI / 180)]
        }
        function pie(x, y, r, begin, span, color, cb) { can.onimport.draw({}, can, {shape: "path", style: {
            "stroke-width": 1, stroke: color, fill: color, d: join([
                ["M", x, y], ["L"].concat(pos(x, y, r, begin)), ["A", r, r, "0 0 1"].concat(pos(x, y, r, begin+span)), ["Z"]
            ]),
        }, onmouseenter: function(event) { can.base.isFunc(cb) && cb(event)} }) }

        var total = 0; msg.Table(function(value) { total += parseInt(value[field]) })
        var color = [cli.RED, cli.YELLOW, cli.GREEN, cli.CYAN, cli.BLUE, cli.PURPLE, cli.WHITE, cli.BLACK]
        var begin = 0; msg["color"] = [], msg["weight"] = [], msg.Table(function(value, index) { var span = parseInt(value[field])/total*360
            var p = index==which? pos(x, y, margin, begin+span/2): [x, y]; index == which && can.Status(value)
            var c = color[index%color.length]; pie(p[0], p[1], r, begin, span, c, function(event) {
                can.onmotion.clear(can, can.svg), can.onimport._draw(can, msg, field, x, y, r, margin, index)
            }), begin += span, msg.Push("color", '<span style="background-color:'+c+'">     </span>')
            msg.Push("weight", parseInt(parseInt(value[field])*10000/total)/100+"%")
        })
    },
})

