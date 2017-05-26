;(function() {
	'use strict';

    let $window = $(window),
        $header = $('.header'),
        $footer = $('.footer');

    let fullpage = {
        mobileDetect() {
            if($window.width() <= 960) return true;

            return false;
        },
        $headerCopy: null,
        $footerCopy: null,
        isInitialized: false,
        fullpageInit() {
            let $fullpage = $('.fullpage'),
                $fullpageSection = $('.fullpage__section');

            this.$headerCopy = $header.clone();
            this.$footerCopy = $footer.clone();

            $header.hide();
            $footer.hide();

            $fullpageSection.eq(0).prepend(this.$headerCopy);
            $fullpageSection.eq($fullpageSection.length - 1).prepend(this.$footerCopy);

            $fullpage.fullpage({
                sectionSelector: '.fullpage__section',
                verticalCentered: false,
                afterRender() {
                    $fullpageSection.eq(0).addClass('is_typing');
                },
                afterLoad(anchorLink, index) {
                    $fullpageSection.eq(index - 1).addClass('is_typing');
                }
            });

            this.isInitialized = true;
            // console.log('isInitialized: ' + this.isInitialized);
        },
        fullpageReset() {
            let $fullpage = $('.fullpage'),
                $fullpageSection = $('.fullpage__section');

            $.fn.fullpage.destroy('all');

            $fullpageSection.eq(0).find('.header').remove();
            $fullpageSection.eq($fullpageSection.length - 1).find('.footer').remove();

            $header.show();
            $footer.show();

            this.isInitialized = false;
            this.$headerCopy = null;
            this.$footerCopy = null;
            // console.log('isInitialized: ' + this.isInitialized);
        },
        init() {

            if(!this.mobileDetect()) {
                if(!this.isInitialized) this.fullpageInit();
                // console.log(this.mobileDetect());
            }
            else {
                if(this.isInitialized) this.fullpageReset();
                // console.log(this.mobileDetect());
            }
        }
    }

    $window.resize((ev) => {
        fullpage.init();
    });
    fullpage.init();
})();