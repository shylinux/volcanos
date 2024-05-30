Volcanos(chat.ONFIGURE, {
    path2v: { // <path d="M x0,y0 Q x2,y2 x3,y3 T x1,y1"/>
        data: {name: "path", size: {}, copy: []},
        draw: function(event, can, point) {
            function line(p0, p1) { return can.base.joins([
                svg.M, [p0.x, p0.y], svg.Q, [p0.x, p0.y+(p1.y-p0.y)/3], [(p0.x+p1.x)/2, (p0.y+p1.y)/2], svg.T, [p1.x, p1.y]
            ]) }
            return {fill: html.NONE, d: line(point[0], point[1])}
        },
    },
    path2h: { // <path d="M x0,y0 Q x2,y2 x3,y3 T x1,y1"/>
        data: {name: "path", size: {}, copy: []},
        draw: function(event, can, point) {
            function line(p0, p1) { return can.base.joins([
                svg.M, [p0.x, p0.y], svg.Q, [p0.x+(p1.x-p0.x)/3, p0.y], [(p0.x+p1.x)/2, (p0.y+p1.y)/2], svg.T, [p1.x, p1.y]
            ]) }
            return {fill: html.NONE, d: line(point[0], point[1])}
        },
    },
    path: { // <path d="M10 10 H 90 V 90 H 10 Z"/>
        data: {size: {}, copy: ["d", "tt", "xx", "yy"],
            x: function(can, value, cmd, target) {
                var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
                if (value != undefined) {
                    tt.tx = value-target.Val("xx")
                    target.Value("tt", JSON.stringify(tt))
                    target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
                }
                return target.Val("xx")+tt.tx
            },
            y: function(can, value, cmd, target) {
                var tt = JSON.parse(target.Value("tt")||'{"tx":0, "ty":0}')
                if (value != undefined) {
                    tt.ty = value-target.Val("yy")
                    target.Value("tt", JSON.stringify(tt))
                    target.Value("transform", "translate("+tt.tx+","+tt.ty+")")
                }
                return target.Val("yy")+tt.ty
            },
        },
        draw: function(event, can, point, style) {
            if (style && style.d) { return style }
            if (point.length == 1) { can._temp = {} }
            if (point.length < 2) { return }

            if (can.keys && can.keys.length > 0) { var k;
                k = can._temp[point.length-1] = can.keys[0]
                switch (k.toUpperCase()) {
                    case "C": can._temp[point.length+1] = ","
                    case "Q": can._temp[point.length] = ","; break
                    default:
                }
                can.keys = can.keys.slice(1)
            }

            var skip = 0
            var end = false
            var data = {
                d: can.core.List(point, function(p, i) { var k = p.k
                    if (i < skip) {return}
                    switch (i) {
                        case 0: k = "M"; break
                        default: k = p.k || "L"; break
//                        default: k = can._temp[i] || p.k || "L"; break
                    }
                    if (end) {return}

                    k = k.toUpperCase()
                    switch (k) {
                        case "Z": return can.point = [], can._temp = {}, k
                        case "L": return k+" " + p.x + " " + p.y
                        case "M": return k+" " + p.x + " " + p.y
                        case "H": return k+" " + p.x
                        case "V": return k+" " + p.y
                        case "A":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + " 0 0 0 " + p.x + " " + p.y
                                case 2: end = true
                                    var r = Math.sqrt(Math.pow(point[i+1].x - p.x, 2) + Math.pow(point[i+1].y - p.y, 2))
                                    return k+" " + r + " " + r + " 0 0 0 " + p.x + " " + p.y
                                case 3:
                                    if (!p.done) {
                                        var r = Math.sqrt(Math.pow(point[i+1].x - p.x, 2) + Math.pow(point[i+1].y - p.y, 2))
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp
                                        var temp = can.point[i]
                                        p = can.point[i] = can.point[i+1]
                                        can.point[i+1] = temp
                                        p.x = r
                                        p.y = r
                                        p.done = true
                                        p.arg = " 0 0 0 "
                                    }
                                default:
                                    skip = i + 2
                                    return k+" " + p.x + " " + p.y + " 0 0 0 " + point[i+1].x + " " + point[i+1].y
                            }
                            break
                        case "C":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 3:
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + point[i+2].x + " " + point[i+2].y + "," + p.x + " " + p.y
                                case 4:
                                    if (!p.done) {
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp

                                        var temp = point[i+1]
                                        point[i+1] = point[i+2]
                                        point[i+2] = temp
                                        p.done = true
                                    }
                                default:
                                    return k+" " + p.x + " " + p.y
                            }
                        case "Q":
                            switch (point.length - i) {
                                case 1: end = true
                                    return k+" " + (point[i-1].x+p.x)/2 + " " + (point[i-1].y+p.y)/2 + "," + p.x + " " + p.y
                                case 2: end = true
                                    return k+" " + point[i+1].x + " " + point[i+1].y + "," + p.x + " " + p.y
                                case 3:
                                    if (!p.done) {
                                        var temp = point[i]
                                        p = point[i] = point[i+1]
                                        point[i+1] = temp
                                        p.done = true
                                    }
                                default:
                                    return k+" " + p.x + " " + p.y
                            }
                        default: return k+" " + p.x + " " + p.y
                    }
                }).join(" ")
            }
            return data
        },
        text: function(can, target, data) {
            data.x = (target.x1.baseVal.value + target.x2.baseVal.value) / 2
            data.y = (target.y1.baseVal.value + target.y2.baseVal.value) / 2
            return data
        },
        show: function(can, target) { return target.tagName + " " + target.Value("d") },
    },
})
