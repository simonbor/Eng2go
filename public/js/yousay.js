//jQuery.noConflict();
function worker() {
    var request = new Request({
        //url: 'http://english2go.com/Yousay/getYousayData.asp',
        url: 'http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4',
        //url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http://www.ynet.co.il/Integration/StoryRss2.xml',
        //method: 'get', // JSONP is always GET!
        log: true,
        onError: function (text, er) {
            //alert(er);
        },
        onFailure: function (xhr) {
            //alert(xhr);
        },
        //data: {data1: 'FR', data2: '3', data3: '4'},
        onSuccess: function (data) {
            alert(data);
        },
        onComplete: function(data){
            alert(data);
        }
    });//.send();
    // need to remove that or CORS will need to match it specifically
    //delete request.headers['Origin'];
    //delete request.headers['Access-Control-Allow-Origin'];
    //delete request.headers['Access-Control-Request-Headers'];

    //request.setHeader('Access-Control-Allow-Origin', '*');
    //request.setHeader('Access-Control-Allow-Methods', 'GET');
    //request.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');

    //delete request.headers['Access-Control-Allow-Origin'];
    delete request.headers['Access-Control-Request-Methods'];
    delete request.headers['Access-Control-Request-Headers'];

    request.setHeader('X-Requested-With', 'XMLHttpRequest');
    request.send();

};

//window.addEvent('domready', function () {
//    $('goBtn').addEvents({
//        click: function () {
//            worker();
//        }
//    });
//});

$(document).ready(function () {

    $('#goBtn').on('click', function () {
/*
        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.open(method, url, true);
                //xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://english2go.com');
                xhr.setRequestHeader('Accept', '*');
                xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            } else if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }
            return xhr;
        }

        var request = createCORSRequest("get", "http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4");
        if (request) {
            request.onload = function () {
                // ...
            };
            request.onreadystatechange = handler;
            request.send();
        }

        function handler(data) {
            var res = JSON.parse(data);
            if (res.IsValid) {
                alert(res.IsValid)
            }
        }
        */
        $.ajax({
            //type: 'POST',
            //async: true,
            //url: '/getYousayData.asp?data1=FR&data2=3&data3=4',
            url: 'http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4',
            //url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http://www.ynet.co.il/Integration/StoryRss2.xml',
            username: 'il4736gg',
            password: 'afs25',
            dataType: "jsonp",
            callback: callbackFunc,
            success: InstantVisitMoveReady,
            error: InstantVisitMoveReady
        });

        function InstantVisitMoveReady(status, statusText, responses, responseHeaders) {
            $('#m_header').empty().append('<p>' + status + '</p>');
            $('#m_header').append('<p>' + statusText + '</p>');
            $('#m_header').append('<p>' + responses + '</p>');
            $('#m_header').append('<p>' + responseHeaders + '</p>');
        }

        function callbackFunc(param) {
            alert(param)
        }

    });

});
