
$(document).ready(function () {
    $('#goBtn').on('click', function () {

        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.open(method, url, true);
                //xhr.setRequestHeader('Access-Control-Allow-Origin', '');
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

    });
});