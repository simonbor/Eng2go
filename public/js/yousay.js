
$(document).ready(function () {
    $('#goBtn').on('click', function () {
        var lvlNum = $('#level > label.active input').val();
        var revMod = $('#mode > label.active input').val();
        var youSay = $('#ysNum').val();
        var url = '/getYousayData/?rm=' + revMod + '&ln=' + lvlNum + '&ys=' + youSay;
        
        $('#m_header').empty();
        $('#myLargeModalLabel').html('YouSay #' + youSay);
        
        $.ajax({
            //url: 'http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4',
            //url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http://www.ynet.co.il/Integration/StoryRss2.xml',
            url: url,
            success: InstantVisitMoveReady,
            error: InstantVisitMoveReady
        });
        
        function InstantVisitMoveReady(status, statusText, responses, responseHeaders) {
            if (status == '-1') {
                $('#m_header').empty().append('<p>Error ocured...</p>');
                return;
            }
            var json = '';
            $.each(status.split('#'), function (index, value) {
                value = value.replace(/\'/gi, '\'\'').replace(/\"/gi, '\\"\"');
                if ((index + 1) % 2 == 0) {
                    json += '"eng":"' + value + '"},';
                } else {
                    json += '{"hbr":"' + value + '",';
                }
            });

            json = JSON.parse('[' + json.substring(0, json.length - 1) + ']');
            
            $('#m_header').empty().append('<p>' + json + '</p>');
            $('#m_header').append('<p>' + statusText + '</p>');
            $('#m_header').append('<p>' + responses + '</p>');
            $('#m_header').append('<p>' + responseHeaders + '</p>');
        }
    });
});
