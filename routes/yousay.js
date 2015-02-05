/*
 * GET YouSay JSON
 */
exports.yousay_data = function (req, res) {    
    var request = require("request");
    var utils = require('./utils');
    var ys_data = new Array();
  
    // English2Go QueryString Parameters: data1 - Review Mode, data2 - Level Number, data3 - YouSay Number
    var revMod = req.query.rm.toString().toUpperCase();
    var lvlNum = req.query.ln;
    var youSay = req.query.ys;
    var url = 'http://english2go.com/Yousay/getYousayData.asp?data1=' +
                revMod + '&data2=' + lvlNum + '&data3=' + youSay;
    
    request({
        //uri: "http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4", // test url
        uri: url,
        method: "POST",
        encoding: null,
        headers: {
            'cookie': req.session.cook
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.contentType('text/html; charset=utf-8');
            
            var data = { data: utils.win1255ToUnicode(body) };
            
            for (i = 0; i < data.data.split('#').length; i++) {
                var index = i;
                var value = data.data.split('#')[index];
                var link = '', data;
                
                if (value.indexOf('@') > -1) {
                    link = value.substr(value.indexOf('@') + 1 , value.length);
                    ysItem = value.substr(0, value.indexOf('@'));
                } else {
                    ysItem = value.replace(/\*/gi, '');
                }
                                
                addYsItem(index, !((index + 1) % 2 == 0), value.indexOf('*') > -1, ysItem, link);
            }
            
            res.end(JSON.stringify(ys_data));
        }
    });

    function addYsItem(index, local, sentence, data, link) {
        var item = {
            "index": index, 
            "local": local, 
            "sentence": sentence, 
            "data": data, 
            "link": link
        };
        ys_data.push(item);
    }
};