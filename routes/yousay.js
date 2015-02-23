
exports.yousay_data = function (req, res) {    
    var request = require("request"),
    utils = require('./utils'),
    ys_data = new Array();
  
    // English2Go QueryString Parameters: data1 - Review Mode, data2 - Level Number, data3 - YouSay Number
    var revMod = req.query.rm.toString();
    lvlNum = req.query.ln,
    youSay = req.query.ys,
    url = 'http://english2go.com/Yousay/getYousayData.asp?data1=' +
                revMod.toUpperCase() + '&data2=' + lvlNum + '&data3=' + youSay;
    
    requestWebData(getWebData)           

    function getWebData(error, response, body) {
        var ys_data_web = new Array();
        if (!error && response.statusCode == 200) {
            
            var data = utils.win1255ToUnicode(body);
            ys_data_web.length = 0;
            
            for (i = 0; i < data.split('#').length; i++) {
                var index = i, link = '', 
                    value = data.split('#')[index];
                
                if (value.indexOf('@') > -1) {
                    link = value.substr(value.indexOf('@') + 1 , value.length);
                    ysItem = value.substr(0, value.indexOf('@'));
                } else {
                    ysItem = value.replace(/\*/gi, '');
                }
                
                ys_data_web.push({
                    _id: revMod + "_" + lvlNum + "_" + youSay + "_" + index,   // unique item id
                    ln : lvlNum,                                               // level number
                    ys : youSay,                                               // you_says_id
                    rm : revMod,                                               // you_say_mode
                    in : index,                                                // index
                    lo : !((index + 1) % 2 == 0),                              // local
                    se : value.indexOf('*') > -1,                              // sentence
                    da : ysItem,                                               // data
                    li : link                                                  // link
                });
            }

            // response
            res.end(JSON.stringify(ys_data_web));
        }
    }
    
    function requestWebData(callback) {
        request({
            //uri: "http://english2go.com/Yousay/getYousayData.asp?data1=FR&data2=3&data3=4", // test url
            uri: url,
            method: "POST",
            encoding: null,
            headers: {
                'cookie': req.session.cook
            }
        }, callback);
    }
};