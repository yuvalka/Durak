$(document).ready(function() {
    $('.own-hand .card').each(function (index) {
        var count = $('.own-hand .card').length, deg, half;
        var modifier = 5;

        half = count / 2;

        if (count % 2 == 0) { // even
            if (index >= half) {
                index++;
            }
            deg = modifier * (half - index) * -1;
        } else { // odd
            half = Math.floor(half);
            deg = modifier * (half - index);
        }

        console.log(deg);

        $(this).css({
            transform: 'rotate(' + deg + 'deg)',
            zIndex: index * 10,
            marginLeft: index >= half ? -5 : 0,
            marginRight: index <= half ? -5 : 0
        });
    });
});