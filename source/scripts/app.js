(() => {

    let $spacing;
    let $range = $('input[type="range"]');
    let $htmlbody = $('html,body');

    $(document).on('keydown', ev => {
        if(ev.which === 40) {
            scrollToNext();
        } else if(ev.which === 38) {
            scrollToPrev();
        }
    });

    $('div#timeline_container').on('click','li', function(){
        showNext($(this));
    });


    $range
    .rangeslider({

        polyfill: false,

        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        onInit: function() {},
        onSlide: function(position, value) {},
        onSlideEnd: function(position, value) {
            $spacing = $spacing || $('div#timeline_container > ul > li');
            $spacing.css('min-height', value);
        }
    })

    function showNext(li){
        let $itms = $('div#timeline_container li');
        $itms.removeClass('active');
        $(li).addClass('active');
        $htmlbody.stop().animate({ scrollTop: $(li).offset().top-$(li).height()}, 500,function(){
            $htmlbody.stop();
        });
    }

    function scrollToNext() {
        let $itms = $('div#timeline_container li');
        let $current=$itms.index($('div#timeline_container li.active'));

        if ($($itms[$current+1]).length>0 && !$($itms[$current+1]).hasClass('hidden')) {
            $itms.removeClass('active');
            $($itms[$current+1]).addClass('active');
            $htmlbody.stop().animate({ scrollTop: $($itms[$current+1]).offset().top-$($itms[$current+1]).height()}, 500);
        } else {
            $htmlbody.stop().animate({ scrollTop: $(document).height()}, 500);
        }
    }
    function scrollToPrev() {
        let $itms = $('div#timeline_container li');
        let $current=$itms.index($('div#timeline_container li.active'));

        if ($($itms[$current-1]).length>0 && !$($itms[$current-1]).hasClass('hidden')) {
            $itms.removeClass('active');
            $($itms[$current-1]).addClass('active');
            $htmlbody.stop().animate({ scrollTop: $($itms[$current-1]).offset().top-$($itms[$current-1]).height()}, 500);
        } else {
            $htmlbody.stop().animate({ scrollTop: 0}, 500);
        }
    }

})();