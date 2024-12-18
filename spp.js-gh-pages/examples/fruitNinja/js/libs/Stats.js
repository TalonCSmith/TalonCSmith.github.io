// stats.js r5 - http://github.com/mrdoob/stats.js

var Stats = function() {
    function w(d, K, n) {
        var u, f, c;
        for (f = 0; f < 30; f++)
            for (u = 0; u < 73; u++) {
                c = (u + f * 74) * 4;
                d[c] = d[c + 4];
                d[c + 1] = d[c + 5];
                d[c + 2] = d[c + 6]
        }
        for (f = 0; f < 30; f++) {
            c = (73 + f * 74) * 4;
            if (f < K) {
                d[c] = b[n].bg.r;
                d[c + 1] = b[n].bg.g;
                d[c + 2] = b[n].bg.b
            } else {
                d[c] = b[n].fg.r;
                d[c + 1] = b[n].fg.g;
                d[c + 2] = b[n].fg.b
            }
        }
    }
    var v = 0,
        x = 2,
        e, y = 0,
        l = (new Date).getTime(),
        J = l,
        z = l,
        o = 0,
        A = 1E3,
        B = 0,
        m, g, a, p, C, q = 0,
        D = 1E3,
        E = 0,
        h, i, r, F, s = 0,
        G = 1E3,
        H = 0,
        j, k, t, I, b = {
            fps: {
                bg: {
                    r: 16,
                    g: 16,
                    b: 48
                },
                fg: {
                    r: 0,
                    g: 255,
                    b: 255
                }
            },
            ms: {
                bg: {
                    r: 16,
                    g: 48,
                    b: 16
                },
                fg: {
                    r: 0,
                    g: 255,
                    b: 0
                }
            },
            mem: {
                bg: {
                    r: 48,
                    g: 16,
                    b: 26
                },
                fg: {
                    r: 255,
                    g: 0,
                    b: 128
                }
            }
        };
    e = document.createElement("div");
    e.style.cursor = "pointer";
    e.style.width = "80px";
    e.style.opacity = "0";
    e.style.zIndex = "10001";    
    e.addEventListener("click", function() {
        v++;
        v == x && (v = 0);
        m.style.display = "none";
        h.style.display = "none";
        j.style.display = "none";
        switch (v) {
            case 0:
                m.style.display = "block";
                break;
            case 1:
                h.style.display = "block";
                break;
            case 2:
                j.style.display = "block"
        }
    }, false);
    
    
    m = document.createElement("div");
    m.style.backgroundColor = "rgb(" + Math.floor(b.fps.bg.r / 2) + "," + Math.floor(b.fps.bg.g /
        2) + "," + Math.floor(b.fps.bg.b / 2) + ")";
    m.style.padding = "2px 0px 3px 0px";
    e.appendChild(m);
    g = document.createElement("div");
    g.style.fontFamily = "Helvetica, Arial, sans-serif";
    g.style.textAlign = "left";
    g.style.fontSize = "9px";
    g.style.color = "rgb(" + b.fps.fg.r + "," + b.fps.fg.g + "," + b.fps.fg.b + ")";
    g.style.margin = "0px 0px 1px 3px";
    g.innerHTML = '<span style="font-weight:bold">FPS</span>';
    m.appendChild(g);
    a = document.createElement("canvas");
    a.width = 74;
    a.height = 30;
    a.style.display = "block";
    a.style.marginLeft = "3px";
    m.appendChild(a);
    p = a.getContext("2d");
    p.fillStyle = "rgb(" + b.fps.bg.r + "," + b.fps.bg.g + "," + b.fps.bg.b + ")";
    p.fillRect(0, 0, a.width, a.height);
    C = p.getImageData(0, 0, a.width, a.height);
    h = document.createElement("div");
    h.style.backgroundColor = "rgb(" + Math.floor(b.ms.bg.r / 2) + "," + Math.floor(b.ms.bg.g / 2) + "," + Math.floor(b.ms.bg.b / 2) + ")";
    h.style.padding = "2px 0px 3px 0px";
    h.style.display = "none";
    e.appendChild(h);
    i = document.createElement("div");
    i.style.fontFamily = "Helvetica, Arial, sans-serif";
    i.style.textAlign = "left";
    i.style.fontSize =
        "9px";
    i.style.color = "rgb(" + b.ms.fg.r + "," + b.ms.fg.g + "," + b.ms.fg.b + ")";
    i.style.margin = "0px 0px 1px 3px";
    i.innerHTML = '<span style="font-weight:bold">MS</span>';
    h.appendChild(i);
    a = document.createElement("canvas");
    a.width = 74;
    a.height = 30;
    a.style.display = "block";
    a.style.marginLeft = "3px";
    h.appendChild(a);
    r = a.getContext("2d");
    r.fillStyle = "rgb(" + b.ms.bg.r + "," + b.ms.bg.g + "," + b.ms.bg.b + ")";
    r.fillRect(0, 0, a.width, a.height);
    F = r.getImageData(0, 0, a.width, a.height);
    try {
        if (webkitPerformance && webkitPerformance.memory.totalJSHeapSize) x =
            3
    } catch (L) {}
    j = document.createElement("div");
    j.style.backgroundColor = "rgb(" + Math.floor(b.mem.bg.r / 2) + "," + Math.floor(b.mem.bg.g / 2) + "," + Math.floor(b.mem.bg.b / 2) + ")";
    j.style.padding = "2px 0px 3px 0px";
    j.style.display = "none";
    e.appendChild(j);
    k = document.createElement("div");
    k.style.fontFamily = "Helvetica, Arial, sans-serif";
    k.style.textAlign = "left";
    k.style.fontSize = "9px";
    k.style.color = "rgb(" + b.mem.fg.r + "," + b.mem.fg.g + "," + b.mem.fg.b + ")";
    k.style.margin = "0px 0px 1px 3px";
    k.innerHTML = '<span style="font-weight:bold">MEM</span>';
    j.appendChild(k);
    a = document.createElement("canvas");
    a.width = 74;
    a.height = 30;
    a.style.display = "block";
    a.style.marginLeft = "3px";
    j.appendChild(a);
    t = a.getContext("2d");
    t.fillStyle = "#301010";
    t.fillRect(0, 0, a.width, a.height);
    I = t.getImageData(0, 0, a.width, a.height);
    return {
        domElement: e,
        update: function() {
            y++;
            l = (new Date).getTime();
            q = l - J;
            D = Math.min(D, q);
            E = Math.max(E, q);
            w(F.data, Math.min(30, 30 - q / 200 * 30), "ms");
            i.innerHTML = '<span style="font-weight:bold">' + q + " MS</span> (" + D + "-" + E + ")";
            r.putImageData(F, 0, 0);
            J = l;
            if (l >
                z + 1E3) {
                o = Math.round(y * 1E3 / (l - z));
                A = Math.min(A, o);
                B = Math.max(B, o);
                w(C.data, Math.min(30, 30 - o / 100 * 30), "fps");
                g.innerHTML = '<span style="font-weight:bold">' + o + " FPS</span> (" + A + "-" + B + ")";
                p.putImageData(C, 0, 0);
                if (x == 3) {
                    s = webkitPerformance.memory.usedJSHeapSize * 9.54E-7;
                    G = Math.min(G, s);
                    H = Math.max(H, s);
                    w(I.data, Math.min(30, 30 - s / 2), "mem");
                    k.innerHTML = '<span style="font-weight:bold">' + Math.round(s) + " MEM</span> (" + Math.round(G) + "-" + Math.round(H) + ")";
                    t.putImageData(I, 0, 0)
                }
                z = l;
                y = 0
            }
        }
    }
};
