System.register("app", ["jquery", "popper", "bootstrap"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jquery_1, Docs;
    return {
        setters: [
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {
            Docs = /** @class */ (function () {
                function Docs() {
                    var self = this;
                    this.$body = jquery_1.default('body');
                    this.$header = jquery_1.default('#header');
                    this.$content = jquery_1.default('#content');
                    this.$nav = jquery_1.default('#navbar-top');
                    this.$popovers = jquery_1.default('[data-toggle="popover"]');
                    this.$tooltips = jquery_1.default('[data-toggle="tooltip"]');
                    this.$bsComponent = jquery_1.default('.bs-component');
                    this.$button = jquery_1.default('<div id=\'source-button\' class=\'btn btn-primary btn-xs\'>&lt; &gt;</div>').click(function () {
                        var html = jquery_1.default(this).parent().html();
                        html = self.cleanSource(html);
                        jquery_1.default('#source-modal pre').text(html);
                        jquery_1.default('#source-modal').modal();
                    });
                }
                Docs.prototype.initContent = function () {
                    this.$content.css({
                        marginTop: this.$header.height() * 2
                    });
                };
                Docs.prototype.initWindowScroll = function () {
                    jquery_1.default(window).scroll(function () {
                        var top = jquery_1.default(document).scrollTop();
                        jquery_1.default('.splash').css({
                            'background-position': '0px -' + (top / 3).toFixed(2) + 'px'
                        });
                        if (top > 50)
                            jquery_1.default('#home > .navbar').removeClass('navbar-transparent');
                        else
                            jquery_1.default('#home > .navbar').addClass('navbar-transparent');
                    });
                };
                Docs.prototype.initLinks = function () {
                    jquery_1.default('a[href=\'#\']').click(function (e) {
                        e.preventDefault();
                    });
                };
                Docs.prototype.initPopovers = function () {
                    this.$popovers.popover();
                };
                Docs.prototype.initTooltips = function () {
                    this.$tooltips.tooltip({});
                };
                Docs.prototype.initBsComponents = function () {
                    var self = this;
                    this.$bsComponent.hover(function () {
                        jquery_1.default(this).append(self.$button);
                        self.$button.show();
                    }, function () {
                        self.$button.hide();
                    });
                };
                Docs.prototype.cleanSource = function (html) {
                    html = html.replace(/×/g, '&times;')
                        .replace(/«/g, '&laquo;')
                        .replace(/»/g, '&raquo;')
                        .replace(/←/g, '&larr;')
                        .replace(/→/g, '&rarr;');
                    var lines = html.split(/\n/);
                    lines.shift();
                    lines.splice(-1, 1);
                    var indentSize = lines[0].length - lines[0].trim().length, re = new RegExp(' {' + indentSize + '}');
                    lines = lines.map(function (line) {
                        if (line.match(re)) {
                            line = line.substring(indentSize);
                        }
                        return line;
                    });
                    lines = lines.join('\n');
                    return lines;
                };
                Docs.prototype.init = function () {
                    this.initWindowScroll();
                    this.initLinks();
                    this.initPopovers();
                    this.initTooltips();
                    this.initContent();
                    // this.initBsComponents();
                };
                return Docs;
            }());
            exports_1("Docs", Docs);
            console.log(Docs);
            jquery_1.default(function () {
                var docs = new Docs;
                console.log(docs);
                docs.init();
            });
        }
    };
});
//# sourceMappingURL=app.js.map