"use strict";

function _defineProperty(t, e, r) {
    return e in t ? Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = r, t;
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

function tier_classifier(t) {
    return t < .47 ? 4 : t < .5 ? 3 : t < .52 ? 2 : 1;
}

function testFunction(t) {
    console.log(t);
}

function choice(t) {
    return t[Math.floor(Math.random() * t.length)];
}

function randint(t, e) {
    return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t;
}

function range(t, e) {
    for (var r = [], a = t; a < e; a++) r.push(a);
    return r;
}

function fillRange(t, e, r) {
    for (var a = [], i = t; i < e; i++) a.push(r);
    return a;
}

function rangeFill(t, e) {
    for (var r = [], a = 0; a < t; a++) r.push(e);
    return r;
}

function shuffle(t) {
    for (var e, r, a = t.length; 0 !== a; ) r = Math.floor(Math.random() * a), e = t[a -= 1], 
    t[a] = t[r], t[r] = e;
    return t;
}

function normalize(t) {
    var e = 0, r = !0, a = !1, i = void 0;
    try {
        for (var n, s = t[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
            var o = n.value;
            e += Math.abs(o);
        }
    } catch (t) {
        a = !0, i = t;
    } finally {
        try {
            !r && s.return && s.return();
        } finally {
            if (a) throw i;
        }
    }
    if (1 == e || 0 == e) return t;
    for (var l = 0; l < t.length; l++) t[l] /= e;
    return t;
}

function matrixXvector(t, e) {
    var r = [], a = normalize(e);
    console.log("matrix,vector", t, e, a);
    for (var i = 0; i < e.length; i++) {
        for (var n = 0, s = 0; s < e.length; s++) n += a[s] * t[i][s];
        r.push(n);
    }
    return r;
}

function matrixXmatrix(t, e) {
    for (var r = t.length, a = t[0].length, i = (e.length, e[0].length), n = new Array(r), s = 0; s < r; ++s) {
        n[s] = new Array(i);
        for (var o = 0; o < i; ++o) for (var l = n[s][o] = 0; l < a; ++l) n[s][o] += t[s][l] * e[l][o];
    }
    return n;
}

function detectswipe(e, r) {
    var a = {
        sX: 0,
        sY: 0,
        eX: 0,
        eY: 0
    }, i = "", t = document.querySelector(e);
    t.addEventListener("touchstart", function(t) {
        var e = t.touches[0];
        a.sX = e.screenX, a.sY = e.screenY;
    }, !1), t.addEventListener("touchmove", function(t) {
        t.preventDefault();
        var e = t.touches[0];
        a.eX = e.screenX, a.eY = e.screenY;
    }, !1), t.addEventListener("touchend", function(t) {
        (a.eX - 30 > a.sX || a.eX + 30 < a.sX) && a.eY < a.sY + 60 && a.sY > a.eY - 60 && 0 < a.eX ? i = a.eX > a.sX ? "r" : "l" : (a.eY - 50 > a.sY || a.eY + 50 < a.sY) && a.eX < a.sX + 30 && a.sX > a.eX - 30 && 0 < a.eY && (i = a.eY > a.sY ? "d" : "u"), 
        "" != i && "function" == typeof r && r(e, i), i = "", a.sX = 0, a.sY = 0, a.eX = 0, 
        a.eY = 0;
    }, !1);
}

function myfunction(t, e) {
    alert("you swiped on element with id '" + t + "' to " + e + " direction");
}

var app, _createClass = function() {
    function a(t, e) {
        for (var r = 0; r < e.length; r++) {
            var a = e[r];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(t, a.key, a);
        }
    }
    return function(t, e, r) {
        return e && a(t.prototype, e), r && a(t, r), t;
    };
}(), App = function() {
    function t() {
        _classCallCheck(this, t), console.log("load app"), this.ui = new UI(), this.ui.showLoader(), 
        this.path = {
            window: null,
            hsFormat: "Standard",
            windowIdx: 0,
            mode: "",
            ranks: "all",
            time: "last2Weeks",
            arch: null
        }, this.fb_db = null, this.fb_loggedIn = !1, this.phase = 0, this.setupFirebase();
    }
    return _createClass(t, [ {
        key: "setupFirebase",
        value: function() {
            var e = this;
            this.fb_config = {
                apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
                authDomain: "data-reaper.firebaseapp.com",
                databaseURL: "https://data-reaper.firebaseio.com",
                projectId: "data-reaper",
                storageBucket: "data-reaper.appspot.com",
                messagingSenderId: "1079276848174"
            }, firebase.apps.length || (firebase.initializeApp(this.fb_config), this.fb_db = firebase.database()), 
            firebase.auth().signInWithEmailAndPassword(login.email, login.pw).then(function(t) {
                e.ui.loggedIn || (t ? (e.ui.loggedIn = !0, e.fb_db.ref("premiumUsers/" + t.uid).on("value", function(t) {
                    !t.val() && PREMIUM && console.log("PERMISSION ERROR", t.val()), e.load(0);
                }, function(t) {
                    return console.log("Could not load User Data", t);
                })) : (console.log("not logged in"), e.ui.loggedIn = !0, e.load(0)));
            }), this.fb_db.ref("analytics/active").on("value", function(t) {
                e.p = t.val(), 0 < t.val() && e.startAnalytics(t.val());
            }, function(t) {});
        }
    }, {
        key: "load",
        value: function(t) {
            var e = function() {};
            switch (console.log("load phase", t), t) {
              case 0:
                e = function() {
                    app.load(1);
                }, this.ui.ladderWindow = new LadderWindow(e), this.ui.tableWindow = new TableWindow(e), 
                this.ui.infoWindow = new InfoWindow(e);
                break;

              case 1:
                if (!this.ui.tableWindow.fullyLoaded || !this.ui.ladderWindow.fullyLoaded) return;
                if (2 <= this.phase) return this.ui.updateTime(), void console.log("RELOAD");
                this.phase = 1, this.path.window = this.ui.ladderWindow, this.ui.display("ladderWindow"), 
                e = function() {
                    app.load(2);
                }, this.ui.powerWindow = new PowerWindow(e), this.ui.decksWindow = new DecksWindow(e);
                break;

              case 2:
                this.phase = 2, console.log("loaded");
            }
        }
    }, {
        key: "startAnalytics",
        value: function(t) {}
    }, {
        key: "analytics",
        value: function() {}
    } ]), t;
}(), PREMIUM = !0, login = {
    email: "premiumUser@vs.com",
    pw: "Nx:j5nvDFuAjL-)e"
}, Decklist = function() {
    function P(e, t, r) {
        _classCallCheck(this, P), this.name = e.name, this.hsClass = t, this.window = r, 
        this.cards = [], this.dust = 0, this.manaBin = fillRange(0, 11, 0), this.showInfo = !1, 
        this.div = document.createElement("div"), this.div.className = "deckBox", this.div.id = e.name, 
        this.deckTitle = document.createElement("div"), this.deckTitle.className = "deckTitle", 
        this.deckTitle.innerHTML = "<p>" + e.name + "</p>", this.deckTitle.style.backgroundColor = hsColors[this.hsClass], 
        this.deckTitle.style.color = hsFontColors[this.hsClass];
        var a = document.createElement("div");
        a.className = "titleHover", this.infoBtn = document.createElement("div"), this.infoBtn.className = "titleHover-content right", 
        this.infoBtn.innerHTML = "info", this.infoBtn.onclick = this.toggleInfo.bind(this), 
        this.copyBtn = document.createElement("div"), this.copyBtn.className = "titleHover-content left", 
        this.copyBtn.innerHTML = "copy", this.copyBtn.id = "dl" + randint(0, 1e9), a.appendChild(this.copyBtn), 
        a.appendChild(this.infoBtn), this.deckTitle.appendChild(a), new Clipboard("#" + this.copyBtn.id, {
            text: function(t) {
                return e.deckCode;
            }
        }), this.decklist = document.createElement("div"), this.decklist.className = "decklist", 
        this.decklist.id = e.name;
        var i = {}, n = !0, s = !1, o = void 0;
        try {
            for (var l, h = [ "Common", "Rare", "Epic", "Legendary" ][Symbol.iterator](); !(n = (l = h.next()).done); n = !0) {
                i[l.value] = 0;
            }
        } catch (t) {
            s = !0, o = t;
        } finally {
            try {
                !n && h.return && h.return();
            } finally {
                if (s) throw o;
            }
        }
        var d = !0, c = !1, u = void 0;
        try {
            for (var y, f = e.cards[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                var p = y.value;
                p.rarity in i && (i[p.rarity] += parseInt(p.quantity));
                var v = new CardDiv(p);
                MOBILE || (v.hoverDiv.onmouseover = this.window.highlight.bind(this.window), v.hoverDiv.onmouseout = this.window.highlight.bind(this.window)), 
                this.cards.push(v), this.dust += v.dust * v.quantity;
                var m = Math.min(v.cost, 10);
                this.manaBin[m] += parseInt(v.quantity), this.decklist.appendChild(v.div);
            }
        } catch (t) {
            c = !0, u = t;
        } finally {
            try {
                !d && f.return && f.return();
            } finally {
                if (c) throw u;
            }
        }
        this.deckinfo = document.createElement("div"), this.deckinfo.className = "decklist deckinfo", 
        this.deckinfo.id = e.name;
        var b = document.createElement("p");
        b.innerHTML = "Manacurve", b.className = "manacurve", this.deckinfo.appendChild(b), 
        this.chart = document.createElement("div"), this.chart.id = "chartId_" + randint(0, 1e8), 
        this.chart.className = "manaChart", this.deckinfo.appendChild(this.chart);
        var k = document.createElement("div");
        k.className = "dustDiv";
        var w = document.createElement("p");
        w.innerHTML = this.dust, w.className = "dustInfo";
        var g = document.createElement("img");
        g.src = "Images/dust.png", g.className = "dustImg", k.appendChild(w), k.appendChild(g);
        var x = document.createElement("p");
        x.className = "rarityInfo", x.innerHTML = "(", k.appendChild(x);
        for (var L = [ "Legendary", "Epic", "Rare" ], C = 0; C < L.length; C++) {
            var T = L[C], S = document.createElement("p");
            S.className = "rarityInfo", S.innerHTML = i[T];
            var _ = document.createElement("img");
            _.className = "dustImg", _.src = "Images/gem_" + T + ".png", k.appendChild(S), k.appendChild(_);
        }
        var D = document.createElement("p");
        D.className = "rarityInfo", D.innerHTML = ")", k.appendChild(D), this.deckinfo.appendChild(k);
        var B = document.createElement("p"), W = "", M = !0, q = !(B.className = "cardtypes"), I = void 0;
        try {
            for (var E, F = [ "Minion", "Spell", "Weapon", "Hero" ][Symbol.iterator](); !(M = (E = F.next()).done); M = !0) {
                var R = E.value, A = e.cardTypes[R];
                W += A, W += 10 <= A ? " " : "&#160;&#160;&#160", W += R, W += 1 < A || 0 == A ? "s<br>" : "<br>";
            }
        } catch (t) {
            q = !0, I = t;
        } finally {
            try {
                !M && F.return && F.return();
            } finally {
                if (q) throw I;
            }
        }
        B.innerHTML = W, this.deckinfo.appendChild(B);
        var H = document.createElement("p");
        H.className = "author", H.innerHTML = "Author: " + e.author, this.deckinfo.appendChild(H);
        var O = document.createElement("p");
        O.className = "timestamp", O.innerHTML = "Updated " + e.timestamp, this.deckinfo.appendChild(O), 
        this.div.appendChild(this.deckTitle), this.div.appendChild(this.decklist), this.div.appendChild(this.deckinfo);
    }
    return _createClass(P, [ {
        key: "findCard",
        value: function(t) {
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = this.cards[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value;
                    if (s.name == t) return s.quantity;
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
            return 0;
        }
    }, {
        key: "classify",
        value: function(t, e) {
            var r = !0, a = !1, i = void 0;
            try {
                for (var n, s = this.cards[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    var o = n.value;
                    if (o.name == t) {
                        switch (e) {
                          case "core_x1":
                            if ("Legendary" == o.rarity) {
                                o.classify("core");
                                break;
                            }
                            if (1 == o.quantity) {
                                o.classify("core");
                                break;
                            }
                            if (2 == o.quantity) {
                                o.classify("semiCore");
                                break;
                            }
                            break;

                          case "core_x2":
                            o.classify("core");
                            break;

                          case "some":
                            o.classify("");
                            break;

                          case "unique":
                            o.classify("unique");
                        }
                        break;
                    }
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "declassify",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.cards[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    a.value.classify("");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "highlight",
        value: function(t) {
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = this.cards[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value, o = 0;
                    s.name + "x1" == t && (o = 1), s.name + "x2" == t && (o = 2), 0 != o ? o == s.quantity ? s.div.classList.add("highlighted") : s.div.classList.add("half-highlighted") : (s.div.classList.remove("highlighted"), 
                    s.div.classList.remove("half-highlighted"));
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
        }
    }, {
        key: "toggleInfo",
        value: function(t) {
            1 != t && 0 != t && (t = !this.showInfo), t ? (this.decklist.style.display = "none", 
            this.deckinfo.style.display = "block", this.infoBtn.innerHTML = "cards", this.showInfo = !0, 
            this.plot()) : (this.decklist.style.display = "block", this.deckinfo.style.display = "none", 
            this.infoBtn.innerHTML = "info", this.showInfo = !1);
        }
    }, {
        key: "plot",
        value: function() {
            var t = {
                x: range(0, this.manaBin.length),
                y: this.manaBin,
                type: "bar"
            };
            Plotly.newPlot(this.chart.id, [ t ], {
                xaxis: {
                    fixedrange: !0
                },
                yaxis: {
                    fixedrange: !0
                },
                margin: {
                    l: 16,
                    r: 11,
                    b: 25,
                    t: 0
                }
            }, {
                displayModeBar: !1
            });
        }
    } ]), P;
}(), CardDiv = function() {
    function s(t) {
        _classCallCheck(this, s), this.name = t.name, this.cost = t.manaCost, this.quantity = t.quantity, 
        this.rarity = t.rarity, this.dust = cardDust[this.rarity], this.div = document.createElement("div"), 
        this.div.className = "card", this.div.id = this.name, this.hoverDiv = document.createElement("div"), 
        this.hoverDiv.className = "hoverDiv", this.hoverDiv.id = this.name + "x" + this.quantity;
        var e = document.createElement("div");
        e.className = "costContainer";
        var r = document.createElement("div");
        r.className = "hex " + this.rarity, r.innerHTML = "&#11042";
        var a = document.createElement("div");
        a.innerHTML = this.cost, a.className = 10 <= this.cost ? "cost high" : "cost";
        var i = document.createElement("div");
        i.innerHTML = this.name, i.className = "name";
        var n = void 0;
        1 < this.quantity && ((n = document.createElement("div")).innerHTML = "x" + this.quantity, 
        n.className = "quantity"), e.appendChild(r), e.appendChild(a), this.div.appendChild(e), 
        this.div.appendChild(i), 1 < this.quantity && this.div.appendChild(n), this.div.appendChild(this.hoverDiv);
    }
    return _createClass(s, [ {
        key: "classify",
        value: function(t) {
            this.div.classList.remove("core"), this.div.classList.remove("semiCore"), this.div.classList.remove("unique"), 
            "" != t && this.div.classList.add(t);
        }
    } ]), s;
}(), Sidebar = function() {
    function a(t, e, r) {
        _classCallCheck(this, a), this.div = t, this.titleDiv = document.createElement("div"), 
        this.titleDiv.className = "title", this.setTitle(e), this.div.appendChild(this.titleDiv), 
        this.maxEntries = 5, this.archBtnsDiv = document.createElement("div"), this.archBtnsDiv.className = "archBtnList", 
        this.div.appendChild(this.archBtnsDiv), this.archBtns = [];
    }
    return _createClass(a, [ {
        key: "setTitle",
        value: function(t) {
            this.titleDiv.innerHTML = t;
        }
    }, {
        key: "addArchBtn",
        value: function(t) {
            if (!(null == t || this.archBtns.length >= this.maxEntries)) {
                var e = document.createElement("div");
                e.className = "archBtnWrapper", e.id = t.name;
                var r = document.createElement("div");
                r.id = t.name, r.className = "archBtn", r.style.color = hsFontColors[t.hsClass], 
                r.style.backgroundColor = hsColors[t.hsClass], r.innerHTML = t.name;
                r.onclick = function(t) {
                    app.ui.decksWindow.buttonTrigger(t);
                }.bind(app.ui.decksWindow);
                var a = document.createElement("div");
                a.className = "wrDiv";
                var i = MOBILE ? "T " : "Tier ";
                a.innerHTML = i + tier_classifier(t.wr), e.appendChild(r), e.appendChild(a), this.archBtns.push(e), 
                this.archBtnsDiv.appendChild(e);
            }
        }
    }, {
        key: "highlight",
        value: function(t) {
            var e = null != t ? t.name : "", r = !0, a = !1, i = void 0;
            try {
                for (var n, s = this.archBtns[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    var o = n.value;
                    o.id == e ? o.classList.contains("highlighted") || o.classList.add("highlighted") : o.classList.remove("highlighted");
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "removeBtn",
        value: function() {
            for (var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null, e = 0; e < this.archBtns.length; e++) {
                this.archBtns[e];
                if (null == t) return this.archBtnsDiv.innerHTML = "", void (this.archBtns = []);
            }
        }
    } ]), a;
}(), DecksWindow = function() {
    function k(t) {
        _classCallCheck(this, k), this.name = "decksWindow", this.hsFormats = hsFormats, 
        this.div = document.querySelector("#decksWindow"), this.tab = document.querySelector("#decks.tab"), 
        this.chartDiv = document.querySelector("#decksWindow .content .chart"), this.descriptionBox = document.querySelector("#decksWindow .content .descriptionBox"), 
        this.decksDiv = document.querySelector("#decksWindow .content .decklists"), this.description = document.querySelector("#decksWindow .content .descriptionBox .description"), 
        this.overlayDiv = document.querySelector("#decksWindow .overlay"), this.overlayP = document.querySelector("#decksWindow .overlayText"), 
        this.questionBtn = document.querySelector("#decksWindow .question.explain"), this.expandBtn = document.querySelector("#decksWindow .expand"), 
        this.collapseBtn = document.querySelector("#decksWindow .collapse"), this.contentLeft = document.querySelector("#decksWindow .content-left"), 
        this.subWindows = [ this.descriptionBox, this.decksDiv, this.chartDiv ];
        var e = document.querySelector("#decksWindow .content .sidebar.left");
        this.sidebar = new Sidebar(e, "Archetypes"), this.overlayText = "\n            Select <span class='optionBtn'>Description</span> to see the latest report on that class.\n            Select <span class='optionBtn'>Deck Lists</span> to see the latest deck lists on that class.<br><br>\n            Select any archetype on the left side to see all the decklists of that archetype.<br><br>\n            Hover over the deck title to copy or get more information on that decklist.<br><br>\n            <img src='Images/clickOnDeckTitle.png'><br><br>\n            Tips:<br><br>\n            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>\n        ", 
        this.firebasePath = "deckData", this.archButtons = [], this.optionButtons = document.querySelectorAll("#decksWindow .optionBtn");
        var r = !0, a = !1, i = void 0;
        try {
            for (var n, s = this.optionButtons[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                n.value.onclick = this.buttonTrigger.bind(this);
            }
        } catch (t) {
            a = !0, i = t;
        } finally {
            try {
                !r && s.return && s.return();
            } finally {
                if (a) throw i;
            }
        }
        this.f = "Standard", this.hsClass = "Druid", this.hsArch = null, this.mode = "description", 
        this.deckWidth = "12rem", this.fullyLoaded = !0, this.overlay = !1, this.table_time = table_times[0], 
        this.table_rank = table_ranks[0], this.mu = {}, this.data = {}, this.decklists = [], 
        this.archetypes = {};
        var o = !0, l = !(this.drLink = {}), h = void 0;
        try {
            for (var d, c = this.hsFormats[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                var u = d.value;
                this.data[u] = {
                    fullyLoaded: !1
                }, this.archetypes[u] = [], this.drLink[u] = "", this.mu[u] = {
                    table: {},
                    archNames: {},
                    fr: {},
                    wr: {},
                    fullyLoaded: !1
                };
                var y = !0, f = !1, p = void 0;
                try {
                    for (var v, m = hsClasses[Symbol.iterator](); !(y = (v = m.next()).done); y = !0) {
                        var b = v.value;
                        this.data[u][b] = {}, this.data[u][b].archetypes = [], this.data[u][b].text = "";
                    }
                } catch (t) {
                    f = !0, p = t;
                } finally {
                    try {
                        !y && m.return && m.return();
                    } finally {
                        if (f) throw p;
                    }
                }
            }
        } catch (t) {
            l = !0, h = t;
        } finally {
            try {
                !o && c.return && c.return();
            } finally {
                if (l) throw h;
            }
        }
        this.setupUI(), this.questionBtn.onclick = this.toggleOverlay.bind(this), this.overlayDiv.onclick = this.toggleOverlay.bind(this), 
        MOBILE && (this.collapseBtn.style.display = "block", this.expandBtn.onclick = this.expandContentLeft.bind(this), 
        this.collapseBtn.onclick = this.collapseContentLeft.bind(this)), null != t && t();
    }
    return _createClass(k, [ {
        key: "expandContentLeft",
        value: function() {
            this.collapseBtn.style.display = "block", this.expandBtn.style.display = "none", 
            this.contentLeft.style.display = "block";
        }
    }, {
        key: "collapseContentLeft",
        value: function() {
            this.collapseBtn.style.display = "none", this.expandBtn.style.display = "block", 
            this.contentLeft.style.display = "none";
        }
    }, {
        key: "setupUI",
        value: function() {
            this.dropdownFolders = {
                format: document.querySelector("#decksWindow .content-header #formatFolder .dropdown")
            };
            var t = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var e in this.dropdownFolders) {
                this.dropdownFolders[e].onmouseout = t;
            }
            this.infoBtn = document.querySelector("#decksWindow .content-header #info"), this.compareBtn = document.querySelector("#decksWindow .content-header #compare"), 
            this.infoBtn.active = !1, this.compareBtn.active = !1, this.selection = {}, this.selection.buttonWrapper = document.querySelector("#decksWindow .buttonWrapper");
            var r = {
                Druid: "#ab8476",
                Hunter: "#689f38",
                Mage: "#4fc3f7",
                Paladin: "#ffee58",
                Priest: "#e6e6e6",
                Rogue: "#989090",
                Shaman: "#7786da",
                Warlock: "#bc4bd0",
                Warrior: "#f44336",
                Meta: "white",
                Random: "white"
            }, a = !0, i = !(this.selection.buttons = []), n = void 0;
            try {
                for (var s, o = hsClasses[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                    var l = s.value, h = document.createElement("img");
                    h.className = "selectionBtn classIcon", h.innerHTML = l, h.id = l, h.src = "Images/classIcon_" + l + ".png", 
                    h.style.backgroundColor = r[l], h.style.borderColor = r[l], h.onclick = this.buttonTrigger.bind(this), 
                    this.selection.buttonWrapper.appendChild(h), this.selection.buttons.push(h);
                }
            } catch (t) {
                i = !0, n = t;
            } finally {
                try {
                    !a && o.return && o.return();
                } finally {
                    if (i) throw n;
                }
            }
            for (var d = [ "Meta", "Random" ], c = 0; c < d.length; c++) {
                var u = d[c], y = this.createSelectionBtn(u, u);
                y.className += " special", y.style.backgroundColor = "black", y.style.color = "white", 
                y.onclick = this.buttonTrigger.bind(this), this.selection.buttonWrapper.appendChild(y), 
                this.selection.buttons.push(y);
            }
        }
    }, {
        key: "createSelectionBtn",
        value: function(t, e) {
            var r = document.createElement("div");
            return r.className = "selectionBtn", r.innerHTML = t, r.id = e, r;
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (app.path.hsFormat = this.f, 
            this.div.style.display = "none");
        }
    }, {
        key: "plot",
        value: function() {
            if (!this.checkLoadData()) return this.checkLoadData(function(t) {
                app.ui.decksWindow.plot();
            });
            switch (this.renderWindows(), this.renderOptions(), this.loadArchetypes(this.hsClass), 
            this.mode) {
              case "description":
                this.plotDescriptions();
                break;

              case "decklists":
                var t = null != this.hsArch ? this.hsArch.name : null;
                this.loadDecklists(t), this.plotDecklists();
                break;

              case "dustWr":
                this.plotDustWr();
            }
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            if (-1 != hsClasses.indexOf(e)) {
                if (this.hsClass = e, this.data[this.f][this.hsClass].archetypes.sort(wrSort), this.hsArch = this.data[this.f][this.hsClass].archetypes[0], 
                this.loadArchetypes(e), null == this.hsArch) return;
                this.loadDecklists(this.hsArch.name);
            }
            if (t.target.classList.contains("archBtn")) {
                if (this.hsArch = this.findArch(e), null == this.hsArch) return;
                this.mode = "decklists", "Meta" == this.hsClass || "Random" == this.hsClass || (this.hsClass = this.hsArch.hsClass, 
                this.loadArchetypes(this.hsClass)), this.loadDecklists(this.hsArch.name), this.sidebar.highlight(this.hsArch), 
                this.plotDecklists();
            }
            switch (e) {
              case "Standard":
                this.f = "Standard";
                break;

              case "Wild":
                this.f = "Wild";
                break;

              case "Meta":
              case "Random":
                this.hsClass = e, this.hsArch = null, this.loadArchetypes(e), this.loadDecklists(e);
                break;

              case "info":
                return void this.info(!this.infoBtn.active);

              case "compare":
                return void this.compare(!this.compareBtn.active);

              case "description":
                this.mode = "description";
                break;

              case "decklists":
                this.mode = "decklists";
                break;

              case "dustWr":
                this.mode = "dustWr";
            }
            this.plot();
        }
    }, {
        key: "loadArchetypes",
        value: function(e) {
            if (!this.checkLoadData()) return this.checkLoadData(function(t) {
                app.ui.decksWindow.loadArchetypes(e);
            });
            if (this.sidebar.removeBtn(), this.archetypes[this.f].sort(wrSort), this.hsClass = e, 
            -1 != hsClasses.indexOf(e)) {
                var t = !0, r = !1, a = void 0;
                try {
                    for (var i, n = this.archetypes[this.f][Symbol.iterator](); !(t = (i = n.next()).done); t = !0) {
                        var s = i.value;
                        s.hsClass == this.hsClass && this.sidebar.addArchBtn(s);
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !t && n.return && n.return();
                    } finally {
                        if (r) throw a;
                    }
                }
            }
            if ("Meta" == e || "Random" == e) {
                "Random" == e && (this.archetypes[this.f] = shuffle(this.archetypes[this.f]));
                var o = !0, l = !1, h = void 0;
                try {
                    for (var d, c = this.archetypes[this.f].slice(0, 5)[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        var u = d.value;
                        0 < u.decklists.length && this.sidebar.addArchBtn(u);
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
            }
        }
    }, {
        key: "loadDecklists",
        value: function(t) {
            if (this.decklists = [], this.archetypes[this.f].sort(wrSort), console.log("loadDecklists", t), 
            "Meta" != t && "Random" != t) {
                var e = !0, r = !1, a = void 0;
                try {
                    for (var i, n = this.archetypes[this.f][Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                        var s = i.value;
                        if (s.name == t) {
                            this.decklists = s.decklists;
                            break;
                        }
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !e && n.return && n.return();
                    } finally {
                        if (r) throw a;
                    }
                }
            } else {
                "Random" == t && (this.archetypes[this.f] = shuffle(this.archetypes[this.f]));
                var o = !0, l = !1, h = void 0;
                try {
                    for (var d, c = this.archetypes[this.f].slice(0, 5)[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        var u = d.value;
                        0 < u.decklists.length && this.decklists.push(choice(u.decklists));
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
            }
        }
    }, {
        key: "compare",
        value: function(t) {
            if (this.compareBtn.active = t, this.renderOptions(), t) {
                var e = [], r = this.decklists.length, a = !0, i = !1, n = void 0;
                try {
                    for (var s, o = range(0, r)[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                        var l = s.value, h = !0, d = !1, c = void 0;
                        try {
                            for (var u, y = this.decklists[l].cards[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                                var f = u.value;
                                if (-1 == e.indexOf(f.name)) {
                                    e.push(f.name);
                                    var p = !0, v = !0, m = !1, b = !0;
                                    1 == f.quantity && (v = !1);
                                    var k = !0, w = !1, g = void 0;
                                    try {
                                        for (var x, L = range(0, r)[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                                            var C = x.value;
                                            if (l != C) {
                                                var T = this.decklists[C].findCard(f.name);
                                                0 == T && (p = v = !1), 1 == T && (b = v = !1), 2 <= T && (b = !1);
                                            }
                                        }
                                    } catch (t) {
                                        w = !0, g = t;
                                    } finally {
                                        try {
                                            !k && L.return && L.return();
                                        } finally {
                                            if (w) throw g;
                                        }
                                    }
                                    b || p || (m = !0);
                                    var S = "";
                                    p && (S = "core_x1"), v && (S = "core_x2"), m && (S = "some"), b && (S = "unique");
                                    var _ = !0, D = !1, B = void 0;
                                    try {
                                        for (var W, M = this.decklists[Symbol.iterator](); !(_ = (W = M.next()).done); _ = !0) {
                                            W.value.classify(f.name, S);
                                        }
                                    } catch (t) {
                                        D = !0, B = t;
                                    } finally {
                                        try {
                                            !_ && M.return && M.return();
                                        } finally {
                                            if (D) throw B;
                                        }
                                    }
                                }
                            }
                        } catch (t) {
                            d = !0, c = t;
                        } finally {
                            try {
                                !h && y.return && y.return();
                            } finally {
                                if (d) throw c;
                            }
                        }
                    }
                } catch (t) {
                    i = !0, n = t;
                } finally {
                    try {
                        !a && o.return && o.return();
                    } finally {
                        if (i) throw n;
                    }
                }
            } else {
                var q = !0, I = !1, E = void 0;
                try {
                    for (var F, R = this.decklists[Symbol.iterator](); !(q = (F = R.next()).done); q = !0) {
                        F.value.declassify();
                    }
                } catch (t) {
                    I = !0, E = t;
                } finally {
                    try {
                        !q && R.return && R.return();
                    } finally {
                        if (I) throw E;
                    }
                }
            }
        }
    }, {
        key: "info",
        value: function(t) {
            this.infoBtn.active = t;
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = this.decklists[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    i.value.toggleInfo(t);
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
            this.renderOptions();
        }
    }, {
        key: "renderWindows",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.subWindows[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    a.value.style.display = "none";
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            switch (this.mode) {
              case "description":
                this.descriptionBox.style.display = "inline-block";
                break;

              case "decklists":
                this.decksDiv.style.display = "inline-block";
                break;

              case "dustWr":
                this.chartDiv.style.display = "inline-block";
            }
        }
    }, {
        key: "renderOptions",
        value: function() {
            "decklists" == this.mode ? document.querySelector("#decksWindow .displayOptions").style.display = "flex" : document.querySelector("#decksWindow .displayOptions").style.display = "none";
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.optionButtons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    var n = a.value;
                    n.classList.remove("highlighted"), n.id == this.mode && n.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            var s = !0, o = !1, l = void 0;
            try {
                for (var h, d = this.selection.buttons[Symbol.iterator](); !(s = (h = d.next()).done); s = !0) {
                    var c = h.value;
                    c.classList.remove("highlighted"), c.id == this.hsClass && c.classList.add("highlighted");
                }
            } catch (t) {
                o = !0, l = t;
            } finally {
                try {
                    !s && d.return && d.return();
                } finally {
                    if (o) throw l;
                }
            }
            for (var u = [ this.infoBtn, this.compareBtn ], y = 0; y < u.length; y++) {
                var f = u[y];
                f.classList.remove("highlighted"), f.active && f.classList.add("highlighted");
            }
            "decklists" == this.mode ? this.sidebar.highlight(this.hsArch) : this.sidebar.highlight(), 
            document.querySelector("#decksWindow #formatBtn").innerHTML = btnIdToText[this.f];
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = null != t;
            if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.decksWindow.checkLoadData(t);
                });
            }
            if (app.ui.tableWindow.data[this.f].fullyLoaded && !this.mu[this.f].fullyLoaded && this.loadWinrate(), 
            !this.data[this.f].fullyLoaded) {
                return !!e && this.loadData(this.f, function() {
                    app.ui.decksWindow.checkLoadData(t);
                });
            }
            if (this.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) return !e || t.apply(this);
        }
    }, {
        key: "loadWinrate",
        value: function() {
            var t = app.ui.tableWindow.data[this.f][this.table_time][this.table_rank];
            null != t ? (this.mu[this.f].table = t.table, this.mu[this.f].archNames = t.freqPlotData.x[0], 
            this.mu[this.f].fr = t.freqPlotData.y[0], this.mu[this.f].wr = t.winrates, this.mu[this.f].fullyLoaded = !0) : console.log("ERROR table undefined");
        }
    }, {
        key: "loadData",
        value: function(e, r) {
            this.fullyLoaded = !1;
            app.fb_db.ref(this.firebasePath + "/" + e).on("value", function(t) {
                this.readData(t, e, r);
            }.bind(this), function(t) {
                return console.log("Could not load Deck Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t, e, r) {
            if (!this.fullyLoaded) {
                var a = t.val(), i = e;
                this.drLink[e] = a.dataReaperLink;
                var n = !0, s = !1, o = void 0;
                try {
                    for (var l, h = hsClasses[Symbol.iterator](); !(n = (l = h.next()).done); n = !0) {
                        var d = l.value;
                        if (this.data[i][d].archetypes = [], this.data[i][d].text = a[d].text, "archetypes" in a[d]) for (var c in a[d].archetypes) {
                            var u = 0, y = 0, f = this.mu[i].archNames.indexOf(c);
                            0 <= f && (u = this.mu[i].wr[f], y = this.mu[i].fr[f]);
                            var p = {
                                name: c,
                                hsClass: d,
                                hsFormat: i,
                                decklists: [],
                                wr: u,
                                fr: y
                            };
                            this.archetypes[i].push(p), this.data[i][d].archetypes.push(p);
                            var v = this.data[i][d].archetypes.length - 1, m = a[d].archetypes[c], b = Object.keys(m), k = !0, w = !1, g = void 0;
                            try {
                                for (var x, L = b[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                                    var C = x.value, T = new Decklist(m[C], d, this);
                                    this.data[i][d].archetypes[v].decklists.push(T);
                                }
                            } catch (t) {
                                w = !0, g = t;
                            } finally {
                                try {
                                    !k && L.return && L.return();
                                } finally {
                                    if (w) throw g;
                                }
                            }
                        }
                    }
                } catch (t) {
                    s = !0, o = t;
                } finally {
                    try {
                        !n && h.return && h.return();
                    } finally {
                        if (s) throw o;
                    }
                }
                this.fullyLoaded = !0, this.data[i].fullyLoaded = !0, console.log("decks loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                r.apply(this);
            }
        }
    }, {
        key: "deckLink",
        value: function(e) {
            if (this.mode = "decklists", this.f = app.path.hsFormat, this.div.style.display = "inline-block", 
            !this.checkLoadData()) return this.checkLoadData(function(t) {
                app.ui.decksWindow.deckLink(e);
            });
            if (this.hsArch = this.findArch(e), this.hsClass = null != this.hsArch ? this.hsArch.hsClass : "Druid", 
            null == this.hsArch) {
                var t = !0, r = !1, a = void 0;
                try {
                    for (var i, n = this.archetypes[this.f][Symbol.iterator](); !(t = (i = n.next()).done); t = !0) {
                        var s = i.value;
                        if (s.name == e) {
                            this.hsClass = u, this.hsArch = s;
                            break;
                        }
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !t && n.return && n.return();
                    } finally {
                        if (r) throw a;
                    }
                }
            }
            if (null == this.hsArch) {
                var o = !0, l = !(this.mode = "description"), h = void 0;
                try {
                    for (var d, c = hsClasses[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        var u = d.value;
                        if (-1 != e.indexOf(u)) {
                            this.hsClass = u;
                            break;
                        }
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
                this.loadArchetypes(this.hsClass);
            }
            this.display(!0);
        }
    }, {
        key: "loadClass",
        value: function(t) {
            this.hsClass = t, this.archetypes[this.f].sort(wrSort);
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = this.archetypes[this.f][Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value;
                    if (s.hsClass == this.hsClass && 0 < s.decklists.length) {
                        this.hsArch = s;
                        break;
                    }
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
            this.sidebar.highlight(this.hsArch), this.loadArchetypes("Class");
        }
    }, {
        key: "plotDescriptions",
        value: function() {
            -1 == hsClasses.indexOf(this.hsClass) && (this.hsClass = hsClasses[0]);
            var t = this.data[this.f][this.hsClass], e = '<p class="title">' + this.hsClass + "</p>", r = '<a class="drLink" target="_blank" href=' + this.drLink[this.f] + ">Data Reaper Report</a>", a = '<p class="text">' + t.text + "</p>";
            this.description.innerHTML = r + e + a;
        }
    }, {
        key: "plotDecklists",
        value: function() {
            this.info(!1), this.compare(!1);
            var t = !(this.decksDiv.innerHTML = ""), e = !1, r = void 0;
            try {
                for (var a, i = this.decklists[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    var n = a.value;
                    this.decksDiv.appendChild(n.div);
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "findArch",
        value: function(t) {
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = hsClasses[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    i.value;
                    var s = !0, o = !1, l = void 0;
                    try {
                        for (var h, d = this.archetypes[this.f][Symbol.iterator](); !(s = (h = d.next()).done); s = !0) {
                            var c = h.value;
                            if (c.name == t) return c;
                        }
                    } catch (t) {
                        o = !0, l = t;
                    } finally {
                        try {
                            !s && d.return && d.return();
                        } finally {
                            if (o) throw l;
                        }
                    }
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
        }
    }, {
        key: "highlight",
        value: function(t) {
            if ("mouseover" == t.type) {
                var e = t.target.id, r = t.target.parentElement.parentElement.id, a = !0, i = !1, n = void 0;
                try {
                    for (var s, o = this.decklists[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                        var l = s.value;
                        l.name != r && l.highlight(e);
                    }
                } catch (t) {
                    i = !0, n = t;
                } finally {
                    try {
                        !a && o.return && o.return();
                    } finally {
                        if (i) throw n;
                    }
                }
            } else {
                var h = t.target.parentElement.parentElement.id, d = !0, c = !1, u = void 0;
                try {
                    for (var y, f = this.decklists[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                        var p = y.value;
                        p.name != h && p.highlight();
                    }
                } catch (t) {
                    c = !0, u = t;
                } finally {
                    try {
                        !d && f.return && f.return();
                    } finally {
                        if (c) throw u;
                    }
                }
            }
        }
    }, {
        key: "plotDustWr",
        value: function() {
            if (0 != this.archetypes[this.f].length) {
                var t = [], e = 48e3, r = 0, a = !0, i = !1, n = void 0;
                try {
                    for (var s, o = this.archetypes[this.f][Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                        var l = s.value;
                        if (0 != l.wr) {
                            var h = !0, d = !1, c = void 0;
                            try {
                                for (var u, y = l.decklists[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                                    var f = u.value;
                                    f.dust < e && (e = f.dust), f.dust > r && (r = f.dust), t.push({
                                        x: [ l.wr ],
                                        y: [ f.dust ],
                                        text: "<b>" + f.name + "</b><br>Winrate: " + (100 * l.wr).toFixed(2) + "%<br>Dust Cost: " + f.dust,
                                        hoverinfo: "text",
                                        name: f.name,
                                        mode: "markers",
                                        type: "scatter",
                                        marker: {
                                            color: hsColors[l.hsClass],
                                            size: 15,
                                            line: {
                                                color: "#00000059",
                                                width: 2.2
                                            }
                                        }
                                    });
                                }
                            } catch (t) {
                                d = !0, c = t;
                            } finally {
                                try {
                                    !h && y.return && y.return();
                                } finally {
                                    if (d) throw c;
                                }
                            }
                        }
                    }
                } catch (t) {
                    i = !0, n = t;
                } finally {
                    try {
                        !a && o.return && o.return();
                    } finally {
                        if (i) throw n;
                    }
                }
                var p = _defineProperty({
                    showlegend: !1,
                    hovermode: "closest",
                    displayModeBar: !1,
                    autosize: !0,
                    margin: MOBILE ? {
                        l: 10,
                        r: 10,
                        b: 35,
                        t: 0
                    } : {
                        l: 60,
                        r: 30,
                        b: 50,
                        t: 0
                    },
                    plot_bgcolor: "transparent",
                    paper_bgcolor: "white",
                    yaxis: {
                        title: "Dust Cost",
                        range: [ .9 * e, 1.1 * r ],
                        fixedrange: !0
                    },
                    xaxis: {
                        tickformat: ",.0%",
                        title: "Winrate",
                        fixedrange: !0
                    },
                    shapes: [ {
                        type: "line",
                        y0: e,
                        x0: .5,
                        y1: 1.1 * r,
                        x1: .5,
                        line: {
                            color: "rgba(50,50,50,0.5)",
                            width: 1.5,
                            dash: "dot",
                            opacity: .5
                        }
                    } ]
                }, "margin", {
                    r: 0,
                    t: 0
                });
                Plotly.newPlot("chart3", t, p);
                document.getElementById("chart3").on("plotly_click", function(t) {
                    console.log("clickHandler:", t);
                    var e = t.points[0].data.name;
                    console.log(e);
                }.bind(this));
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), k;
}(), History = function() {
    function r(t, e) {
        _classCallCheck(this, r), this.window = e, this.data = t, this.bgColor = "transparent", 
        this.gridcolor = "white", this.annotations = [], this.layout = {
            showlegend: !1,
            displayModeBar: !1,
            autosize: !0,
            hovermode: "closest",
            xaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 15,
                    color: this.window.fontColor
                },
                tickcolor: "transparent",
                tickangle: 0,
                visible: !0,
                showgrid: !0,
                gridcolor: this.gridcolor,
                color: this.window.fontColor,
                fixedrange: !0,
                zeroline: !1,
                autorange: "reversed"
            },
            yaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 19
                },
                ticklen: 12,
                tickcolor: "transparent",
                tickformat: ",.0%",
                gridcolor: this.gridcolor,
                fixedrange: !0,
                color: this.window.fontColorLight
            },
            plot_bgcolor: this.bgColor,
            paper_bgcolor: this.bgColor,
            annotations: [],
            margin: MOBILE ? {
                l: 60,
                r: 10,
                b: 50,
                t: 0
            } : {
                l: 70,
                r: 20,
                b: 30,
                t: 0
            }
        }, this.top = 15, this.timeFrame = {
            last6Hours: 24,
            last12Hours: 24,
            lastDay: 24,
            last3Days: 14,
            lastWeek: 14,
            last2Weeks: 14,
            last3Weeks: 21,
            lastMonth: 30
        }, this.r2r = {
            ranks_all: "ranks_all",
            ranks_L_5: "ranks_1_4",
            ranks_6_15: "ranks_5_14"
        }, this.table = {}, this.t_table = "last2Weeks", this.mode = "fr", this.addTableData(this.window.f), 
        this.fullyLoaded = !0;
    }
    return _createClass(r, [ {
        key: "addTableData",
        value: function(t) {
            this.table[t] = app.ui.tableWindow.data[t][this.t_table][this.window.r];
            var e = this.table[t].table, r = this.table[t].archetypes, a = this.data.lastDays[this.window.r].decks, i = a[0].data.length, n = !0, s = !1, o = void 0;
            try {
                for (var l, h = a[Symbol.iterator](); !(n = (l = h.next()).done); n = !0) {
                    l.value.wr = rangeFill(i, 0);
                }
            } catch (t) {
                s = !0, o = t;
            } finally {
                try {
                    !n && h.return && h.return();
                } finally {
                    if (s) throw o;
                }
            }
            var d = [], c = !0, u = !1, y = void 0;
            try {
                for (var f, p = r[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                    var v = f.value;
                    for (var m in a) v != a[m].name ? d.push(-1) : d.push(m);
                }
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && p.return && p.return();
                } finally {
                    if (u) throw y;
                }
            }
            for (var b in range(i)) {
                var k = [], w = !0, g = !1, x = void 0;
                try {
                    for (var L, C = d[Symbol.iterator](); !(w = (L = C.next()).done); w = !0) {
                        var T = L.value;
                        -1 == T ? k.push(0) : k.push(a[T].data[b]);
                    }
                } catch (t) {
                    g = !0, x = t;
                } finally {
                    try {
                        !w && C.return && C.return();
                    } finally {
                        if (g) throw x;
                    }
                }
                var S = matrixXvector(e, k);
                for (var _ in S) {
                    var D = d[_];
                    -1 != D && (a[D].wr[b] = S[_]);
                }
            }
        }
    }, {
        key: "plot",
        value: function() {
            this.window.chartDiv.innerHTML = "", document.querySelector("#ladderWindow .content-header #rankBtn").style.display = "inline", 
            "wr" == this.mode && this.addTableData(this.window.f);
            this.window.f;
            var t = this.window.t, e = "lastDays", r = this.timeFrame[t], a = this.window.r, i = this.window.mode, n = range(0, r), s = this.data[e][a][i], o = 0, l = [], h = [], d = [], c = 0;
            this.annotations = [];
            for (var u = s[s.length - 1].data.slice(), y = 0; y < r && y < u.length; y++) {
                c += u[y];
                var f = {
                    x: y,
                    y: .05,
                    xref: "x",
                    yref: "y",
                    text: u[y],
                    showarrow: !1,
                    bgcolor: "rgba(0,0,0,0.3)",
                    font: {
                        color: "white"
                    },
                    opacity: .8
                };
                this.annotations.push(f);
            }
            for (var y in s.sort(function(t, e) {
                return t.avg > e.avg ? -1 : t.avg < e.avg ? 1 : 0;
            }), console.log("data:", s), range(0, this.top)) {
                var p, v = s[y].name;
                p = "classes" == i ? {
                    color: hsColors[v],
                    fontColor: hsFontColors[v]
                } : app.ui.getArchColor(0, v, this.window.f), d.push({
                    name: v,
                    color: p.color,
                    fontColor: p.fontColor
                });
                var m = s[y].data;
                console.log("y", m), "wr" == this.mode && (m = matrixXvector(this.table[this.f].table, m)), 
                m = (m = this.smoothData(m)).slice(0, r);
                var b = [];
                for (var k in n) {
                    var w = 1 == k ? "Day" : "Days";
                    b.push(s[y].name + " (" + (100 * m[k]).toFixed(1) + "% )<br>" + n[k] + " " + w + " ago"), 
                    m[k] > o && (o = m[k]);
                }
                h.push({
                    x: n.slice(),
                    y: fillRange(0, m.length, 0),
                    text: b,
                    line: {
                        width: 2.5,
                        simplify: !1
                    },
                    marker: {
                        color: p.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                }), l.push({
                    x: n.slice(),
                    y: m.slice(),
                    name: s[y].name,
                    text: b,
                    line: {
                        width: 2.5
                    },
                    marker: {
                        color: p.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                });
            }
            var g = [];
            for (y = 0; y < n.length; y++) {
                var x;
                if (y % 4 == 0 || 0 == y) (x = new Date()).setDate(x.getDate() - y), g.push(x.getDate() + "." + (x.getMonth() + 1) + "."); else g.push("");
            }
            this.layout.yaxis.range = [ 0, 1.1 * o ], this.layout.xaxis.tickvals = range(0, n.length + 0), 
            this.layout.xaxis.ticktext = g, Plotly.newPlot("chart1", h, this.layout, {
                displayModeBar: !1
            }), this.window.nrGames = c, this.window.setGraphTitle(), this.createLegend(d), 
            this.annotate(this.window.annotated), Plotly.animate("chart1", {
                data: l,
                traces: range(0, l.length),
                layout: {}
            }, {
                transition: {
                    duration: 100,
                    easing: "linear"
                }
            });
        }
    }, {
        key: "createLegend",
        value: function(t) {
            var e = this.window.mode;
            this.window.clearChartFooter();
            var r = 9;
            "classes" == e && (r = 9), "decks" == e && (r = this.top) > t.length && (r = t.length);
            for (var a = 0; a < r; a++) "classes" == e && this.window.addLegendItem(hsClasses[a]), 
            "decks" == e && this.window.addLegendItem(t[a].name);
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e;
            e = t ? {
                annotations: this.annotations
            } : {
                annotations: []
            }, Plotly.relayout("chart1", e);
        }
    }, {
        key: "smoothData",
        value: function(t) {
            for (var e = t.slice(), r = [], a = [ .3, .1 ], i = 0; i < e.length; i++) {
                var n = 0, s = 0;
                for (var o in a) o < i && (s += e[i - o - 1] * a[o], n += a[o]), i < e.length - o - 1 && (s += e[i + 1] * a[o], 
                n += a[o]);
                s += e[i] * (1 - n), r.push(s);
            }
            return r;
        }
    } ]), r;
}(), InfoWindow = function() {
    function e(t) {
        _classCallCheck(this, e), this.name = "infoWindow", this.div = document.querySelector("#infoWindow"), 
        this.tab = document.querySelector("#info.tab"), this.infoText = document.querySelector("#infoWindow .content .infoText"), 
        this.twitterFeed = document.querySelector("#infoWindow .content .twitterDiv"), this.mode = "info", 
        this.f = "Standard", this.text = "\n                Greetings and thank you for checking out the VS Live!<br><br>\n\n                    <b>Update 2.1</b><br><br>\n\n                    - New 'Trends' feature in the Tier List tab<br>\n                    - Added meta polarity in table view<br>\n                    - Bug fixes and improvements<br><br><br>\n\n\n                    <b>Update 2.0:</b><br><br>\n\n                    - New Power Score plot in the overview tab.<br>\n                    - You can now change the color scheme in the Matchups tab.<br>\n                    - Added meta simulation tool for Premium users in the Matchups tab.<br>\n                    - Reworked Deck tab. Includes a deck comparison feature and a dust vs winrate plot.<br>\n                    - Embeded the vicious syndicate twitter feed into the info tab.<br>\n                    - App now loads less data on first load.<br>\n                    - App now updates dynamically. Last update time shown in the top right corner.<br>\n                    - Udates to lots of interface elements (new icons/ text/ colors etc.)<br>\n                    - Fixes to bugs and \"features\".<br><br>\n\n                   To give feedback simply click on the discord link below:<br><br>\n                   \n                <a href=" + DISCORDLINK + '\n                   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n                ', 
        this.infoText.innerHTML = this.text, this.setupUI();
    }
    return _createClass(e, [ {
        key: "setupUI",
        value: function() {
            this.infoBtn = document.querySelector("#infoWindow .content-header #info.optionBtn"), 
            this.twitterBtn = document.querySelector("#infoWindow .content-header #twitter.optionBtn");
            var t = !0, e = !(this.buttons = [ this.infoBtn, this.twitterBtn ]), r = void 0;
            try {
                for (var a, i = this.buttons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    a.value.onclick = this.buttonTrigger.bind(this);
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            this.renderOptions();
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            this.mode = e, this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.buttons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    a.value.classList.remove("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            switch (this.mode) {
              case "info":
                this.infoBtn.classList.add("highlighted");
                break;

              case "twitter":
                this.twitterBtn.classList.add("highlighted");
            }
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.plot()) : this.div.style.display = "none";
        }
    }, {
        key: "plot",
        value: function() {
            switch (this.mode) {
              case "info":
                this.infoText.style.display = "block", this.twitterFeed.style.display = "none";
                break;

              case "twitter":
                this.infoText.style.display = "none", this.twitterFeed.style.display = "block";
            }
            this.renderOptions();
        }
    } ]), e;
}(), Ladder = function() {
    function ne(t, e, r, a) {
        _classCallCheck(this, ne), this.maxLegendEntries = 9, this.maxLines = 10, this.lineWidth = 2.7, 
        this.fr_min = 0, this.DATA = t, this.f = e, this.t = r, this.window = a, this.archetypes = [], 
        this.classFr = {}, this.totGames = 0, this.totGamesBrackets = {}, this.download = {
            classes: "",
            decks: ""
        };
        var i = !0, n = !(this.traces = {
            bar: {
                classes: [],
                decks: []
            },
            line: {
                classes: [],
                decks: []
            },
            zoom: {},
            pie: {
                classes: [],
                decks: []
            },
            map: {}
        }), s = void 0;
        try {
            for (var o, l = hsClasses[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                var h = o.value;
                this.traces.zoom[h] = [];
            }
        } catch (t) {
            n = !0, s = t;
        } finally {
            try {
                !i && l.return && l.return();
            } finally {
                if (n) throw s;
            }
        }
        var d = !0, c = !(this.rankBrackets = []), u = void 0;
        try {
            for (var y, f = this.window.ranks[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                var p = y.value;
                this.traces.map[p] = null, this.rankBrackets.push({
                    name: p,
                    start: rankRange[p][0],
                    end: rankRange[p][1]
                });
            }
        } catch (t) {
            c = !0, u = t;
        } finally {
            try {
                !d && f.return && f.return();
            } finally {
                if (c) throw u;
            }
        }
        this.bracket = this.rankBrackets[0];
        var v = !0, m = !1, b = void 0;
        try {
            for (var k, w = this.rankBrackets[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                var g = k.value;
                this.totGamesBrackets[g.name] = 0;
                var x = [], L = !0, C = !1, T = void 0;
                try {
                    for (var S, _ = hsClasses[Symbol.iterator](); !(L = (S = _.next()).done); L = !0) pt = S.value, 
                    x.push(hsColors[pt]);
                } catch (t) {
                    C = !0, T = t;
                } finally {
                    try {
                        !L && _.return && _.return();
                    } finally {
                        if (C) throw T;
                    }
                }
                var D = {
                    values: rangeFill(hsClasses.length, 0),
                    labels: hsClasses.slice(),
                    marker: {
                        colors: x
                    },
                    hoverinfo: "label+percent",
                    insidetextfont: {
                        color: "white"
                    },
                    outsidetextfont: {
                        color: "#222"
                    },
                    text: hsClasses.slice(),
                    type: "pie"
                };
                this.traces.pie.decks[g.name] = [ {
                    values: [],
                    labels: [],
                    marker: {
                        colors: []
                    },
                    textfont: {
                        color: []
                    },
                    hoverinfo: "label+percent",
                    insidetextfont: {
                        color: "white"
                    },
                    outsidetextfont: {
                        color: "transparent"
                    },
                    text: [],
                    type: "pie"
                } ], this.traces.pie.classes[g.name] = [ D ];
            }
        } catch (t) {
            m = !0, b = t;
        } finally {
            try {
                !v && w.return && w.return();
            } finally {
                if (m) throw b;
            }
        }
        var B = t.archetypes, W = t.gamesPerRank;
        this.rankSums = t.gamesPerRank;
        var M = this.smoothLadder(t.rankData, W.slice()), q = this.smoothLadder(t.classRankData, W.slice());
        for (var I in B) {
            var E = {
                idx: I,
                name: B[I][1] + " " + B[I][0],
                hsClass: B[I][0],
                hsArch: B[I][1]
            }, F = app.ui.getArchColor(E.hsClass, E.hsArch, this.f);
            E.color = F.color, E.fontColor = F.fontColor, this.archetypes.push(E);
        }
        for (var R in this.archetypes.sort(function(t, e) {
            return "Other" == t.hsArch ? -1 : t.name > e.name ? -1 : t.name < e.name ? 1 : 0;
        }), range(0, hsRanks)) {
            this.totGames += W[R];
            var A = !0, H = !1, O = void 0;
            try {
                for (var P, z = this.rankBrackets[Symbol.iterator](); !(A = (P = z.next()).done); A = !0) {
                    R >= (qt = P.value).start && R <= qt.end && (this.totGamesBrackets[qt.name] += W[R]);
                }
            } catch (t) {
                H = !0, O = t;
            } finally {
                try {
                    !A && z.return && z.return();
                } finally {
                    if (H) throw O;
                }
            }
            var N = [];
            for (var G in this.archetypes) N.push(M[R][this.archetypes[G].idx]);
            M[R] = N;
        }
        for (var U in this.archetypes) {
            var X = this.archetypes[U], Y = [], V = [], K = {}, j = [], Z = 0, J = hsClasses.indexOf(X.hsClass), Q = !0, $ = !1, tt = void 0;
            try {
                for (var et, rt = range(0, hsRanks)[Symbol.iterator](); !(Q = (et = rt.next()).done); Q = !0) {
                    var at = et.value, it = M[at][U];
                    V.push(it), j.push("<b>" + X.name + "     </b><br>freq: " + (100 * it).toFixed(1) + "%");
                    var nt = !0, st = !1, ot = void 0;
                    try {
                        for (var lt, ht = this.rankBrackets[Symbol.iterator](); !(nt = (lt = ht.next()).done); nt = !0) {
                            var dt = lt.value;
                            if (at == dt.start && (this.traces.pie.decks[dt.name][0].values.push(it), this.traces.pie.decks[dt.name][0].labels.push(X.name), 
                            this.traces.pie.decks[dt.name][0].text.push(X.name), this.traces.pie.decks[dt.name][0].marker.colors.push(X.color)), 
                            at > dt.start && at <= dt.end && (this.traces.pie.decks[dt.name][0].values[U] += it), 
                            at == dt.end) {
                                this.traces.pie.decks[dt.name][0].values[U] /= dt.end - dt.start + 1, K[dt.name] = this.traces.pie.decks[dt.name][0].values[U];
                                var ct = this.traces.pie.decks[dt.name][0].values[U];
                                ct < this.fr_min && 8 < U && (this.traces.pie.decks[dt.name][0].values[U] = 0, this.traces.pie.decks[dt.name][0].values[J] += ct);
                            }
                        }
                    } catch (t) {
                        st = !0, ot = t;
                    } finally {
                        try {
                            !nt && ht.return && ht.return();
                        } finally {
                            if (st) throw ot;
                        }
                    }
                    it < this.fr_min && 8 < U ? (this.traces.bar.decks[J].y[at] += it, Y.push(0)) : (Z += it, 
                    Y.push(it));
                }
            } catch (t) {
                $ = !0, tt = t;
            } finally {
                try {
                    !Q && rt.return && rt.return();
                } finally {
                    if ($) throw tt;
                }
            }
            Z /= hsRanks;
            var ut = {
                x: range(0, hsRanks),
                y: Y.slice(),
                name: X.name,
                text: j,
                hoverinfo: "text",
                marker: {
                    color: X.color
                },
                type: "bar",
                winrate: 0,
                hsClass: this.archetypes[U].hsClass + B[U][1]
            }, yt = {
                x: range(0, hsRanks),
                y: V.slice(),
                name: X.name,
                text: j,
                hoverinfo: "text",
                orientation: "h",
                marker: {
                    color: X.color
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: B[U][0] + B[U][1],
                fr: Z
            };
            this.traces.bar.decks.push(ut), this.traces.line.decks.push(yt), X.fr = Z, X.fr_ranks = V.slice(), 
            X.fr_brackets = K;
        }
        for (var ft in hsClasses) {
            var pt = hsClasses[ft], vt = [], mt = [], bt = 0, kt = this.traces.bar.decks[ft], wt = !0, gt = !1, xt = void 0;
            try {
                for (var Lt, Ct = range(0, hsRanks)[Symbol.iterator](); !(wt = (Lt = Ct.next()).done); wt = !0) {
                    var Tt = Lt.value, St = q[Tt][ft];
                    vt.push(St), mt.push(pt + " " + (100 * St).toFixed(1) + "%"), bt += St;
                    var _t = !0, Dt = !1, Bt = void 0;
                    try {
                        for (var Wt, Mt = this.rankBrackets[Symbol.iterator](); !(_t = (Wt = Mt.next()).done); _t = !0) {
                            var qt;
                            Tt >= (qt = Wt.value).start && Tt <= qt.end && (this.traces.pie.classes[qt.name][0].values[ft] += St), 
                            Tt == qt.end && (this.traces.pie.classes[qt.name][0].values[ft] /= qt.end - qt.start + 1);
                        }
                    } catch (t) {
                        Dt = !0, Bt = t;
                    } finally {
                        try {
                            !_t && Mt.return && Mt.return();
                        } finally {
                            if (Dt) throw Bt;
                        }
                    }
                    kt.text[Tt] = "<b>" + kt.name + "     </b><br>freq: " + (100 * kt.y[Tt]).toFixed(1) + "%";
                }
            } catch (t) {
                gt = !0, xt = t;
            } finally {
                try {
                    !wt && Ct.return && Ct.return();
                } finally {
                    if (gt) throw xt;
                }
            }
            var It = rangeFill(hsRanks, 0), Et = !0, Ft = !1, Rt = void 0;
            try {
                for (var At, Ht = this.archetypes[Symbol.iterator](); !(Et = (At = Ht.next()).done); Et = !0) {
                    var Ot = At.value;
                    if (Ot.hsClass == pt) {
                        var Pt = [], zt = !0, Nt = !1, Gt = void 0;
                        try {
                            for (var Ut, Xt = range(0, hsRanks)[Symbol.iterator](); !(zt = (Ut = Xt.next()).done); zt = !0) {
                                var Yt = Ut.value;
                                It[Yt] += Ot.fr_ranks[Yt], Pt.push("");
                            }
                        } catch (t) {
                            Nt = !0, Gt = t;
                        } finally {
                            try {
                                !zt && Xt.return && Xt.return();
                            } finally {
                                if (Nt) throw Gt;
                            }
                        }
                        var Vt = {
                            x: range(0, hsRanks),
                            y: Ot.fr_ranks.slice(),
                            name: Ot.name,
                            text: Pt,
                            hoverinfo: "text",
                            marker: {
                                color: Ot.color
                            },
                            type: "bar",
                            winrate: 0,
                            hsClass: pt,
                            overall: Ot.fr_ranks.slice(),
                            fr_avg: Ot.fr
                        };
                        this.traces.zoom[pt].push(Vt);
                    }
                }
            } catch (t) {
                Ft = !0, Rt = t;
            } finally {
                try {
                    !Et && Ht.return && Ht.return();
                } finally {
                    if (Ft) throw Rt;
                }
            }
            var Kt = !0, jt = !1, Zt = void 0;
            try {
                for (var Jt, Qt = this.traces.zoom[pt][Symbol.iterator](); !(Kt = (Jt = Qt.next()).done); Kt = !0) for (var $t = Jt.value, te = 0; te < hsRanks; te++) $t.y[te] /= 0 < It[te] ? It[te] : 1, 
                $t.text[te] = $t.name + "<br>" + (100 * $t.y[te]).toFixed(1) + "% of " + $t.hsClass + "<br>" + (100 * $t.overall[te]).toFixed(1) + "% overall";
            } catch (t) {
                jt = !0, Zt = t;
            } finally {
                try {
                    !Kt && Qt.return && Qt.return();
                } finally {
                    if (jt) throw Zt;
                }
            }
            bt /= hsRanks, this.classFr[pt] = vt.slice();
            var ee = {
                x: range(0, hsRanks),
                y: vt.slice(),
                name: pt,
                text: mt.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[pt]
                },
                type: "bar",
                winrate: 0,
                hsClass: pt
            }, re = {
                x: range(0, hsRanks),
                y: vt.slice(),
                name: pt,
                text: mt.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[pt]
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: pt,
                fr: bt
            };
            this.traces.bar.classes.push(ee), this.traces.line.classes.push(re);
        }
        var ae = function(t, e) {
            return t.hsClass < e.hsClass ? -1 : t.hsClass > e.hsClass ? 1 : 0;
        }, ie = function(t, e) {
            return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
        };
        this.traces.bar.classes.sort(ae), this.traces.line.classes.sort(ie), this.traces.line.classes.splice(this.maxLines), 
        this.traces.bar.decks.sort(ae), this.traces.line.decks.sort(ie), this.traces.line.decks.splice(this.maxLines), 
        this.archetypes.sort(ie);
    }
    return _createClass(ne, [ {
        key: "smoothLadder",
        value: function(t, e) {
            var r = [ t[0].slice() ];
            0 == e[0] && (e[0] = 1), 0 == e[1] && (e[1] = 1);
            for (var a, i, n = 1; n < hsRanks - 1; n++) {
                0 == e[n + 1] && (e[n + 1] = 1), 7 < (i = e[n - 1] / e[n]) && (i = 7), 7 < (a = e[n + 1] / e[n]) && (a = 7), 
                n % 5 == 0 && (a = 0), n % 5 == 1 && (i = 0);
                for (var s = 3.5 + a + i, o = [], l = 0; l < t[n].length; l++) {
                    var h = t[n][l] / e[n], d = t[n + 1][l] / e[n + 1], c = t[n - 1][l] / e[n - 1];
                    o.push((3.5 * h + d * a + c * i) / s);
                }
                r.push(o);
            }
            r.push(t[hsRanks - 1].slice());
            for (var u = 0; u < r[0].length; u++) r[0][u] /= e[0];
            for (u = 0; u < t[hsRanks - 1].length; u++) r[hsRanks - 1][u] /= e[hsRanks - 1];
            return r;
        }
    }, {
        key: "plot",
        value: function() {
            document.getElementById("chart1").innerHTML = "", this.window.hideRankFolder(), 
            this.window.setGraphTitle();
            var t = this.window.plotType, e = this.window.layouts[t], r = void 0;
            switch (t) {
              case "pie":
                this.window.showRankFolder(), r = this.traces.pie[this.window.mode][this.window.r];
                break;

              case "number":
                return void this.createTable(this.window.mode);

              case "bar":
                r = this.traces.bar[this.window.mode];
                break;

              case "zoom":
                r = this.traces.zoom[this.window.zoomClass];
                break;

              case "line":
                r = this.traces.line[this.window.mode];
                break;

              case "map":
                this.window.showRankFolder(), r = this.traces.map[this.window.r], this.window.mode = "decks", 
                this.window.renderOptions(), null == r && (r = this.loadMap());
            }
            "portrait" == MOBILE && "pie" != this.window.plotTyp && (e.width = 2 * app.ui.width, 
            e.height = .6 * app.ui.height), Plotly.newPlot("chart1", r, e, {
                displayModeBar: !1
            }), this.annotate(this.window.annotated), this.createLegend(this.window.mode), "bar" != this.window.plotType && "zoom" != this.window.plotType || !PREMIUM || document.getElementById("chart1").on("plotly_click", this.zoomToggle.bind(this));
        }
    }, {
        key: "colorScale",
        value: function(t) {
            var e = this.window.colorScale_c1, r = this.window.colorScale_c2, a = [];
            1 < (t /= this.window.colorScale_f) && (t = 1);
            for (var i = 0; i < 3; i++) a.push(parseInt(e[i] + (r[i] - e[i]) * t));
            return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")";
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e = this.window.plotType;
            if ("pie" != e && "number" != e && "timeline" != e && "map" != e) {
                var r, a = {
                    bar: .5,
                    zoom: .5,
                    line: .05
                }, i = "bar" == e || "zoom" == e ? 90 : 0;
                if (t) {
                    for (var n = [], s = 0; s < hsRanks; s++) {
                        var o = {
                            x: s,
                            y: a[e],
                            xref: "x",
                            yref: "y",
                            textangle: i,
                            text: this.rankSums[s],
                            showarrow: !1,
                            bgcolor: "rgba(0,0,0,0.3)",
                            font: {
                                color: "white"
                            },
                            opacity: .8
                        };
                        n.push(o);
                    }
                    r = {
                        annotations: n
                    };
                } else r = {
                    annotations: []
                };
                Plotly.relayout("chart1", r);
            }
        }
    }, {
        key: "loadMap",
        value: function() {
            var t = this.window.r, e = app.ui.tableWindow.data[this.f][table_times[0]][table_ranks[0]];
            null == e && console.log("ERROR table not loaded for Meta Score"), this.traces.map[t] = [];
            var r = e.table, a = e.archetypes, i = this.archetypes, n = 0, s = 0, o = !0, l = !1, h = void 0;
            try {
                for (var d, c = this.archetypes[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = a.indexOf(u.name);
                    if (-1 != y) {
                        var f = 0, p = 0, v = !0, m = !1, b = void 0;
                        try {
                            for (var k, w = i[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                                var g = k.value, x = a.indexOf(g.name);
                                if (-1 != x) {
                                    var L = r[y][x], C = g.fr_brackets[t];
                                    p += L * C, f += C;
                                }
                            }
                        } catch (t) {
                            m = !0, b = t;
                        } finally {
                            try {
                                !v && w.return && w.return();
                            } finally {
                                if (m) throw b;
                            }
                        }
                        var T = u.fr_brackets[t];
                        p = 0 < f ? p / f : 0, n = Math.max(p, n), s = Math.max(T, s), this.traces.map[t].push({
                            name: u.name,
                            type: "scatter",
                            fr: T,
                            wr: p,
                            hoverinfo: "text",
                            mode: "markers",
                            marker: {
                                size: 15,
                                line: {
                                    size: 0
                                },
                                color: u.color
                            }
                        });
                    }
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            var S = !0, _ = !1, D = void 0;
            try {
                for (var B, W = this.traces.map[t][Symbol.iterator](); !(S = (B = W.next()).done); S = !0) {
                    var M = B.value;
                    M.x = [ (M.wr + n - 1) / (2 * n - 1) ], M.y = [ M.fr / s ];
                    var q = (M.x[0] + M.y[0]) / 2;
                    M.text = "<b>" + M.name + "<br>Meta:</b> " + q.toFixed(2) + "<br><b>WR:</b> " + M.wr.toFixed(2) + " <b>Freq:</b> " + (100 * M.fr).toFixed(0) + "%";
                }
            } catch (t) {
                _ = !0, D = t;
            } finally {
                try {
                    !S && W.return && W.return();
                } finally {
                    if (_) throw D;
                }
            }
            return this.traces.map[t];
        }
    }, {
        key: "createTable",
        value: function(t) {
            var e = 20;
            this.archetypes.length < e && (e = this.archetypes.length), document.getElementById("chart1").innerHTML = "";
            var r = document.createElement("table");
            r.id = "numberTable";
            var a = document.createElement("tr");
            this.download[t] = [ [] ], (u = document.createElement("th")).className = "pivot", 
            u.innerHTML = "Rank &#10148;", u.style.textAlign = "right", u.style.color = "#0000008a", 
            a.appendChild(u), this.download[t] += "Rank%2C";
            for (var i = hsRanks - 1; 0 <= i; i--) {
                (u = document.createElement("th")).innerHTML = 0 < i ? i : "L", a.appendChild(u), 
                this.download[t] += 0 < i ? i : "L", this.download[t] += "%2C";
            }
            if (r.appendChild(a), this.download[t] += "%0A", "decks" == t) for (var n = 0; n < e; n++) {
                var s = this.archetypes[n], o = s.name + "%2C", l = document.createElement("tr");
                (h = document.createElement("td")).className = "pivot", h.style.backgroundColor = s.color, 
                h.style.color = s.fontColor, h.innerHTML = s.name, l.appendChild(h);
                for (i = hsRanks - 1; -1 < i; i--) {
                    (u = document.createElement("td")).style.backgroundColor = this.colorScale(s.fr_ranks[i]), 
                    u.innerHTML = (100 * s.fr_ranks[i]).toFixed(1) + "%", l.appendChild(u), o += s.fr_ranks[i] + "%2C";
                }
                r.appendChild(l), this.download[t] += o + "%0A";
            }
            if ("classes" == t) for (n = 0; n < 9; n++) {
                var h, d = hsClasses[n], c = this.classFr[d];
                o = d + "%2C", l = document.createElement("tr");
                (h = document.createElement("td")).className = "pivot", h.style.backgroundColor = hsColors[d], 
                h.style.color = hsFontColors[d], h.innerHTML = d, l.appendChild(h);
                for (i = hsRanks - 1; -1 < i; i--) {
                    var u;
                    (u = document.createElement("td")).style.backgroundColor = this.colorScale(c[i]), 
                    u.innerHTML = (100 * c[i]).toFixed(1) + "%", l.appendChild(u), o += c[i] + "%2C";
                }
                r.appendChild(l), this.download[t] += o + "%0A";
            }
            document.getElementById("chart1").appendChild(r), this.createNumbersFooter();
        }
    }, {
        key: "createLegend",
        value: function(t) {
            if ("zoom" != this.window.plotType) {
                this.window.clearChartFooter();
                var e = this.archetypes, r = "classes" == t ? this.maxLegendEntries : 9;
                r > e.length && (r = e.length);
                var a = !0, i = !1, n = void 0;
                try {
                    for (var s, o = range(0, r)[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                        var l = s.value;
                        "classes" == t && this.window.addLegendItem(hsClasses[l]), "decks" == t && this.window.addLegendItem(e[l].name);
                    }
                } catch (t) {
                    i = !0, n = t;
                } finally {
                    try {
                        !a && o.return && o.return();
                    } finally {
                        if (i) throw n;
                    }
                }
            } else this.createZoomLegend();
        }
    }, {
        key: "createZoomLegend",
        value: function() {
            var t = this.window.zoomClass;
            this.window.clearChartFooter();
            var e = !0, r = !1, a = void 0;
            try {
                for (var i, n = this.traces.zoom[t][Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value;
                    0 < s.fr_avg && this.window.addLegendItem(s.name);
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
        }
    }, {
        key: "createNumbersFooter",
        value: function() {
            for (var t = document.querySelector("#ladderWindow .chart-footer"); t.firstChild; ) t.removeChild(t.firstChild);
            if (PREMIUM) {
                var e = document.createElement("button");
                e.innerHTML = "Download <div class='fa fa-cloud-download'></div>", e.className = "download", 
                e.addEventListener("click", this.downloadCSV.bind(this)), t.appendChild(e);
            }
        }
    }, {
        key: "downloadCSV",
        value: function() {
            var t = document.createElement("a");
            t.setAttribute("href", "data:text/plain;charset=utf-8," + this.download[this.window.mode]), 
            t.setAttribute("download", "ladder.csv"), t.style.display = "none", document.body.appendChild(t), 
            t.click(), document.body.removeChild(t);
        }
    }, {
        key: "zoomToggle",
        value: function(t) {
            if ("zoom" == this.window.plotType) return this.window.plotType = "bar", void this.plot();
            this.window.plotType = "zoom";
            var e = t.points[0].data.hsClass;
            if (-1 == hsClasses.indexOf(e)) {
                var r = !0, a = !1, i = void 0;
                try {
                    for (var n, s = hsClasses[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                        var o = n.value;
                        if (-1 != e.indexOf(o)) {
                            this.window.zoomClass = o;
                            break;
                        }
                    }
                } catch (t) {
                    a = !0, i = t;
                } finally {
                    try {
                        !r && s.return && s.return();
                    } finally {
                        if (a) throw i;
                    }
                }
            } else this.window.zoomClass = e;
            this.plot();
        }
    } ]), ne;
}(), LadderWindow = function() {
    function y(t) {
        _classCallCheck(this, y), this.name = "ladderWindow", this.div = document.querySelector("#ladderWindow"), 
        this.tab = document.querySelector("#ladder.tab"), this.chartDiv = document.querySelector("#ladderWindow #chart1"), 
        this.classDeckOptions = document.querySelector("#ladderWindow .content-header .classDeckOptions"), 
        this.nrGamesBtn = document.querySelector("#ladderWindow .content-header #showNumbers"), 
        this.graphTitle = document.querySelector("#ladderWindow .graphTitle"), this.graphLabel = document.querySelector("#ladderWindow .graphLabel"), 
        this.rankFolder = document.querySelector("#ladderWindow .content-header #rankFolder"), 
        this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn"), this.questionBtn = document.querySelector("#ladderWindow .question"), 
        this.overlayDiv = document.querySelector("#ladderWindow .overlay"), this.overlayP = document.querySelector("#ladderWindow .overlayText"), 
        this.chartFooter = document.querySelector("#ladderWindow .chart-footer"), this.firebasePath = PREMIUM ? "premiumData/ladderData" : "data/ladderData", 
        this.firebaseHistoryPath = PREMIUM ? "premiumData/historyData" : "", this.overlayText = {}, 
        this.overlayText.bar = "\n        This stacked bar graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Tips:<br><br>\n        • Hover over the 'number of games' label in the header to display the number of games per rank on the bar plot.<br><br>\n        • Click on one bar of any class to 'zoom in' to display all the archetypes of that class. Click again to 'zoom out'.<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.zoom = this.overlayText.bar, this.overlayText.line = "\n        This line graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.pie = "\n        This pie graph displays the class/ deck frequencies as pie slices. You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.number = "\n        This table displays the class/ deck frequencies over ladder ranks (rank 20 - Legend). You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Click on the \"download\" button at the bottom of the graph to download the data as '.csv' file.<br><br>\n        ", 
        this.overlayText.timeline = "\n        This line graph displays the class/ deck frequencies on the y-axis and time (in hours or days) on the x-axis.<br><br>\n        If you choose 'Last Day', 'Last 6 Hours' or 'Last 12 Hours' the time unit is in 'Hours' whereas for 'Last 3 Days' etc. it's in 'Days'.<br><br>\n        The 'Hours' lines have been averaged between +/- 1 Hour to make for a smoother curve.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.map = "\n        The VS Meta Score aims to give a broad overview over the current state of the ladder meta.<br><br>\n        Each archetype is represented as a colored dot and plotted according to its winrate (x-axis) and frequency (y-axis).\n        Both axis are scaled from 0 to 1.<br><br> \n        &#8226 Frequency is scaled from 0% of the meta (0 on the plot) to the highest frequency of any archetype (1 on the plot) <br><br>\n        &#8226 Winrates are scaled from the highest winrate among all archetypes (1 on the plot) to 50% - delta where delta is the \n        distance of the highest winrate above 50%<br><br>\n        ", 
        this.fontColor = "#222", this.fontColorLight = "#999", this.overlay = !1, this.annotated = !1, 
        this.colorScale_c1 = [ 255, 255, 255 ], this.colorScale_c2 = [ 87, 125, 186 ], this.colorScale_f = .15, 
        this.data = {}, this.hsFormats = hsFormats, this.hsTimes = PREMIUM ? ladder_times_premium : ladder_times, 
        this.ranks = PREMIUM ? ladder_ranks_premium : ladder_ranks, this.layouts = {}, this.f = "Standard", 
        this.t = "lastDay", this.r = "ranks_all", this.plotType = "bar", this.plotTypes = [ "bar", "line", "pie", "number", "timeline" ], 
        this.mode = "classes", this.fullyLoaded = !1, this.history = {};
        var e = !(this.zoomClass = null), r = !1, a = void 0;
        try {
            for (var i, n = this.hsFormats[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                var s = i.value;
                this.data[s] = {
                    fullyLoaded: !1
                }, this.history[s] = {
                    fullyLoaded: !1
                };
                var o = !0, l = !1, h = void 0;
                try {
                    for (var d, c = this.hsTimes[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        var u = d.value;
                        this.data[s][u] = null;
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
            }
        } catch (t) {
            r = !0, a = t;
        } finally {
            try {
                !e && n.return && n.return();
            } finally {
                if (r) throw a;
            }
        }
        console.log("load ladder:"), this.loadData(this.f, t), this.setupUI(), this.renderOptions();
    }
    return _createClass(y, [ {
        key: "setupUI",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.optionButtons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    (T = a.value).addEventListener("click", this.buttonTrigger.bind(this));
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            this.setupLayouts(), this.dropdownFolders = {
                format: document.querySelector("#ladderWindow #formatFolder .dropdown"),
                time: document.querySelector("#ladderWindow #timeFolder .dropdown"),
                rank: document.querySelector("#ladderWindow #rankFolder .dropdown")
            };
            var n = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var s in this.dropdownFolders) {
                var o = this.dropdownFolders[s];
                o.innerHTML = "", o.onmouseout = n;
            }
            var l = !0, h = !1, d = void 0;
            try {
                for (var c, u = this.hsFormats[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                    var y = c.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = y, 
                    T.id = y;
                    T.onclick = function(t) {
                        this.f = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.format.appendChild(T);
                }
            } catch (t) {
                h = !0, d = t;
            } finally {
                try {
                    !l && u.return && u.return();
                } finally {
                    if (h) throw d;
                }
            }
            var f = !0, p = !1, v = void 0;
            try {
                for (var m, b = this.hsTimes[Symbol.iterator](); !(f = (m = b.next()).done); f = !0) {
                    var k = m.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = btnIdToText[k], 
                    T.id = k;
                    T.onclick = function(t) {
                        this.t = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.time.appendChild(T);
                }
            } catch (t) {
                p = !0, v = t;
            } finally {
                try {
                    !f && b.return && b.return();
                } finally {
                    if (p) throw v;
                }
            }
            var w = !0, g = !1, x = void 0;
            try {
                for (var L, C = this.ranks[Symbol.iterator](); !(w = (L = C.next()).done); w = !0) {
                    var T, S = L.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = btnIdToText[S], 
                    T.id = S;
                    T.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.rank.appendChild(T);
                }
            } catch (t) {
                g = !0, x = t;
            } finally {
                try {
                    !w && C.return && C.return();
                } finally {
                    if (g) throw x;
                }
            }
            var _ = PREMIUM ? "flex" : "none";
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.classDeckOptions.style.display = _, document.querySelector("#ladderWindow .content-header .graphOptions #line").style.display = "none", 
            document.querySelector("#ladderWindow .content-header .graphOptions #timeline").style.display = _, 
            this.nrGamesBtn.onclick = this.annotate.bind(this), this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn");
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (app.path.hsFormat = this.f, 
            this.div.style.display = "none");
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = null != t;
            if (!this.data[this.f].fullyLoaded) {
                return !!e && this.loadData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if ("map" == this.plotType && !app.ui.tableWindow.data[this.f].fullyLoaded) {
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if ("timeline" == this.plotType && !this.history[this.f].fullyLoaded && PREMIUM) {
                return !!e && this.loadHistoryData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if (this.data[this.f].fullyLoaded) return !e || t.apply(this);
        }
    }, {
        key: "loadData",
        value: function(e, r) {
            this.fullyLoaded = !1;
            app.fb_db.ref(this.firebasePath + "/" + e).on("value", function(t) {
                this.readData(t, e, r);
            }.bind(this), function(t) {
                return console.log("Could not load Ladder Data", t);
            });
        }
    }, {
        key: "loadHistoryData",
        value: function(e, r) {
            if (PREMIUM) {
                app.fb_db.ref(this.firebaseHistoryPath + "/" + e).on("value", function(t) {
                    this.readHistoryData(t, e, r);
                }.bind(this), function(t) {
                    return console.log("Could not load history data", t);
                });
            }
        }
    }, {
        key: "readData",
        value: function(t, e, r) {
            if (!this.fullyLoaded) {
                console.log("read data");
                var a = t.val(), i = !0, n = !1, s = void 0;
                try {
                    for (var o, l = this.hsTimes[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                        var h = o.value;
                        this.data[e][h] = new Ladder(a[h], e, h, this);
                    }
                } catch (t) {
                    n = !0, s = t;
                } finally {
                    try {
                        !i && l.return && l.return();
                    } finally {
                        if (n) throw s;
                    }
                }
                this.fullyLoaded = !0, this.data[e].fullyLoaded = !0, console.log("ladder loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                app.ui.hideLoader(), r.apply(this), this.plot();
            }
        }
    }, {
        key: "readHistoryData",
        value: function(t, e, r) {
            this.history[e] = new History(t.val(), this), r.apply(this);
        }
    }, {
        key: "plot",
        value: function() {
            switch (this.plotType) {
              case "bar":
                this.nrGamesBtn.style.display = "flex", PREMIUM || (this.classDeckOptions.style.display = "none", 
                this.mode = "classes");
                break;

              case "line":
                this.nrGamesBtn.style.display = "flex";
                break;

              case "pie":
                this.nrGamesBtn.style.display = "none", PREMIUM || (this.classDeckOptions.style.display = "flex");
                break;

              case "number":
                this.nrGamesBtn.style.display = "none", PREMIUM || (this.classDeckOptions.style.display = "none", 
                this.mode = "classes");
                break;

              case "map":
                this.nrGamesBtn.style.display = "none";
                break;

              case "timeline":
                this.nrGamesBtn.style.display = "flex";
            }
            if (this.renderOptions(), !this.checkLoadData()) {
                return this.checkLoadData(function(t) {
                    app.ui.ladderWindow.plot();
                });
            }
            "timeline" == this.plotType ? this.current = this.history[this.f] : this.current = this.data[this.f][this.t], 
            this.current.plot();
        }
    }, {
        key: "annotate",
        value: function() {
            "pie" != this.plotType && "number" != this.plotType && (this.annotated ? ("timeline" == this.plotType ? this.history[this.f].annotate(!1) : this.data[this.f][this.t].annotate(!1), 
            this.nrGamesBtn.classList.remove("highlighted")) : ("timeline" == this.plotType ? this.history[this.f].annotate(!0) : this.data[this.f][this.t].annotate(!0), 
            this.nrGamesBtn.classList.add("highlighted")), this.annotated = !this.annotated);
        }
    }, {
        key: "showGames",
        value: function() {
            "bar" != this.plotType && "zoom" != this.plotType && "line" != this.plotType || this.data[this.f][this.t].annotate(!0);
        }
    }, {
        key: "hideGames",
        value: function() {
            this.annotated || this.data[this.f][this.t].annotate(!1);
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "classes" == e && (this.mode = "classes"), "decks" == e && (this.mode = "decks"), 
            "bar" == e && (this.plotType = "bar"), "line" == e && (this.plotType = "line"), 
            "pie" == e && (this.plotType = "pie"), "number" == e && (this.plotType = "number"), 
            "map" == e && (this.plotType = "map"), "timeline" == e && (this.plotType = "timeline"), 
            "wr" == e && (this.history.mode = "wr"), "fr" == e && (this.history.mode = "fr"), 
            "zoom" == this.plotType && "classes" != this.mode && (this.plotType = "bar"), this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.optionButtons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    var n = a.value;
                    n.classList.remove("highlighted"), n.id == this.mode && n.classList.add("highlighted"), 
                    n.id == this.plotType && n.classList.add("highlighted"), "nrGames" == n.id && this.annotated && n.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            document.querySelector("#ladderWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#ladderWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#ladderWindow #rankBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r];
        }
    }, {
        key: "showRankFolder",
        value: function() {
            this.rankFolder.style.display = "inline";
        }
    }, {
        key: "hideRankFolder",
        value: function() {
            this.rankFolder.style.display = "none";
            var t = document.querySelector("#ladderWindow #rankDropdown");
            t.classList.contains("hidden") || t.classList.add("hidden");
        }
    }, {
        key: "setGraphTitle",
        value: function() {
            var t = "classes" == this.mode ? "Class" : "Deck", e = ([ "lastDay", "last6Hours", "last12Hours" ].indexOf(this.t), 
            btnIdToText[this.r]), r = this.data[this.f][this.t], a = "<span style='font-size: 80%'> ( " + ("pie" != this.plotType ? r.totGames : r.totGamesBrackets[this.r]).toLocaleString() + " games )</span>";
            switch (this.plotType) {
              case "bar":
                this.graphTitle.innerHTML = "Class Frequency vs Ranks" + a, this.graphLabel.innerHTML = "Ranks &#10148;";
                break;

              case "zoom":
                this.graphTitle.innerHTML = this.zoomClass + " Deck Frequency vs Ranks" + a, this.graphLabel.innerHTML = "Ranks >";
                break;

              case "line":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks" + a, this.graphLabel.innerHTML = "Ranks &#10148;";
                break;

              case "pie":
                this.graphTitle.innerHTML = t + " Frequency of " + e + a, this.graphLabel.innerHTML = "";
                break;

              case "number":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks" + a, this.graphLabel.innerHTML = "";
                break;

              case "timeline":
                this.graphTitle.innerHTML = t + " Frequency over Time" + a, this.graphLabel.innerHTML = "";
                break;

              case "map":
                this.graphTitle.innerHTML = "Meta Score" + a, this.graphLabel.innerHTML = "";
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0, this.overlayP.innerHTML = this.overlayText[this.plotType]);
        }
    }, {
        key: "addLegendItem",
        value: function(t) {
            var e = document.createElement("div"), r = (document.createElement("div"), document.createElement("l"), 
            app.ui.getArchColor(null, t, this.f));
            e.className = "legend-item", e.style.color = r.fontColor, e.style.backgroundColor = r.color, 
            e.id = t, e.innerHTML = t, e.onclick = function(t) {
                null != app.ui.decksWindow && (app.path.hsFormat = this.f, app.ui.deckLink(t.target.id));
            }, this.chartFooter.appendChild(e);
        }
    }, {
        key: "clearChartFooter",
        value: function() {
            for (;this.chartFooter.firstChild; ) this.chartFooter.removeChild(this.chartFooter.firstChild);
        }
    }, {
        key: "setupLayouts",
        value: function() {
            var t = [], e = !0, r = !1, a = void 0;
            try {
                for (var i, n = range(0, hsRanks)[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value, o = s % 5 == 0 ? s + "  " : "";
                    t.push(o);
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
            t[0] = "L", this.layouts.bar = {
                barmode: "stack",
                showlegend: !1,
                displayModeBar: !1,
                hovermode: "closest",
                annotations: [],
                xaxis: {
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    },
                    visible: !0,
                    showgrid: !1,
                    tickvals: range(0, hsRanks),
                    ticktext: t,
                    ticklen: 5,
                    tickcolor: "transparent",
                    hoverformat: ".1%",
                    range: [ 21, -1 ],
                    color: this.fontColor,
                    fixedrange: !0,
                    zeroline: !1,
                    autorange: "reversed"
                },
                yaxis: {
                    title: "[ % ]  of  Meta",
                    showgrid: !1,
                    tickfont: {
                        family: "Arial, bold",
                        size: 16
                    },
                    ticklen: 5,
                    tickcolor: "transparent",
                    showticklabels: !1,
                    fixedrange: !0,
                    zeroline: !1,
                    color: this.fontColorLight,
                    tickformat: ",.0%",
                    hoverformat: ",.0%",
                    visible: !MOBILE
                },
                plot_bgcolor: "transparent",
                paper_bgcolor: "transparent",
                margin: MOBILE ? {
                    l: 10,
                    r: 10,
                    b: 35,
                    t: 0
                } : {
                    l: 60,
                    r: 30,
                    b: 35,
                    t: 0
                }
            }, this.layouts.line = {
                showlegend: !1,
                displayModeBar: !1,
                autosize: !0,
                hovermode: "closest",
                xaxis: {
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    },
                    visible: !0,
                    showgrid: !0,
                    tickvals: range(0, hsRanks),
                    ticktext: t,
                    hoverformat: ".1%",
                    range: [ 21, -1 ],
                    color: this.fontColor,
                    fixedrange: !0,
                    zeroline: !1,
                    autorange: "reversed"
                },
                yaxis: {
                    tickfont: {
                        family: "Arial, bold",
                        size: 19
                    },
                    showgrid: !0,
                    ticklen: 12,
                    tickcolor: "transparent",
                    tickformat: ",.0%",
                    fixedrange: !0,
                    color: this.fontColorLight
                },
                plot_bgcolor: "transparent",
                paper_bgcolor: "transparent",
                margin: MOBILE ? {
                    l: 60,
                    r: 10,
                    b: 50,
                    t: 0
                } : {
                    l: 75,
                    r: 20,
                    b: 30,
                    t: 0
                }
            }, this.layouts.pie = {
                showlegend: !1,
                displayModeBar: !1,
                autosize: !0,
                textinfo: "label+percent",
                hovermode: "closest",
                plot_bgcolor: "transparent",
                paper_bgcolor: "transparent",
                margin: {
                    l: 70,
                    r: 20,
                    b: 30,
                    t: 30
                }
            };
            var l = {
                color: "rgba(50,50,50,0.5)",
                width: 1.5,
                opacity: .5,
                dash: "dot"
            }, h = {
                color: "rgba(50,50,50,0.5)",
                width: 1.5,
                opacity: .5
            };
            this.layouts.map = {
                showlegend: !1,
                hovermode: "closest",
                displayModeBar: !1,
                autosize: !0,
                margin: MOBILE ? {
                    l: 10,
                    r: 10,
                    b: 35,
                    t: 0
                } : {
                    l: 60,
                    r: 30,
                    b: 50,
                    t: 0
                },
                xaxis: {
                    range: [ 0, 1.05 ],
                    title: "Power Score",
                    zeroline: !1,
                    fixedrange: !0,
                    tickvals: [ 0, .25, .5, .75, 1 ],
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    }
                },
                yaxis: {
                    range: [ 0, 1.05 ],
                    title: "Frequency Score",
                    zeroline: !1,
                    fixedrange: !0,
                    tickvals: [ 0, .25, .5, .75, 1 ],
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    }
                },
                plot_bgcolor: "transparent",
                paper_bgcolor: "transparent",
                shapes: [ {
                    type: "line",
                    x0: .5,
                    x1: .5,
                    y0: 0,
                    y1: 1,
                    line: l
                }, {
                    type: "line",
                    x0: 1,
                    x1: 1,
                    y0: 0,
                    y1: 1,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: .5,
                    y1: .5,
                    line: l
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: 1,
                    y1: 1,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 0,
                    y0: 0,
                    y1: 1,
                    line: h
                } ]
            }, this.layouts.number = {}, this.layouts.zoom = this.layouts.bar;
        }
    } ]), y;
}(), DISCORDLINK = "https://discordapp.com/invite/0oxwpa5Mtc2VA2xC", POLLLINK = "https://docs.google.com/forms/d/e/1FAIpQLSel6ym_rJHduxkgeimzf9HdNbBMB5Kak7Fmk0Bl2O7O8XhVGg/viewform?usp=sf_link", VSGOLDINFOLINK = "https://www.vicioussyndicate.com/membership/vs-gold/", overlayText1 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem;'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nUpgrade to vS Gold to visit the gold version of this app. Check the link more information:<br><br><br>\n\n<button id='basicBtn'>BASIC</button>\n<img src='Images/arrow.png' class='arrow'>\n<a href=" + VSGOLDINFOLINK + " target=\"_blank\">\n<button id='premiumBtn'>GOLD</button>\n</a>\n\n<br><br>\n\n<b class='marker'>Update:</b> VS Live version <b>2.0</b> has launched. Head on to the info tab to find out more.<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n', overlayText2 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\n<b class='marker'>Update:</b> VS Live version <b>2.0</b> has launched. Head on to the info tab to find out more.<br><br>\n\nThank you for using vS Live Gold.\n\n<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n', ladder_times = [ "lastDay", "last2Weeks" ], ladder_times_premium = [ "lastDay", "last3Days", "lastWeek", "last2Weeks" ], ladder_ranks = [ "ranks_all" ], ladder_ranks_premium = [ "ranks_all", "ranks_L", "ranks_1_4", "ranks_5_14" ], ladder_plotTypes = [], table_times = [ "last2Weeks" ], table_times_premium = [ "last3Days", "lastWeek", "last2Weeks" ], table_sortOptions = [ "frequency", "winrate" ], table_sortOptions_premium = [ "frequency", "winrate", "matchup" ], table_numArch = 16, table_ranks = [ "ranks_all" ], table_ranks_premium = [ "ranks_all", "ranks_l", "ranks_l_d4", "ranks_l_d10", "ranks_l_p" ], MU_COLOR_IDX = 0, hsRanks = 21, hsClasses = [ "DemonHunter", "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ], hsFormats = [ "Standard", "Wild" ], rankRange = {
    ranks_all: [ 0, 20 ],
    ranks_L: [ 0, 0 ],
    ranks_1_5: [ 1, 5 ],
    ranks_1_4: [ 1, 4 ],
    ranks_L_5: [ 0, 5 ],
    ranks_6_15: [ 6, 15 ],
    ranks_5_14: [ 5, 14 ]
}, cardDust = {
    Free: 0,
    Basic: 0,
    Common: 40,
    Rare: 100,
    Epic: 400,
    Legendary: 1600
}, btnIdToText = {
    Standard: "Standard",
    Wild: "Wild",
    ranks_all: "All Ranks",
    ranks_L: "Legend Ranks",
    ranks_1_4: "Ranks 1-4",
    ranks_1_5: "Ranks 1-5",
    ranks_L_5: "Ranks L-5",
    ranks_6_15: "Ranks 6-15",
    ranks_5_14: "Ranks 5-14",
    ranks_l: "Legend Ranks",
    ranks_l_d4: "Ranks L-D4",
    ranks_l_d10: "Ranks L-D10",
    ranks_l_p: "Ranks L-P",
    last6Hours: "Last 6 Hours",
    last12Hours: "Last 12 Hours",
    lastDay: "Last Day",
    last3Days: "Last 3 Days",
    lastWeek: "Last Week",
    last2Weeks: "Last 2 Weeks",
    last3Weeks: "Last 3 Weeks",
    lastMonth: "Last Month",
    class: "By Class",
    frequency: "By Frequency",
    winrate: "By Winrate",
    matchup: "By Matchup",
    frSubplot: "Frequency",
    wrSubplot: "Winrate",
    classes: "Classes",
    decks: "Archetypes"
}, btnIdToText_m = {
    Standard: "Std",
    Wild: "Wild",
    ranks_all: "R: All",
    ranks_L: "R: L",
    ranks_1_5: "R: 1-5",
    ranks_L_5: "R: L-5",
    ranks_6_15: "R: 6-15",
    last6Hours: "6 Hours",
    last12Hours: "12 Hours",
    lastDay: "1 Day",
    last3Days: "3 Days",
    lastWeek: "1 Week",
    last2Weeks: "2 Weeks",
    last3Weeks: "3 Weeks",
    lastMonth: "1 Month",
    class: "Class",
    frequency: "Freq.",
    winrate: "Wr",
    matchup: "Mu",
    frSubplot: "Frequency",
    wrSubplot: "Winrate",
    classes: "Classes",
    decks: "Archetypes"
}, hsColors = {
    DemonHunter: "#689f38",
    Druid: "#795548",
    Hunter: "#689f38",
    Mage: "#4fc3f7",
    Paladin: "#ffee58",
    Priest: "#bdbdbb",
    Rogue: "#424242",
    Shaman: "#5c6bc0",
    Warlock: "#9c27b0",
    Warrior: "#f44336"
}, hsArchColors = {
    DemonHunter: [ "#67b35f", "#329c50", "#abda48", "#bce86a", "#1f7922" ],
    Druid: [ "#3d2a25", "#694f3f", "#543f33", "#b88230", "#d39e48" ],
    Hunter: [ "#67b35f", "#329c50", "#abda48", "#bce86a", "#1f7922" ],
    Mage: [ "#22abb1", "#74d8dd", "#38ccd8", "#a4dadc", "#b5eef0" ],
    Paladin: [ "#ffda74", "#ffc42e", "#ffee58", "#fbffaa", "#ff8f00" ],
    Priest: [ "#95a482", "#bfc6b1", "#9eb5a5", "#cad3be", "#e3e6dd" ],
    Rogue: [ "#3e4447", "#2a3231", "#4d5c5a", "#5e716f", "#0e1413" ],
    Shaman: [ "#002b8d", "#0074be", "#0052b4", "#009ec7", "#00b6e5" ],
    Warlock: [ "#d95dab", "#470f26", "#902661", "#591c55", "#c33891" ],
    Warrior: [ "#ba1419", "#f83f4a", "#ec191d", "#ea5e53", "#fc736b" ]
}, hsFontColors = {
    DemonHunter: "#222",
    Druid: "#fff",
    Hunter: "#222",
    Mage: "#222",
    Paladin: "#222",
    Priest: "#222",
    Rogue: "#fff",
    Shaman: "#fff",
    Warlock: "#fff",
    Warrior: "#fff",
    Other: "#88042d",
    "": "#88042d",
    "§": "#88042d"
}, PowerWindow = function() {
    function L() {
        _classCallCheck(this, L), this.name = "powerWindow", this.div = document.querySelector("#powerWindow"), 
        this.tab = document.querySelector("#power.tab"), this.grid = document.querySelector("#powerGrid"), 
        this.optionButtons = document.querySelectorAll("#powerWindow .optionBtn"), this.questionBtn = document.querySelector("#powerWindow .question"), 
        this.overlayDiv = document.querySelector("#powerWindow .overlay"), this.overlayP = document.querySelector("#powerWindow .overlayText"), 
        this.f = "Standard", this.r = "0_15", this.mode = "brackets", this.t_ladder = {
            Standard: "last3Days",
            Wild: "lastWeek"
        }, this.t_ladder_old = {
            Standard: "lastWeek",
            Wild: "last2Weeks"
        }, PREMIUM || (this.t_ladder.Standard = "lastDay"), this.t_table = "last2Weeks", 
        this.maxElementsPerRank = 5, this.maxElementsPerBracket = PREMIUM ? 16 : 5, this.minGames = 50, 
        this.overlayText = "\n            This tab displays the best decks to be played in the respective rank brackets.<br><br>\n            <span class='optionBtn'>Tier Lists</span> shows the top 16 decks across specific rank brackets ('All Ranks', 'Rank 1-5' etc.).<br><br>\n            <span class='optionBtn'>Ranks</span> shows the top 5 decks for every single rank until rank 20.<br><br>\n            <span class='optionBtn'>Trends</span> shows the trends in frequency and winrate of the last 3 days vs the last week<br><br>\n            The winrates are calculated by using the deck frequencies of the last 3 days and the matchup table of the last 2 weeks.<br><br>\n            If there are fewer than " + this.minGames + ' games in the respective category no data is displayed instead.<br><br>\n            Click on a deck to get to it\'s deck list in the "Decks" tab.<br><br>        \n        ';
        var t = !0, e = !(this.rankData = {
            rankSums: {},
            fullyLoaded: {}
        }), r = void 0;
        try {
            for (var a, i = hsFormats[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                var n = a.value;
                this.rankData[n] = [];
                var s = !0, o = !1, l = void 0;
                try {
                    for (var h, d = range(0, hsRanks)[Symbol.iterator](); !(s = (h = d.next()).done); s = !0) {
                        h.value;
                        this.rankData[n].push([]);
                    }
                } catch (t) {
                    o = !0, l = t;
                } finally {
                    try {
                        !s && d.return && d.return();
                    } finally {
                        if (o) throw l;
                    }
                }
                this.rankData.rankSums[n] = [], this.rankData.fullyLoaded[n] = !1;
            }
        } catch (t) {
            e = !0, r = t;
        } finally {
            try {
                !t && i.return && i.return();
            } finally {
                if (e) throw r;
            }
        }
        this.bracketData = {}, this.rankBrackets = [ {
            name: "All Ranks",
            games: {},
            start: 0,
            end: 15
        }, {
            name: "L",
            games: {},
            start: 0,
            end: 0
        }, {
            name: "1-4",
            games: {},
            start: 1,
            end: 4
        }, {
            name: "5-15",
            games: {},
            start: 5,
            end: 15
        } ], this.trendSort_fr = 0;
        var c = !(this.trendSort_wr = 0), u = !1, y = void 0;
        try {
            for (var f, p = hsFormats[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                var v = f.value;
                this.bracketData[v] = {};
                var m = !0, b = !1, k = void 0;
                try {
                    for (var w, g = this.rankBrackets[Symbol.iterator](); !(m = (w = g.next()).done); m = !0) {
                        var x = w.value;
                        x.games[v] = 0, this.bracketData[v][x.name] = [];
                    }
                } catch (t) {
                    b = !0, k = t;
                } finally {
                    try {
                        !m && g.return && g.return();
                    } finally {
                        if (b) throw k;
                    }
                }
            }
        } catch (t) {
            u = !0, y = t;
        } finally {
            try {
                !c && p.return && p.return();
            } finally {
                if (u) throw y;
            }
        }
        this.overlay = !1, this.addData(this.f, function(t) {}), this.setupUI(), this.renderOptions();
    }
    return _createClass(L, [ {
        key: "setupUI",
        value: function() {
            for (var t = 0; t < this.optionButtons.length; t++) this.optionButtons[t].addEventListener("click", this.buttonTrigger.bind(this));
            var e = PREMIUM ? "inline" : "none";
            document.querySelector("#powerWindow .content-header #brackets").style.display = e, 
            document.querySelector("#powerWindow .content-header #trends").style.display = e;
            this.questionBtn.onclick = this.toggleOverlay.bind(this), this.overlayDiv.onclick = this.toggleOverlay.bind(this), 
            this.rankFolder = document.querySelector("#powerWindow #rankFolder");
            var r = document.querySelector("#powerWindow #rankFolder .dropdown"), a = !0, i = !(r.onmouseout = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            }), n = void 0;
            try {
                for (var s, o = this.rankBrackets[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                    var l = s.value, h = document.createElement("button");
                    h.className = "optionBtn folderBtn", h.innerHTML = l.name, h.id = l.start + "_" + l.end;
                    h.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), r.appendChild(h);
                }
            } catch (t) {
                i = !0, n = t;
            } finally {
                try {
                    !a && o.return && o.return();
                } finally {
                    if (i) throw n;
                }
            }
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "Standard" == e && (this.f = "Standard"), "Wild" == e && (this.f = "Wild"), "ranks" == e && (this.mode = "ranks"), 
            "brackets" == e && (this.mode = "brackets"), "trends" == e && (this.mode = "trends"), 
            this.plot(), this.renderOptions();
        }
    }, {
        key: "pressButton",
        value: function(t) {
            if (null != app.ui.decksWindow) {
                t.target.className;
                switch (t.target.id) {
                  case "wr":
                  case "d_wr":
                    return this.trendSort_wr = (this.trendSort_wr + 1) % 4, void this.plot();

                  case "fr":
                  case "d_fr":
                    return this.trendSort_fr = (this.trendSort_fr + 1) % 4, void this.plot();
                }
                app.path.hsFormat = this.f, app.ui.deckLink(t.target.id);
            }
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.optionButtons[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    var n = a.value;
                    n.classList.remove("highlighted"), n.id == this.mode && n.classList.add("highlighted"), 
                    n.id == this.f && n.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            this.rankFolder.style.display = "trends" == this.mode ? "inline" : "none";
        }
    }, {
        key: "addData",
        value: function(t, e) {
            var r = app.ui.ladderWindow.data[t][this.t_ladder[t]], a = app.ui.ladderWindow.data[t][this.t_ladder_old[t]], i = app.ui.tableWindow.data[t][this.t_table].ranks_all, n = r.archetypes, s = i.archetypes, o = i.table, l = (app.ui.ladderWindow.data[t][this.t_ladder[t]].rankSums, 
            a.archetypes);
            this.rankData.rankSums[t] = app.ui.ladderWindow.data[t][this.t_ladder[t]].rankSums;
            var h = !0, d = !1, c = void 0;
            try {
                for (var u, y = range(0, hsRanks)[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                    var f = u.value, p = !0, v = !1, m = void 0;
                    try {
                        for (var b, k = this.rankBrackets[Symbol.iterator](); !(p = (b = k.next()).done); p = !0) {
                            var w = b.value;
                            w.start <= f && w.end >= f && (w.games[t] += this.rankData.rankSums[t][f]);
                        }
                    } catch (t) {
                        v = !0, m = t;
                    } finally {
                        try {
                            !p && k.return && k.return();
                        } finally {
                            if (v) throw m;
                        }
                    }
                }
            } catch (t) {
                d = !0, c = t;
            } finally {
                try {
                    !h && y.return && y.return();
                } finally {
                    if (d) throw c;
                }
            }
            var g = !0, x = !1, L = void 0;
            try {
                for (var C, T = n[Symbol.iterator](); !(g = (C = T.next()).done); g = !0) {
                    var S = C.value, _ = s.indexOf(S.name);
                    if (-1 != _) {
                        var D = !1, B = !0, W = !1, M = void 0;
                        try {
                            for (var q, I = l[Symbol.iterator](); !(B = (q = I.next()).done); B = !0) {
                                var E = q.value;
                                E.name != S.name || (D = E);
                            }
                        } catch (t) {
                            W = !0, M = t;
                        } finally {
                            try {
                                !B && I.return && I.return();
                            } finally {
                                if (W) throw M;
                            }
                        }
                        var F = !0, R = !1, A = void 0;
                        try {
                            for (var H, O = range(0, hsRanks)[Symbol.iterator](); !(F = (H = O.next()).done); F = !0) {
                                var P = H.value, z = 0, N = 0, G = 0, U = 0, X = !0, Y = !1, V = void 0;
                                try {
                                    for (var K, j = n[Symbol.iterator](); !(X = (K = j.next()).done); X = !0) {
                                        var Z = K.value, J = s.indexOf(Z.name);
                                        if (-1 != J) {
                                            var Q = Z.fr_ranks[P], $ = o[_][J];
                                            z += Q, N += Q * $;
                                        }
                                    }
                                } catch (t) {
                                    Y = !0, V = t;
                                } finally {
                                    try {
                                        !X && j.return && j.return();
                                    } finally {
                                        if (Y) throw V;
                                    }
                                }
                                var tt = !0, et = !1, rt = void 0;
                                try {
                                    for (var at, it = l[Symbol.iterator](); !(tt = (at = it.next()).done); tt = !0) {
                                        var nt = at.value;
                                        if (D) {
                                            var st = s.indexOf(nt.name);
                                            if (-1 != st) {
                                                var ot = nt.fr_ranks[P], lt = o[_][st];
                                                G += ot, U += ot * lt;
                                            }
                                        }
                                    }
                                } catch (t) {
                                    et = !0, rt = t;
                                } finally {
                                    try {
                                        !tt && it.return && it.return();
                                    } finally {
                                        if (et) throw rt;
                                    }
                                }
                                N = 0 < z ? N / z : 0, U = 0 < G ? U / G : 0, this.rankData[t][P].push({
                                    name: S.name,
                                    wr: N,
                                    fr: S.fr_ranks[P],
                                    color: S.color,
                                    fontColor: S.fontColor
                                });
                                var ht = !0, dt = !1, ct = void 0;
                                try {
                                    for (var ut, yt = this.rankBrackets[Symbol.iterator](); !(ht = (ut = yt.next()).done); ht = !0) {
                                        var ft = ut.value, pt = this.bracketData[t][ft.name];
                                        P == ft.start && pt.push({
                                            name: S.name,
                                            wr: N,
                                            fr: S.fr_ranks[P],
                                            wr_old: U,
                                            fr_old: D ? D.fr_ranks[P] : 0,
                                            color: S.color,
                                            fontColor: S.fontColor,
                                            count: 0 < N ? 1 : 0
                                        });
                                        var vt = pt[pt.length - 1];
                                        P > ft.start && P <= ft.end && (vt.wr += N, vt.fr += S.fr_ranks[P], vt.wr_old += U, 
                                        vt.fr_old += D ? D.fr_ranks[P] : 0, vt.count += 0 < N ? 1 : 0), P == ft.end && 0 < vt.count && (vt.wr /= vt.count, 
                                        vt.fr /= vt.count, vt.wr_old /= vt.count, vt.fr_old /= vt.count, vt.wr_d = vt.wr - vt.wr_old, 
                                        vt.fr_d = vt.fr - vt.fr_old);
                                    }
                                } catch (t) {
                                    dt = !0, ct = t;
                                } finally {
                                    try {
                                        !ht && yt.return && yt.return();
                                    } finally {
                                        if (dt) throw ct;
                                    }
                                }
                            }
                        } catch (t) {
                            R = !0, A = t;
                        } finally {
                            try {
                                !F && O.return && O.return();
                            } finally {
                                if (R) throw A;
                            }
                        }
                    }
                }
            } catch (t) {
                x = !0, L = t;
            } finally {
                try {
                    !g && T.return && T.return();
                } finally {
                    if (x) throw L;
                }
            }
            var mt = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, bt = !0, kt = !1, wt = void 0;
            try {
                for (var gt, xt = range(0, hsRanks)[Symbol.iterator](); !(bt = (gt = xt.next()).done); bt = !0) {
                    var Lt = gt.value;
                    this.rankData[t][Lt].sort(mt);
                }
            } catch (t) {
                kt = !0, wt = t;
            } finally {
                try {
                    !bt && xt.return && xt.return();
                } finally {
                    if (kt) throw wt;
                }
            }
            var Ct = !0, Tt = !1, St = void 0;
            try {
                for (var _t, Dt = this.rankBrackets[Symbol.iterator](); !(Ct = (_t = Dt.next()).done); Ct = !0) {
                    var Bt = _t.value;
                    this.bracketData[t][Bt.name].sort(mt);
                }
            } catch (t) {
                Tt = !0, St = t;
            } finally {
                try {
                    !Ct && Dt.return && Dt.return();
                } finally {
                    if (Tt) throw St;
                }
            }
            if (this.rankData.fullyLoaded[t] = !0, null != e) return e.apply(this);
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = null != t;
            if (this.rankData.fullyLoaded[this.f]) return !e || t.apply(this);
            if (!app.ui.ladderWindow.data[this.f].fullyLoaded) {
                return !!e && app.ui.ladderWindow.loadData(this.f, function() {
                    app.ui.powerWindow.checkLoadData(t);
                });
            }
            if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.powerWindow.checkLoadData(t);
                });
            }
            app.ui.ladderWindow.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded && this.addData(this.f, t);
        }
    }, {
        key: "plot",
        value: function() {
            if (!this.checkLoadData()) return this.renderOptions(), this.checkLoadData(function(t) {
                app.ui.powerWindow.plot();
            });
            this.renderOptions(), "ranks" == this.mode && this.plotRanks(this.f), "brackets" == this.mode && this.plotBrackets(this.f), 
            "trends" == this.mode && this.plotTrends(this.f);
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (this.div.style.display = "none", 
            app.path.hsFormat = this.f);
        }
    }, {
        key: "plotRanks",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            var e = range(0, hsRanks), r = "1fr ", a = !0, i = !(e[0] = "L"), n = void 0;
            try {
                for (var s, o = range(0, this.maxElementsPerRank)[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                    s.value;
                    r += "4fr 1fr ";
                }
            } catch (t) {
                i = !0, n = t;
            } finally {
                try {
                    !a && o.return && o.return();
                } finally {
                    if (i) throw n;
                }
            }
            this.grid.style.gridTemplateColumns = r, this.grid.style.gridGap = "0.1rem", (f = document.createElement("div")).className = "header", 
            f.innerHTML = "Rank", this.grid.appendChild(f);
            for (var l = 0; l < this.maxElementsPerRank; l++) {
                (f = document.createElement("div")).className = "header columnTitle", f.innerHTML = "Top " + (l + 1), 
                this.grid.appendChild(f);
            }
            for (l = 0; l < hsRanks; l++) {
                if ((f = document.createElement("div")).className = "pivot", f.innerHTML = e[l], 
                this.grid.appendChild(f), this.rankData.rankSums[t][l] < this.minGames) for (var h = 0; h < this.maxElementsPerRank; h++) {
                    (f = document.createElement("div")).className = "blank", this.grid.appendChild(f), 
                    this.grid.appendChild(document.createElement("div"));
                } else for (h = 0; h < this.maxElementsPerRank; h++) {
                    var d = this.rankData[t][l][h].name, c = (100 * this.rankData[t][l][h].wr).toFixed(1) + "%", u = this.rankData[t][l][h].color, y = this.rankData[t][l][h].fontColor, f = document.createElement("div"), p = document.createElement("button"), v = document.createElement("span");
                    v.className = "tooltipText", v.innerHTML = "R:" + l + " #" + (h + 1) + " " + d, 
                    p.className = "archBtn tooltip", p.id = d, p.style.backgroundColor = u, p.style.color = y, 
                    p.innerHTML = d, p.onclick = this.pressButton.bind(this), f.classList.add("winrate"), 
                    f.innerHTML = c, this.grid.appendChild(p), this.grid.appendChild(f);
                }
            }
        }
    }, {
        key: "plotBrackets",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            var e = "", r = !0, a = !(range(0, hsRanks)[0] = "L"), i = void 0;
            try {
                for (var n, s = this.rankBrackets[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    n.value;
                    e += "4fr 1fr ";
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
            this.grid.style.gridTemplateColumns = e;
            var o = !0, l = !(this.grid.style.gridGap = "0.3rem"), h = void 0;
            try {
                for (var d, c = this.rankBrackets[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = document.createElement("div");
                    y.className = "header columnTitle", y.innerHTML = u.name, this.grid.appendChild(y);
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            for (var f = 0; f < this.maxElementsPerBracket; f++) {
                var p = !0, v = !1, m = void 0;
                try {
                    for (var b, k = this.rankBrackets[Symbol.iterator](); !(p = (b = k.next()).done); p = !0) {
                        var w = b.value;
                        if (!(this.bracketData[t][w.name].length <= f)) {
                            var g = this.bracketData[t][w.name][f];
                            if (w.games[t] <= this.minGames || null == g) {
                                var x = document.createElement("div");
                                x.className = "blank", this.grid.appendChild(x), this.grid.appendChild(document.createElement("div"));
                            } else {
                                var L = (100 * g.wr).toFixed(1) + "%", C = document.createElement("div"), T = document.createElement("button"), S = document.createElement("span");
                                S.className = "tooltipText", S.innerHTML = "#" + (f + 1) + " " + g.name, T.className = "archBtn tooltip", 
                                T.id = g.name, T.style.backgroundColor = g.color, T.style.color = g.fontColor, T.style.marginLeft = "0.5rem", 
                                T.innerHTML = g.name, T.onclick = this.pressButton.bind(this), C.className = "winrate", 
                                C.innerHTML = L, this.grid.appendChild(T), this.grid.appendChild(C);
                            }
                        }
                    }
                } catch (t) {
                    v = !0, m = t;
                } finally {
                    try {
                        !p && k.return && k.return();
                    } finally {
                        if (v) throw m;
                    }
                }
            }
        }
    }, {
        key: "plotTrends",
        value: function(t) {
            for (var e = this; this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            var r = this.rankBrackets[0].name, a = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, i = function(t, e) {
                return t.wr_d > e.wr_d ? -1 : t.wr_d < e.wr_d ? 1 : 0;
            }, n = function(t, e) {
                return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
            }, s = function(t, e) {
                return t.fr_d > e.fr_d ? -1 : t.fr_d < e.fr_d ? 1 : 0;
            }, o = [], l = [];
            this.grid.style.gridTemplateColumns = "2fr 1fr 1fr 2fr 1fr 1fr", this.grid.style.gridGap = "0.3rem";
            var h = this.grid, d = function(t, e, r, a) {
                var i = document.createElement("div");
                i.className = r ? "header sortBtn" : "header", i.innerHTML = t, i.id = e, i.onclick = a, 
                h.append(i);
            };
            d("Winrate"), d("wr", "wr", !0, function() {
                e.trendSort_wr = "wr_up" == e.trendSort_wr ? "wr_down" : "wr_up", e.plot();
            }), d("d", "d_wr", !0, function() {
                e.trendSort_wr = "wrD_up" == e.trendSort_wr ? "wrD_down" : "wrD_up", e.plot();
            }), d("Frequency"), d("fr", "fr", !0, function() {
                e.trendSort_fr = "fr_up" == e.trendSort_fr ? "fr_down" : "fr_up", e.plot();
            }), d("d", "d_fr", !0, function() {
                e.trendSort_fr = "frD_up" == e.trendSort_fr ? "frD_down" : "frD_up", e.plot();
            });
            var c = !0, u = !1, y = void 0;
            try {
                for (var f, p = this.bracketData[t][r][Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                    var v = f.value;
                    l.push(v), o.push(v);
                }
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && p.return && p.return();
                } finally {
                    if (u) throw y;
                }
            }
            switch (this.trendSort_fr) {
              case "frD_up":
                l.sort(s);
                break;

              case "frD_down":
                l.sort(s).reverse();
                break;

              case "fr_up":
                l.sort(n);
                break;

              case "fr_down":
                l.sort(n).reverse();
            }
            switch (this.trendSort_wr) {
              case "wrD_up":
                o.sort(i);
                break;

              case "wrD_down":
                o.sort(i).reverse();
                break;

              case "wr_up":
                o.sort(a);
                break;

              case "wr_down":
                o.sort(a).reverse();
            }
            for (var m in o) for (var b in [ o, l ]) {
                var k = [ o, l ][b][m], w = document.createElement("button");
                w.className = "archBtn", w.id = k.name, w.style.backgroundColor = k.color, w.style.color = k.fontColor, 
                w.style.marginLeft = "0.5rem", w.innerHTML = k.name, w.onclick = this.buttonTrigger.bind(this);
                var g = document.createElement("div");
                g.classList.add("winrate");
                var x = document.createElement("div");
                if (x.classList.add("winrate"), 0 == b) {
                    var L = 0 < k.wr_d ? "+" : "";
                    g.innerHTML = (100 * k.wr).toFixed(1) + "%", x.innerHTML = L + (100 * k.wr_d).toFixed(2) + "%";
                }
                if (1 == b) {
                    var C = 0 < k.fr_d ? "+" : "";
                    g.innerHTML = (100 * k.fr).toFixed(1) + "%", x.innerHTML = C + (100 * k.fr_d).toFixed(2) + "%";
                }
                this.grid.appendChild(w), this.grid.appendChild(g), this.grid.appendChild(x);
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), L;
}(), t0 = performance.now(), MOBILE = !1;

window.onload = function() {
    window.innerWidth <= 756 && (MOBILE = !0, console.log("mobile")), app = new App();
};

var wrSort = function(t, e) {
    return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
}, Table = function() {
    function E(t, e, r, a, i) {
        _classCallCheck(this, E), this.DATA = t, this.f = e, this.t = r, this.r = a, this.window = i, 
        this.sortBy = "", this.numArch = MOBILE ? 12 : this.window.numArch, this.bgColor = "transparent", 
        this.fontColor = "#22222", this.subplotRatio = .6, this.overallString = '<b style="font-size:130%">Overall</b>', 
        this.minGames = 1, this.polarization = 0, this.diversity = 0, this.whiteTile = .50000001, 
        this.blackTile = .51;
        if (this.colorScales = [ [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#00a2bc" ], [ 1, "#055c7a" ] ], [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#279e27" ], [ 1, "#28733d" ] ], [ [ 0, "#731367" ], [ .3, "#ab2f8a" ], [ .5, "#FFFFFF" ], [ .7, "#50dad4" ], [ 1, "#28688e" ] ] ], 
        this.table = [], this.textTable = [], this.frequency = [], this.archetypes = [], 
        this.archetypes_m = [], this.winrates = [], this.totGames = 0, this.frSum = 0, this.download = "", 
        null == t) return console.log("table no data:", this.f, this.t, this.r), void (this.numArch = 0);
        var n = t.frequency.slice(), s = t.table.slice(), o = t.archetypes.slice();
        this.numArch = Math.min(this.numArch, o.length);
        var l = !0, h = !1, d = void 0;
        try {
            for (var c, u = n[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                var y = c.value;
                this.frSum += y, this.diversity += Math.pow(y, 2);
            }
        } catch (t) {
            h = !0, d = t;
        } finally {
            try {
                !l && u.return && u.return();
            } finally {
                if (h) throw d;
            }
        }
        this.frSum = Math.max(this.frSum, 1), this.diversity = 1 - this.diversity / Math.pow(this.frSum, 2);
        var f = range(0, n.length);
        f.sort(function(t, e) {
            return n[t] > n[e] ? -1 : n[t] < n[e] ? 1 : 0;
        });
        for (var p = 0; p < this.numArch; p++) this.table.push(fillRange(0, this.numArch, 0)), 
        this.textTable.push(fillRange(0, this.numArch, ""));
        var v = {
            Druid: "Dr",
            Hunter: "Hu",
            Mage: "Ma",
            Paladin: "Pa",
            Priest: "Pr",
            Rogue: "Rg",
            Shaman: "Sh",
            Warlock: "Wl",
            Warrior: "Wr"
        };
        for (p = 0; p < this.numArch; p++) {
            var m = f[p];
            this.frequency.push(n[m]), this.archetypes.push(o[m][1] + " " + o[m][0]), this.archetypes_m.push(o[m][1].slice(0, 2) + " " + v[o[m][0]]);
            for (var b = p; b < this.numArch; b++) {
                var k = f[b], w = 0, g = 0, x = 0, L = s[m][k][0], C = s[m][k][1];
                0 < L + C && (g = L / (L + C));
                var T = s[k][m][1], S = s[k][m][0];
                0 < T + S && (x = T / (T + S));
                var _ = L + T + C + S;
                w = p == b ? x = g = .5 : _ < this.minGames ? .5 : 0 < L + C && 0 < T + S ? (g + x) / 2 : L + C == 0 ? x : g;
                var D = o[m][1] + " " + o[m][0], B = o[k][1] + " " + o[k][0];
                this.table[p][b] = w, this.table[b][p] = 1 - w, this.totGames += _, _ >= this.minGames ? (this.textTable[p][b] = D + "<br><b>vs:</b> " + B + "<br><b>wr:</b>  " + (100 * w).toFixed(1) + "%  (" + _ + ")", 
                this.textTable[b][p] = B + "<br><b>vs:</b> " + D + "<br><b>wr:</b>  " + (100 * (1 - w)).toFixed(1) + "%  (" + _ + ")") : (this.textTable[p][b] = D + "<br><b>vs:</b> " + B + "<br><b>wr:</b>  Low Data (" + _ + ")", 
                this.textTable[b][p] = B + "<br><b>vs:</b> " + D + "<br><b>wr:</b>  Low Data (" + _ + ")");
            }
        }
        var W = 0;
        for (p = 0; p < this.numArch; p++) W += this.frequency[p];
        0 == W && (W = 1, console.log("freqSum = 0"));
        for (p = 0; p < this.numArch; p++) {
            for (w = 0, b = 0; b < this.numArch; b++) w += this.table[p][b] * this.frequency[b];
            this.winrates.push(w / W);
        }
        for (var M = 0; M < this.numArch; M++) for (var q = M + 1; q < this.numArch; q++) {
            var I = this.frequency[M] * this.frequency[q] * Math.abs(this.table[M][q] - .5);
            this.polarization += 2 * I / Math.pow(W, 2);
        }
        this.layout = {
            showlegend: !1,
            xaxis: {
                side: "top",
                showgrid: !1,
                tickcolor: this.fontColor,
                tickangle: 45,
                color: this.fontColor,
                gridcolor: this.fontColor,
                fixedrange: !0
            },
            yaxis: {
                autorange: "reversed",
                tickcolor: this.fontColor,
                color: this.fontColor,
                gridcolor: this.fontColor,
                fixedrange: !0
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: this.bgColor,
            margin: MOBILE ? {
                l: 50,
                r: 0,
                b: 20,
                t: 100
            } : {
                l: 120,
                r: 0,
                b: 30,
                t: 100
            },
            width: MOBILE ? 1 * app.ui.width : this.window.width,
            height: MOBILE ? .8 * app.ui.height : this.window.height,
            yaxis2: {
                visible: !1,
                showticklabels: !1,
                fixedrange: !0,
                domain: [ 0, .01 ],
                anchor: "x"
            }
        }, this.getFreqPlotData();
    }
    return _createClass(E, [ {
        key: "getFreqPlotData",
        value: function() {
            var t = [], e = [], r = !0, a = !1, i = void 0;
            try {
                for (var n, s = this.frequency[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    var o = n.value;
                    o /= this.frSum, t.push(o), e.push("FR: " + (100 * o).toFixed(1) + "%");
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
            this.freqPlotData = {
                x: [ this.archetypes ],
                y: [ t ],
                text: [ e ],
                visible: !0,
                hoverinfo: "text",
                marker: {
                    color: "#a3a168"
                }
            };
        }
    }, {
        key: "plot",
        value: function() {
            if (console.log("diversity, polarization: ", this.diversity + ", " + this.polarization), 
            "simulation" == this.window.mode) return this.simulation();
            "" != this.sortBy && this.sortBy == this.window.sortBy || this.sortTableBy(this.window.sortBy, !1);
            var t = this.table.concat([ this.winrates ]), e = this.archetypes.concat([ this.overallString ]);
            MOBILE && (e = this.archetypes_m.concat([ "All" ]));
            for (var r = [], a = this.textTable.concat([ r ]), i = 0; i < t[0].length; i++) {
                var n = (100 * this.winrates[i]).toFixed(1) + "%", s = this.frSum ? (100 * this.frequency[i] / this.frSum).toFixed(1) + "%" : 0;
                r.push(this.archetypes[i] + "<br>Frequency: " + s + "<br>Overall wr: " + n);
            }
            var o = {
                type: "heatmap",
                z: t,
                x: this.archetypes,
                y: e,
                text: a,
                hoverinfo: "text",
                colorscale: this.colorScales[MU_COLOR_IDX],
                showscale: !1
            }, l = {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            }, h = {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            }, d = {
                x: [],
                y: [],
                text: [],
                mode: "text",
                font: {
                    color: "#9c9c9c",
                    size: 8
                },
                hoverinfo: "none"
            }, c = !0, u = !1, y = void 0;
            try {
                for (var f, p = range(0, this.numArch)[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                    var v = f.value;
                    d.x.push(this.archetypes[v]), MOBILE ? d.y.push(this.archetypes_m[v]) : d.y.push(this.archetypes[v]), 
                    d.text.push(" X ");
                }
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && p.return && p.return();
                } finally {
                    if (u) throw y;
                }
            }
            var m = [ o, l, h ];
            this.window.annotated ? m.push(this.getAnnotations()) : m.push(d), Plotly.newPlot("chart2", m, this.layout, {
                displayModeBar: !1
            }), PREMIUM && !MOBILE && document.getElementById("chart2").on("plotly_click", this.zoomToggle.bind(this)), 
            this.window.zoomIn && this.zoomIn(this.window.zoomArch), document.getElementById("loader").style.display = "none", 
            this.window.nrGames = this.totGames, this.window.setTotGames();
        }
    }, {
        key: "subPlotFR",
        value: function() {
            Plotly.restyle("chart2", this.freqPlotData, 1);
        }
    }, {
        key: "subPlotWR",
        value: function(t) {
            var e;
            if (e = -1 == t || t >= this.numArch ? this.winrates.slice() : this.table[t].slice(), 
            !(t > this.numArch)) {
                for (var r = [], a = 0; a < e.length; a++) r.push("WR: " + (100 * e[a]).toFixed(1) + "%"), 
                e[a] -= .5;
                var i = {
                    type: "bar",
                    x: [ this.archetypes ],
                    y: [ e ],
                    text: [ r ],
                    visible: !0,
                    hoverinfo: "text",
                    marker: {
                        color: "#222"
                    }
                };
                Plotly.restyle("chart2", i, 2);
            }
        }
    }, {
        key: "zoomToggle",
        value: function(t) {
            console.log("click", t);
            var e = t.points.length, r = t.points[e - 1].y;
            0 == this.window.zoomIn ? this.zoomIn(r) : this.zoomOut();
        }
    }, {
        key: "zoomIn",
        value: function(t) {
            var e = this.archetypes.indexOf(t);
            if (t == this.overallString && (e = this.numArch), -1 != e) {
                var r = {
                    yaxis: {
                        range: [ e - .5, e + .5 ],
                        fixedrange: !0,
                        color: this.fontColor,
                        tickcolor: this.fontColor
                    },
                    yaxis2: {
                        domain: [ 0, this.subplotRatio ],
                        visible: !1,
                        fixedrange: !0
                    }
                };
                Plotly.relayout("chart2", r), this.subPlotFR(), this.subPlotWR(e);
                var a = document.querySelector("#tableWindow #matchup");
                document.querySelector("#tableWindow #winrate");
                a.style.display = "inline-block", t == this.overallString && (a.style.display = "none"), 
                this.window.zoomIn = !0, this.window.zoomArch = t;
            } else this.zoomOut();
        }
    }, {
        key: "skill",
        value: function() {
            var t = this.table;
            for (var e in t) {
                var r = t[e][e][0];
                t[e][e][1];
            }
        }
    }, {
        key: "zoomOut",
        value: function() {
            var t = {
                yaxis: {
                    range: [ this.numArch + .5, -.5 ],
                    color: this.fontColor,
                    tickcolor: this.fontColor,
                    fixedrange: !0
                },
                yaxis2: {
                    domain: [ 0, .01 ],
                    visible: !1,
                    fixedrange: !0
                }
            };
            Plotly.relayout("chart2", t), Plotly.restyle("chart2", {
                visible: !1
            }, [ 1, 2 ]);
            var e = document.querySelector("#tableWindow #matchup"), r = document.querySelector("#tableWindow #winrate");
            e.style.display = "none", r.style.display = "inline-block", this.window.zoomIn = !1;
        }
    }, {
        key: "sortTableBy",
        value: function(t) {
            var e = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
            if (this.sortBy != t || this.window.zoomIn) {
                var r = range(0, this.numArch), a = this.archetypes.indexOf(this.window.zoomArch), i = this;
                "winrate" == t && r.sort(function(t, e) {
                    return i.winrates[t] > i.winrates[e] ? -1 : i.winrates[t] < i.winrates[e] ? 1 : 0;
                }), "matchup" == t && r.sort(function(t, e) {
                    return i.table[a][t] > i.table[a][e] ? -1 : i.table[a][t] < i.table[a][e] ? 1 : 0;
                }), "frequency" == t && r.sort(function(t, e) {
                    return i.frequency[t] > i.frequency[e] ? -1 : i.frequency[t] < i.frequency[e] ? 1 : 0;
                });
                var n = [], s = [], o = [], l = [], h = [], d = !0, c = !1, u = void 0;
                try {
                    for (var y, f = range(0, this.numArch)[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                        var p = r[y.value];
                        o.push(this.archetypes[p]), l.push(this.frequency[p]), h.push(this.winrates[p]);
                        var v = [], m = [], b = !0, k = !1, w = void 0;
                        try {
                            for (var g, x = range(0, this.numArch)[Symbol.iterator](); !(b = (g = x.next()).done); b = !0) {
                                var L = g.value;
                                v.push(this.table[p][r[L]]), m.push(this.textTable[p][r[L]]);
                            }
                        } catch (t) {
                            k = !0, w = t;
                        } finally {
                            try {
                                !b && x.return && x.return();
                            } finally {
                                if (k) throw w;
                            }
                        }
                        n.push(v), s.push(m);
                    }
                } catch (t) {
                    c = !0, u = t;
                } finally {
                    try {
                        !d && f.return && f.return();
                    } finally {
                        if (c) throw u;
                    }
                }
                this.table = n, this.textTable = s, this.archetypes = o, this.frequency = l, this.winrates = h, 
                this.sortBy = t, this.window.sortBy = t, this.getFreqPlotData(), this.window.renderOptions(), 
                e && this.plot();
            } else console.log("already sorted by " + t);
        }
    }, {
        key: "downloadCSV",
        value: function() {
            this.download = " %2C";
            for (var t = 0; t < this.numArch; t++) this.download += this.archetypes[t] + "%2C";
            this.download += "%0A";
            for (t = 0; t < this.numArch; t++) {
                this.download += this.archetypes[t] + "%2C";
                for (var e = 0; e < this.numArch; e++) this.download += this.table[t][e] + "%2C";
                this.download += "%0A";
            }
            this.download += "Overall%2C";
            for (t = 0; t < this.numArch; t++) this.download += this.winrates[t] + "%2C";
            this.download += "Frequency%2C";
            for (t = 0; t < this.numArch; t++) this.download += this.freqPlotData.y[t] + "%2C";
            var r = document.createElement("a");
            r.setAttribute("href", "data:text/plain;charset=utf-8," + this.download), r.setAttribute("download", "matchupTable.csv"), 
            r.style.display = "none", document.body.appendChild(r), r.click(), document.body.removeChild(r);
        }
    }, {
        key: "getAnnotations",
        value: function() {
            var t = 900 <= app.ui.width ? 1 : 0, e = {
                x: [],
                y: [],
                text: [],
                mode: "text",
                font: {
                    color: "black",
                    size: 8
                },
                hoverinfo: "none"
            }, r = !0, a = !1, i = void 0;
            try {
                for (var n, s = range(0, this.numArch)[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    var o = n.value;
                    e.x.push(this.archetypes[o]), e.y.push(this.overallString), e.text.push((100 * this.winrates[o]).toFixed(t) + "%");
                    for (var l = 0; l < this.numArch; l++) {
                        e.x.push(this.archetypes[o]), e.y.push(this.archetypes[l]);
                        var h = o == l ? " X " : (100 * this.table[l][o]).toFixed(t) + "%";
                        e.text.push(h);
                    }
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
            return e;
        }
    }, {
        key: "simulation",
        value: function() {
            app.ui.showLoader(), this.window.mode = "simulation";
            var t = this.freqPlotData, e = t.x[0], r = t.y[0], a = 0, i = !0, n = !1, s = void 0;
            try {
                for (var o, l = r[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                    a += o.value;
                }
            } catch (t) {
                n = !0, s = t;
            } finally {
                try {
                    !i && l.return && l.return();
                } finally {
                    if (n) throw s;
                }
            }
            for (var h = this.table, d = {
                title: "Meta Simulation",
                xaxis: {
                    type: "log",
                    autorange: !0,
                    fixedrange: !0,
                    title: "Iteration step of simulation (logarithmically)",
                    opacity: .5
                },
                yaxis: {
                    range: [ 0, 1 ],
                    hoverformat: ".2f",
                    fixedrange: !0,
                    title: "Share of Meta",
                    opacity: .5
                },
                hovermode: "closest",
                plot_bgcolor: "transparent",
                paper_bgcolor: this.bgColor
            }, c = [], u = 0; u < e.length; u++) c.push({
                idx: u,
                name: e[u],
                fr: r[u] / a,
                x: [],
                y: [],
                wr: .5
            });
            for (var y = 0; y < 1e5 + 1; y++) this.eq_wr(c, h), this.eq_fr(c, y);
            for (var f = [], p = 0; p < c.length; p++) {
                var v = c[p], m = app.ui.getArchColor(null, v.name, this.f).color, b = [], k = !0, w = !1, g = void 0;
                try {
                    for (var x, L = v.y[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                        var C = x.value;
                        b.push((100 * C).toFixed(1) + "%");
                    }
                } catch (t) {
                    w = !0, g = t;
                } finally {
                    try {
                        !k && L.return && L.return();
                    } finally {
                        if (w) throw g;
                    }
                }
                f.push({
                    name: v.name,
                    x: v.x,
                    y: v.y,
                    text: b,
                    hoverinfo: "text+x+name",
                    fill: "tonexty",
                    fillcolor: m,
                    type: "scatter",
                    mode: "none",
                    marker: {
                        size: 0,
                        line: {
                            size: 0
                        }
                    }
                });
            }
            Plotly.newPlot("chart2", this.stackedArea(f), d), app.ui.hideLoader();
        }
    }, {
        key: "stackedArea",
        value: function(t) {
            for (var e = 1; e < t.length; e++) for (var r = 0; r < Math.min(t[e].y.length, t[e - 1].y.length); r++) t[e].y[r] += t[e - 1].y[r];
            return t;
        }
    }, {
        key: "eq_wr",
        value: function(t, e) {
            for (var r = 0; r < t.length; r++) for (var a = t[r].wr = 0; a < t.length; a++) t[r].wr += e[r][a] * t[a].fr;
        }
    }, {
        key: "eq_fr",
        value: function(t, e) {
            t.sort(function(t, e) {
                return t.wr < e.wr ? -1 : t.wr > e.wr ? 1 : 0;
            });
            var r = e.toString().length;
            if (e % Math.pow(10, r - 2) == 0 || r < 3) for (var a in t) t[a].x.push(e), t[a].y.push(t[a].fr);
            for (var i = 0; i < t.length; i++) {
                var n = t[i];
                if (!(.5 < n.wr)) {
                    var s = n.fr * (.5 - n.wr) * .1;
                    s = 1e-4 <= n.fr - s ? s : n.fr - 1e-4, n.fr -= s;
                    for (var o = s / (t.length - i - 1), l = i + 1; l < t.length; l++) t[l].fr += o;
                }
            }
            t.sort(function(t, e) {
                return t.idx < e.idx ? -1 : t.idx > e.idx ? 1 : 0;
            });
        }
    }, {
        key: "pca",
        value: function() {
            this.window.mode = "pca";
            var t = this.table, e = [], r = t.length;
            for (var a in t) {
                var i = 0;
                for (var n in t) i += t[n][a];
                e.push(i / r);
            }
            var s = [], o = !0, l = !1, h = void 0;
            try {
                for (var d, c = t[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = [];
                    for (var f in u) y = (u[f] - e[f]) / (r - 1);
                    s.push(y);
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            matrixXmatrix(s[0].map(function(t, e) {
                return s.map(function(t) {
                    return t[e];
                });
            }), s);
        }
    } ]), E;
}(), TableWindow = function() {
    function k(t) {
        _classCallCheck(this, k), this.div = document.querySelector("#tableWindow"), this.tab = document.querySelector("#table.tab"), 
        this.optionButtons = document.querySelectorAll("#tableWindow .optionBtn"), this.questionBtn = document.querySelector("#tableWindow .question"), 
        this.overlayDiv = document.querySelector("#tableWindow .overlay"), this.overlayP = document.querySelector("#tableWindow .overlayText"), 
        this.nrGamesP = document.querySelector("#tableWindow .nrGames"), this.nrGamesBtn = document.querySelector("#tableWindow .content-header #showNumbers"), 
        this.simulationBtn = document.querySelector("#tableWindow .equilibriumBtn"), this.firebasePath = PREMIUM ? "premiumData/tableData" : "data/tableData", 
        this.name = "tableWindow", this.data = {}, this.mode = "matchup", this.hsFormats = hsFormats, 
        this.hsTimes = PREMIUM ? table_times_premium : table_times, this.ranks = PREMIUM ? table_ranks_premium : table_ranks, 
        this.sortOptions = PREMIUM ? table_sortOptions_premium : table_sortOptions, this.numArch = 20, 
        this.nrGames = 0, this.overlayText = {}, this.overlayText.matchup = "\n            Here you can see how your deck on the left hand side performs against any other deck on the top. \n            The colors range  from favorable <span class='blue'>blue</span> to unfavorable <span class='red'>red</span>.<br><br>\n            The matchup table lists the top " + this.numArch + " most frequent decks within the selected time and rank brackets.<br><br>\n            The hover info lists the number of games recorded for that specific matchup in the (parenthesis).<br><br>\n            The 'Overall' line at the bottom shows the overall winrate of the opposing decks in the specified time and rank bracket.<br><br>\n            Sorting the table displays the most frequent/ highest winrate deck in the top left. Changing the format, time or rank brackets automatically sorts the table.<br><br>\n            <img src='Images/muSort.png'></img>\n            \n            <br><br><br><br>\n            Click on a matchup to 'zoom in'. Click again to 'zoom out'.<br><br>\n            In the zoomed in view you see only one deck on the left side.<br><br>\n            Additionally there are 2 subplots displaying the frequency of the opposing decks (brown line chart) and the specific matchup as black bar charts.<br><br>\n            Changing any parameter (Format, time, rank, sorting) keeps you zoomed into the same archetype if possible.<br><br>\n            You can additionally sort 'by Matchup' while zoomed in.<br><br>\n        ", 
        this.overlayText.simulation = "\n            The simulation simulates the meta if all players would rationally switch from weaker to stronger decks according to the current meta.<br><br>\n            &#8226 The x axis shows the simulation over time (simulation steps)<br>\n            &#8226 The y axis shows the percentage of the meta an archetype occupies at a particular time.<br><br>\n            Click on any button to go back to the Matchup chart.\n        ", 
        this.width = document.querySelector(".main-wrapper").offsetWidth - 40, this.height = .94 * document.querySelector("#ladderWindow .content").offsetHeight, 
        this.f = this.hsFormats[0], this.t = "last2Weeks", this.r = this.ranks[0], this.sortBy = this.sortOptions[0], 
        this.annotated = !0, this.colorTheme = 0, this.zoomIn = !1, this.zoomArch = null, 
        this.fullyLoaded = !1;
        var e = !(this.overlay = !1), r = !(this.minGames = 1e3), a = void 0;
        try {
            for (var i, n = this.hsFormats[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                var s = i.value;
                this.data[s] = {
                    fullyLoaded: !1
                };
                var o = !0, l = !1, h = void 0;
                try {
                    for (var d, c = this.hsTimes[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        var u = d.value;
                        this.data[s][u] = {};
                        var y = !0, f = !1, p = void 0;
                        try {
                            for (var v, m = this.ranks[Symbol.iterator](); !(y = (v = m.next()).done); y = !0) {
                                var b = v.value;
                                this.data[s][u][b] = null;
                            }
                        } catch (t) {
                            f = !0, p = t;
                        } finally {
                            try {
                                !y && m.return && m.return();
                            } finally {
                                if (f) throw p;
                            }
                        }
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
            }
        } catch (t) {
            r = !0, a = t;
        } finally {
            try {
                !e && n.return && n.return();
            } finally {
                if (r) throw a;
            }
        }
        this.loadData(this.f, t), this.setupUI();
    }
    return _createClass(k, [ {
        key: "display",
        value: function(t) {
            if (t) {
                if (this.div.style.display = "inline-block", this.f = app.path.hsFormat, "simulation" == this.mode) return;
                this.plot();
            } else this.div.style.display = "none", app.path.hsFormat = this.f;
        }
    }, {
        key: "setupUI",
        value: function() {
            this.dropdownFolders = {
                format: document.querySelector("#tableWindow .content-header #formatFolder .dropdown"),
                time: document.querySelector("#tableWindow .content-header #timeFolder .dropdown"),
                rank: document.querySelector("#tableWindow .content-header #rankFolder .dropdown"),
                sort: document.querySelector("#tableWindow .content-header #sortFolder .dropdown")
            };
            var t = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var e in this.dropdownFolders) {
                var r = this.dropdownFolders[e];
                r.innerHTML = "", r.onmouseout = t;
            }
            var a = !0, i = !1, n = void 0;
            try {
                for (var s, o = this.hsFormats[Symbol.iterator](); !(a = (s = o.next()).done); a = !0) {
                    var l = s.value;
                    (g = document.createElement("button")).innerHTML = btnIdToText[l], g.id = l, g.className = "folderBtn optionBtn";
                    var h = function(t) {
                        this.f = t.target.id, this.mode = "matchup", this.plot();
                    };
                    g.onclick = h.bind(this), this.dropdownFolders.format.appendChild(g);
                }
            } catch (t) {
                i = !0, n = t;
            } finally {
                try {
                    !a && o.return && o.return();
                } finally {
                    if (i) throw n;
                }
            }
            var d = !0, c = !1, u = void 0;
            try {
                for (var y, f = this.hsTimes[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                    var p = y.value;
                    (g = document.createElement("button")).innerHTML = btnIdToText[p], g.id = p, g.className = "folderBtn optionBtn";
                    h = function(t) {
                        this.t = t.target.id, this.mode = "matchup", this.plot();
                    };
                    g.onclick = h.bind(this), this.dropdownFolders.time.appendChild(g);
                }
            } catch (t) {
                c = !0, u = t;
            } finally {
                try {
                    !d && f.return && f.return();
                } finally {
                    if (c) throw u;
                }
            }
            var v = !0, m = !1, b = void 0;
            try {
                for (var k, w = this.ranks[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                    var g, x = k.value;
                    (g = document.createElement("button")).innerHTML = btnIdToText[x], g.id = x, g.className = "folderBtn optionBtn";
                    h = function(t) {
                        this.r = t.target.id, this.mode = "matchup", this.plot();
                    };
                    g.onclick = h.bind(this), this.dropdownFolders.rank.appendChild(g);
                }
            } catch (t) {
                m = !0, b = t;
            } finally {
                try {
                    !v && w.return && w.return();
                } finally {
                    if (m) throw b;
                }
            }
            var L = !0, C = !1, T = void 0;
            try {
                for (var S, _ = this.sortOptions[Symbol.iterator](); !(L = (S = _.next()).done); L = !0) {
                    var D = S.value, B = document.createElement("button");
                    B.innerHTML = btnIdToText[D], B.id = D, B.className = "folderBtn optionBtn";
                    B.onclick = function(t) {
                        this.mode = "matchup", this.sortBy = t.target.id, this.data[this.f][this.t][this.r].sortTableBy(this.sortBy), 
                        this.renderOptions();
                    }.bind(this), this.dropdownFolders.sort.appendChild(B);
                }
            } catch (t) {
                C = !0, T = t;
            } finally {
                try {
                    !L && _.return && _.return();
                } finally {
                    if (C) throw T;
                }
            }
            if (this.questionBtn.onclick = this.toggleOverlay.bind(this), this.overlayDiv.onclick = this.toggleOverlay.bind(this), 
            this.nrGamesBtn.onclick = this.annotate.bind(this), this.annotated && this.nrGamesBtn.classList.add("highlighted"), 
            document.querySelector("#tableWindow #changeColor").onclick = this.updateColorTheme.bind(this), 
            PREMIUM) {
                this.simulationBtn.onclick = this.simulation.bind(this);
                document.querySelector("#tableWindow .downloadBtn").addEventListener("click", function() {
                    this.data[this.f][this.t][this.r].downloadCSV();
                }.bind(this));
            }
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            return this.data[this.f].fullyLoaded ? null == t || t.apply(this) : null != t && void this.loadData(this.f, t);
        }
    }, {
        key: "loadData",
        value: function(e, r) {
            app.fb_db.ref(this.firebasePath + "/" + e).on("value", function(t) {
                this.readData(t, e, r);
            }.bind(this), function(t) {
                return console.log("Could not load Table Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t, e, r) {
            var a = t.val();
            console.log("tabledata:", a);
            var i = !0, n = !1, s = void 0;
            try {
                for (var o, l = this.hsTimes[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                    var h = o.value, d = !0, c = !1, u = void 0;
                    try {
                        for (var y, f = this.ranks[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                            var p = y.value;
                            this.data[e][h][p] = new Table(a[h][p], e, h, p, this);
                        }
                    } catch (t) {
                        c = !0, u = t;
                    } finally {
                        try {
                            !d && f.return && f.return();
                        } finally {
                            if (c) throw u;
                        }
                    }
                }
            } catch (t) {
                n = !0, s = t;
            } finally {
                try {
                    !i && l.return && l.return();
                } finally {
                    if (n) throw s;
                }
            }
            this.fullyLoaded = !0, this.data[e].fullyLoaded = !0, this.renderOptions(), this.hideInsufficientData(), 
            console.log("table loaded: " + (performance.now() - t0).toFixed(2) + " ms"), r.apply(this);
        }
    }, {
        key: "plot",
        value: function() {
            if ("none" != this.div.style.display) {
                if (!this.checkLoadData()) return this.renderOptions(), this.checkLoadData(function(t) {
                    app.ui.tableWindow.plot();
                });
                this.current = this.data[this.f][this.t][this.r], this.current.plot(), this.renderOptions();
            }
        }
    }, {
        key: "simulation",
        value: function() {
            "simulation" == this.mode ? this.mode = "matchup" : this.mode = "simulation", this.renderOptions(), 
            this.plot();
        }
    }, {
        key: "annotate",
        value: function() {
            this.mode = "matchup", this.annotated ? this.nrGamesBtn.classList.remove("highlighted") : this.nrGamesBtn.classList.add("highlighted"), 
            this.annotated = !this.annotated, this.plot();
        }
    }, {
        key: "updateColorTheme",
        value: function() {
            this.mode = "matchup", MU_COLOR_IDX = (MU_COLOR_IDX + 1) % 3, this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            document.querySelector("#tableWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#tableWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#tableWindow #ranksBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r], 
            document.querySelector("#tableWindow #sortBtn").innerHTML = MOBILE ? btnIdToText_m[this.sortBy] : btnIdToText[this.sortBy];
            var t = document.querySelector("#tableWindow .chartFooterBtn.equilibrium");
            "matchup" == this.mode && t.classList.remove("highlighted"), "simulation" != this.mode || t.classList.contains("highlighted") || t.classList.add("highlighted");
        }
    }, {
        key: "setTotGames",
        value: function() {
            this.nrGamesP.innerHTML = this.nrGames.toLocaleString() + " games";
        }
    }, {
        key: "hideInsufficientData",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.hsTimes[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    var n = a.value, s = document.querySelector("#tableWindow .content-header #timeFolder #" + n);
                    this.data[this.f][n].ranks_all.totGames < this.minGames ? s.style.display = "none" : s.style.display = "block";
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText[this.mode], 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), k;
}(), UI = function() {
    function I() {
        _classCallCheck(this, I), this.tabs = document.querySelectorAll(".tabs button.tab"), 
        this.mobileBtns = document.querySelectorAll("button.mobileBtn"), this.windowTabs = document.querySelectorAll(".tabWindow"), 
        this.folderButtons = document.querySelectorAll(".folder-toggle"), this.loader = document.getElementById("loader"), 
        this.logo = document.querySelector("#vsLogoDiv"), this.overlayText = document.querySelector("#overlay .overlayText"), 
        this.updateTimeDiv = document.querySelector("#updateTime"), this.mobileTab = document.querySelector(".navbar .mobileTabs .tab");
        var t = !0, e = !1, r = void 0;
        try {
            for (var a, i = this.windowTabs[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                a.value.style.display = "none";
            }
        } catch (t) {
            e = !0, r = t;
        } finally {
            try {
                !t && i.return && i.return();
            } finally {
                if (e) throw r;
            }
        }
        this.windowTabs[0].style.display = "inline-block", this.getWindowSize(), this.tabIdx = 0, 
        this.openFolder = null, this.overlay = !1, this.decksWindow = null, this.tableWindow = null, 
        this.ladderWindow = null, this.powerWindow = null, this.infoWindow = null, this.windowNames = [ "ladderWindow", "powerWindow", "tableWindow", "decksWindow", "infoWindow" ], 
        this.maxColors = 5;
        var n = !0, s = !(this.archetypeColors = {}), o = void 0;
        try {
            for (var l, h = hsFormats[Symbol.iterator](); !(n = (l = h.next()).done); n = !0) {
                var d = l.value;
                this.archetypeColors[d] = {};
                var c = !0, u = !1, y = void 0;
                try {
                    for (var f, p = hsClasses[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                        var v = f.value;
                        this.archetypeColors[d][v] = {
                            count: 0,
                            hsClass: v,
                            idx: -1
                        };
                    }
                } catch (t) {
                    u = !0, y = t;
                } finally {
                    try {
                        !c && p.return && p.return();
                    } finally {
                        if (u) throw y;
                    }
                }
            }
        } catch (t) {
            s = !0, o = t;
        } finally {
            try {
                !n && h.return && h.return();
            } finally {
                if (s) throw o;
            }
        }
        var m = !0, b = !1, k = void 0;
        try {
            for (var w, g = this.tabs[Symbol.iterator](); !(m = (w = g.next()).done); m = !0) {
                w.value.addEventListener("click", this.toggleTabs.bind(this));
            }
        } catch (t) {
            b = !0, k = t;
        } finally {
            try {
                !m && g.return && g.return();
            } finally {
                if (b) throw k;
            }
        }
        var x = !0, L = !1, C = void 0;
        try {
            for (var T, S = this.folderButtons[Symbol.iterator](); !(x = (T = S.next()).done); x = !0) {
                T.value.addEventListener("click", this.toggleDropDown.bind(this));
            }
        } catch (t) {
            L = !0, C = t;
        } finally {
            try {
                !x && S.return && S.return();
            } finally {
                if (L) throw C;
            }
        }
        if (MOBILE) {
            var _ = !0, D = !1, B = void 0;
            try {
                for (var W, M = this.mobileBtns[Symbol.iterator](); !(_ = (W = M.next()).done); _ = !0) {
                    W.value.addEventListener("click", this.mobileMenu.bind(this));
                }
            } catch (t) {
                D = !0, B = t;
            } finally {
                try {
                    !_ && M.return && M.return();
                } finally {
                    if (D) throw B;
                }
            }
            detectswipe(".navbar .mobileTabs .tab", this.swipeTab.bind(this));
            this.mobileTab.onclick = function() {
                this.swipeTab(0, "l");
            }.bind(this), this.hideLoader();
        }
        this.logo.addEventListener("click", this.toggleOverlay.bind(this)), document.querySelector("#overlay").addEventListener("click", this.toggleOverlay.bind(this)), 
        window.addEventListener("orientationchange", this.getWindowSize.bind(this)), window.addEventListener("resize", this.getWindowSize.bind(this));
        var q = "Copyright (vS) Vicious Syndicate Gaming - www.ViciousSyndicate.com - © 2016-" + new Date().getFullYear() + ". All rights reserved.";
        document.querySelector("#ladderWindow .content-footer").innerHTML = q, document.querySelector("#powerWindow .content-footer").innerHTML = q, 
        document.querySelector("#tableWindow .content-footer").innerHTML = q, document.querySelector("#decksWindow .content-footer").innerHTML = q, 
        document.querySelector("#infoWindow .content-footer").innerHTML = q, this.toggleOverlay(), 
        this.updateTime();
    }
    return _createClass(I, [ {
        key: "toggleTabs",
        value: function(t) {
            0 != app.phase && t.target != app.path.window.tab && this.display(t.target.id + "Window");
        }
    }, {
        key: "display",
        value: function(t) {
            console.log("load", t), this[t] != app.path.window && (null != app.path.window && app.path.window.display(!1), 
            app.path.window = this[t], app.path.window.display(!0), this.renderTabs());
        }
    }, {
        key: "deckLink",
        value: function(t) {
            app.path.arch = t, console.log("Decklink", t), null != app.path.window && app.path.window.display(!1), 
            app.path.window = this.decksWindow, this.decksWindow.deckLink(t), this.renderTabs();
        }
    }, {
        key: "renderTabs",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var a, i = this.tabs[Symbol.iterator](); !(t = (a = i.next()).done); t = !0) {
                    a.value.classList.remove("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && i.return && i.return();
                } finally {
                    if (e) throw r;
                }
            }
            app.path.window.tab.classList.add("highlighted");
        }
    }, {
        key: "getWindowSize",
        value: function() {
            this.width = parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0)), 
            this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0), 
            MOBILE && (MOBILE = 1 <= this.height / this.width ? "portrait" : "landscape");
        }
    }, {
        key: "getWindows",
        value: function() {
            return [ this.ladderWindow, this.powerWindow, this.tableWindow, this.decksWindow, this.infoWindow ];
        }
    }, {
        key: "swipeTab",
        value: function(t, e) {
            console.log("swipte", t, e), "r" == e && (this.tabIdx -= 1, this.tabIdx < 0 && (this.tabIdx = this.windowNames.length - 1)), 
            "l" == e && (this.tabIdx += 1, this.tabIdx >= this.windowNames.length && (this.tabIdx = 0)), 
            this.mobileTab.innerHTML = this.windowNames[this.tabIdx], this.display(this.windowNames[this.tabIdx]);
        }
    }, {
        key: "updateTime",
        value: function() {
            var t = new Date(), e = t.getMinutes();
            e < 10 && (e = "0" + e), this.updateTimeDiv.innerHTML = t.getHours() + ":" + e;
        }
    }, {
        key: "toggleDropDown",
        value: function(t) {
            for (var e = t.target.nextElementSibling, r = 0; null != e && !(e.classList.contains("dropdown") || 10 < r); ) r += 1, 
            e = e.nextElementSibling;
            null != e && (e == this.openFolder ? this.openFolder = null : null != this.openFolder && (this.openFolder.classList.toggle("hidden"), 
            this.openFolder = e), e.classList.toggle("hidden"));
        }
    }, {
        key: "mobileMenu",
        value: function(t) {
            console.log("mobile menu");
            var e = t.target, r = !0, a = !1, i = void 0;
            try {
                for (var n, s = this.tabs[Symbol.iterator](); !(r = (n = s.next()).done); r = !0) {
                    var o = n.value;
                    o.id == e.id && (this.activeTab = o, this.activeWindow = document.getElementById(o.id + "Window"), 
                    this.renderTabs(), this.renderWindows());
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !r && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "showLoader",
        value: function() {
            this.loader.style.display = "block";
        }
    }, {
        key: "hideLoader",
        value: function() {
            this.loader.style.display = "none";
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlayText.innerHTML = PREMIUM ? overlayText2 : overlayText1, this.overlay ? (document.getElementById("overlay").style.display = "none", 
            this.overlay = !1) : (document.getElementById("overlay").style.display = "block", 
            this.overlay = !0);
        }
    }, {
        key: "getArchColor",
        value: function(t, e, r) {
            if (-1 != hsClasses.indexOf(e)) return {
                color: hsColors[e],
                fontColor: hsFontColors[e]
            };
            var a = void 0;
            if (t) a = e + " " + t; else {
                a = e;
                var i = !0, n = !1, s = void 0;
                try {
                    for (var o, l = hsClasses[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                        var h = o.value;
                        if (-1 != a.indexOf(h)) {
                            t = h;
                            break;
                        }
                    }
                } catch (t) {
                    n = !0, s = t;
                } finally {
                    try {
                        !i && l.return && l.return();
                    } finally {
                        if (n) throw s;
                    }
                }
            }
            if (a in this.archetypeColors[r]) return this.archetypeColors[r][a];
            var d = this.archetypeColors[r][t].count, c = hsArchColors[t][d], u = hsFontColors[t];
            return this.archetypeColors[r][a] = {
                idx: d,
                hsClass: t,
                color: c,
                fontColor: u,
                name: a
            }, this.archetypeColors[r][t].count = (d + 1) % this.maxColors, this.archetypeColors[r][a];
        }
    }, {
        key: "sortArchColors",
        value: function() {
            var t = function(t, e) {}, e = !0, r = !1, a = void 0;
            try {
                for (var i, n = hsFormats[Symbol.iterator](); !(e = (i = n.next()).done); e = !0) {
                    var s = i.value, o = !0, l = !1, h = void 0;
                    try {
                        for (var d, c = hsClasses[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                            var u = d.value, y = [], f = !0, p = !1, v = void 0;
                            try {
                                for (var m, b = this.archetypeColors[s][Symbol.iterator](); !(f = (m = b.next()).done); f = !0) {
                                    var k = m.value;
                                    -1 != k.idx && k.hsClass == u && y.push(k);
                                }
                            } catch (t) {
                                p = !0, v = t;
                            } finally {
                                try {
                                    !f && b.return && b.return();
                                } finally {
                                    if (p) throw v;
                                }
                            }
                            for (var w in y.sort(t), y) {
                                var g = w % this.maxColors;
                                y[w].idx = g, y[w].color = hsArchColors[u][g], y[w].fontColor = hsFontColors[u];
                            }
                        }
                    } catch (t) {
                        l = !0, h = t;
                    } finally {
                        try {
                            !o && c.return && c.return();
                        } finally {
                            if (l) throw h;
                        }
                    }
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !e && n.return && n.return();
                } finally {
                    if (r) throw a;
                }
            }
        }
    } ]), I;
}();