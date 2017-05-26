;(function() {
    'use strict';

    let $window = $(window),
        $reviews = $('.reviews'),
        $reviewsList = $('.reviews__list');

    let reviews = {
        init() {
            $reviewsList.slick({
                fade: true
            });
        }
    }

    reviews.init();  
})();