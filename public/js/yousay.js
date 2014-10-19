var index = 1;
var ys_data = '';

function goNext() {
    if (index < (ys_data.length - 1)) {
        go(++index);
    }
}
function goPrev() {
    if (index > 2) {
        go(--index);
    }    
}

function go(i){
    $('.hbr_sect, .eng_sect').empty();
    $('.hbr_sect').text(ys_data[i].hbr);
    $('.eng_sect').text(ys_data[i].eng);
}

$(document).ready(function () {
    
    $('#prev').on('click', function () {
        goPrev();
    });
    $('#next').on('click', function () {
        goNext();
    });

    $('#goBtn').on('click', function () {
        var lvlNum = $('#level > label.active input').val();
        var revMod = $('#mode > label.active input').val();
        var youSay = $('#ysNum').val();
        var url = '/getYousayData/?rm=' + revMod + '&ln=' + lvlNum + '&ys=' + youSay;
        
        $('#myLargeModalLabel').html('YouSay #' + youSay);
        
        $.ajax({
            //url: 'http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4',
            //url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http://www.ynet.co.il/Integration/StoryRss2.xml',
            url: url,
            success: InstantVisitMoveReady,
            error: InstantVisitMoveReady
        });
        
        function InstantVisitMoveReady(status, statusText, responses, responseHeaders) {
            if (status == '-1' || statusText != 'success') {
                $('#m_header').empty().append('<p>Error ocured...</p>');
                return;
            }

            ys_data = '';
            index = 1;

            $.each(status.split('#'), function (index, value) {
                value = value.replace(/\'/gi, '\'\'').replace(/\"/gi, '\\"\"');
                if ((index + 1) % 2 == 0) {
                    ys_data += '"eng":"' + value + '"},';
                } else {
                    ys_data += '{"hbr":"' + value + '",';
                }
            });
            ys_data = JSON.parse('[' + ys_data.substring(0, ys_data.length - 1) + ']');
            goNext();  
        }
    });
});
