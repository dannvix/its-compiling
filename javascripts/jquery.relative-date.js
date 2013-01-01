(function($, window, undefined) {
    $.fn.relativeDate = function() {
        var timeAgoInWords = function(from) {
            var now = new Date;
            var distInMinutes = Math.floor((now - from) / 1000 / 60);

            if (distInMinutes == 0) { return 'less than a minute ago'; }
            if (distInMinutes == 1) { return 'a minute ago'; }
            if (distInMinutes < 45) { return distInMinutes + ' minutes ago'; }
            if (distInMinutes < 90) { return '1 hour ago'; }
            if (distInMinutes < 1440) { return Math.round(distInMinutes / 60) + ' hours ago'; }
            if (distInMinutes < 2880) { return '1 day ago'; }
            if (distInMinutes < 43200) { return Math.floor(distInMinutes / 1440) + ' days ago'; }
            if (distInMinutes < 86400) { return '1 month ago'; }
            if (distInMinutes < 525960) { return Math.floor(distInMinutes / 43200) + ' months ago'; }
            if (distInMinutes < 1051199) { return '1 year ago'; }
            return Math.floor(distInMinutes / 525960) + ' years ago';
        }

        return $(this).each(function(){
            dateFrom = parseInt($(this).attr("data-timestamp")) * 1000;
            $(this).html(timeAgoInWords(dateFrom));
        });
    };

})(jQuery, window);