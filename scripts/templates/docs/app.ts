import $ from 'jquery'
import 'popper'
import 'bootstrap'


export class Docs {

    $body: JQuery
    $nav: JQuery
    $popovers: JQuery
    $tooltips: JQuery
    $bsComponent: JQuery
    $button: JQuery

    $header: JQuery
    $content: JQuery

    constructor() {

        let self          = this;
        this.$body        = $('body');
        this.$header      = $('#header');
        this.$content     = $('#content');

        this.$nav         = $('#navbar-top');
        this.$popovers    = $('[data-toggle="popover"]');
        this.$tooltips    = $('[data-toggle="tooltip"]');
        this.$bsComponent = $('.bs-component');
        this.$button      = $('<div id=\'source-button\' class=\'btn btn-primary btn-xs\'>&lt; &gt;</div>').click(function () {
            let html = $(this).parent().html();
            html     = self.cleanSource(html);
            $('#source-modal pre').text(html);
            $('#source-modal').modal();
        });
    }

    initContent(){
        this.$content.css({
            marginTop: this.$header.height() * 2
        })
    }

    initWindowScroll() {
        $(window).scroll(function () {
            const top = $(document).scrollTop();
            $('.splash').css({
                'background-position': '0px -' + (top / 3).toFixed(2) + 'px'
            });
            if ( top > 50 )
                $('#home > .navbar').removeClass('navbar-transparent');
            else
                $('#home > .navbar').addClass('navbar-transparent');
        });
    }

    initLinks() {
        $('a[href=\'#\']').click(function (e) {
            e.preventDefault();
        });
    }

    initPopovers() {
        this.$popovers.popover();
    }

    initTooltips() {
        this.$tooltips.tooltip({

        });
    }

    initBsComponents() {
        let self = this
        this.$bsComponent.hover(function () {
            $(this).append(self.$button);
            self.$button.show();
        }, function () {
            self.$button.hide();
        });
    }


    cleanSource(html) {
        html = html.replace(/×/g, '&times;')
            .replace(/«/g, '&laquo;')
            .replace(/»/g, '&raquo;')
            .replace(/←/g, '&larr;')
            .replace(/→/g, '&rarr;');

        let lines = html.split(/\n/);

        lines.shift();
        lines.splice(- 1, 1);

        const indentSize = lines[ 0 ].length - lines[ 0 ].trim().length,
              re         = new RegExp(' {' + indentSize + '}');

        lines = lines.map(function (line) {
            if ( line.match(re) ) {
                line = line.substring(indentSize);
            }

            return line;
        });

        lines = lines.join('\n');

        return lines;
    }


    init() {
        this.initWindowScroll()
        this.initLinks()
        this.initPopovers()
        this.initTooltips()
        this.initContent();
        // this.initBsComponents();
    }
}

console.log(Docs);
$(() => {
    const docs = new Docs;
    console.log(docs);
    docs.init();
});
