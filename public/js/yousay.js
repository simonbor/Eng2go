var index = 3;
var ys_data = new Array();
var lastStep;

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
        $('.modal-body-body').html("");
        ys_data.length = 0;
        index = 3;
        
        $.ajax({
            url: url,
            success: InstantVisitMoveReady,
            error: InstantVisitMoveReady
        });
        
        function InstantVisitMoveReady(status, statusText, responses, responseHeaders) {
            if (status == '-1' || statusText != 'success') {
                $('#m_header').empty().append('<p>Error ocured...</p>');
                return;
            }

            $.each(status.split('#'), function (index, value) {
                var link = '', data;

                value = value.replace(/\'/gi, '\'\'').replace(/\"/gi, '\\"\"');
                if (value.indexOf('@') > -1) {
                    link = value.substr(value.indexOf('@') + 1 , value.length);
                    data = value.substr(0, value.indexOf('@') - 1);
                } else {
                    data = value.replace(/\*/gi, '');
                }

                if ((index + 1) % 2 == 0) {
                    addData(index, false, value.indexOf('*') > -1, data, link);
                } else {
                    addData(index, true, value.indexOf('*') > -1, data, link);
                }
            });
        }
    });
});

function goNext() {
    if (index < (ys_data.length - 1)) {
        go(++index, 'f');
    }
}
function goPrev() {
    if (index > 3) {
        go(index, 'b');

        if (ys_data[index - 1].link != '') {
            --index;
            while (ys_data[index - 1].link == '' && index > 4) {
                --index;
            }
            go(index++, 'f');
        }
        --index;
    }
}

function go(i, dir) {
    if (dir == 'b') {
        var $lastDelimeter = $('.modal-body-body .cont').last();
        $lastDelimeter.remove();

        var $lastContainer = $('.modal-body-body .cont[data-id=' + i + ']');
        $lastContainer.remove();

        lastStep = false; // for the cases when we were on the last step
    }
    if (dir == 'f') {
                
        if (lastStep) {
            $('.modal-body-body').html("");
            lastStep = false;
        }

        $('.modal-body-body').append($('<div class="cont" data-id="' + i + '"></div>'));        
        $('.modal-body-body .cont').last().css('direction', Boolean(eval(ys_data[i].local)) ? ys_data[2].data : ys_data[3].data);
        
        // link to speaking
        if (!Boolean(eval(ys_data[i].local)) && Boolean(eval(ys_data[i].sentence))) {
            $('.modal-body-body .cont').last().append('<a href="http://195.74.53.116/YouSay/Sounds/' + ys_data[i].link + '.mp3">' + ys_data[i].data.replace(/\*/gi, '') + '</a>');
            $('.modal-body-body .cont').last().css('width','100%');
            lastStep = true;
        } else {
            $('.modal-body-body .cont').last().html(ys_data[i].data.replace(/\*/gi, ''));
        }
        
        // The "-" or separator line
        if (!Boolean(eval(ys_data[i].local)) || Boolean(eval(ys_data[i].sentence))) {
            $('.modal-body-body').append($('<div class="cont separator" data-id="-1">&nbsp;</div>'));
        } else {
            $('.modal-body-body').append($('<div class="cont" data-id="-1">&nbsp;-&nbsp;</div>'));
        }

    }
}

function addData(index, local, sentence, data, link){
    var item = {
        "index": index, 
        "local": local, 
        "sentence": sentence, 
        "data": data, 
        "link": link
    };
    ys_data.push(item);
}