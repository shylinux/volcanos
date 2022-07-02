Volcanos("heart", {help: "心形", list: [],
    data: {name: "path", size: {},
        copy: ["d", "name", "meta", "tt", "xx", "yy"],
        x: function(event, can, value, cmd, target) {
            var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
            if (value != undefined) {
                tt.tx = value-target.Val("xx")
                target.Value("tt", JSON.stringify(tt))
                target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
            }
            return target.Val("xx")+tt.tx
        },
        y: function(event, can, value, cmd, target) {
            var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
            if (value != undefined) {
                tt.ty = value-target.Val("yy")
                target.Value("tt", JSON.stringify(tt))
                target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
            }
            return target.Val("yy")+tt.ty
        },
    }, // <heart cx="25" cy="75" r="20"/>
    draw: function(event, can, point) { if (point.length < 2) {return}

        var p0 = point[0], p1 = point[1], p2 = point[2];
        pl = {x: 2*p0.x - p1.x, y:2*p0.y-p1.y}
        var r0 = Math.sqrt(Math.pow(p0.x - p1.x, 2), Math.pow(p0.y - p1.y, 2)) / 2
        var d = [
                "M", pl.x, pl.y,
                "A", r0, r0, 0, 0, 0, p0.x, p0.y,
                "A", r0, r0, 0, 0, 0, p1.x, p1.y,
            ]

        if (point.length == 3) {
            var r1 = Math.sqrt(Math.pow(p2.x - p1.x, 2), Math.pow(p2.y - p1.y, 2))
            d = d.concat([
                "A", r1, r1, 180, 0, 0, p2.x, p2.y,
                "A", r1, r1, 180, 0, 0, pl.x, pl.y,
            ])
        }

        var data = {
            name: "heart", d: d.join(" "),
            meta: JSON.stringify(point),
            tt: JSON.stringify({tx: 0, ty: 0}),
            xx: p0.x, yy:p1.y,
        }

        return event.type == "click" && point.length == 3 && (can.point = []), data
    },
    text: function(can, data, target) {
        data.x = target.Val("cx")
        data.y = target.Val("cy")
        return data
    },
    show: function(can, target) {
        return "heart " + target.Value("tt")
    },
})
