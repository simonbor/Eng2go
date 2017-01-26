var db = require('./dal');

exports.yousay_data = function (req, res) {
    var request = require("request");
  
    var revMod = req.query.rm.toString(),
    lvlNum = req.query.ln,
    youSay = req.query.ys,
    url = 'http://english2go.com:265/yousay/getYousay.aspx?studentID=307648345&NativeLang=12&TargetLang=10&type=' +
                revMod.toUpperCase() + '&yousaylevel=' + lvlNum + '&youSayID=' + youSay;
    
    // check data availability    
    db.find('you_says_items', { 'ln': lvlNum, 'ys': youSay, 'rm': revMod }, getMongoData);
    
    function getMongoData(err, docs){
        if (err === null && docs.length > 4) {
            console.log("getMongoData...");
            res.contentType('text/html; charset=utf-8');
            res.end(JSON.stringify(docs));      // response
        }
        else {
            console.log("getWebData...");
            requestWebData(getWebData);         // data isn't exists, request web
        }
    }
    
    function getWebData(error, response, data) {
        var ysDataWeb = new Array();
        res.contentType('text/html; charset=utf-8');
        if (!error && response.statusCode == 200 && data.length > '12#10#rtl#ltr'.length) {
            ysDataWeb.length = 0;

            for (var i = 0; i < data.toString().split('#').length; i++) {
                var index = i, link = '', ysItem,
                    value = data.toString().split('#')[index];

                if (value.indexOf('@') > -1) {
                    link = value.substr(value.indexOf('@') + 1 , value.length);
                    ysItem = value.substr(0, value.indexOf('@'));
                } else {
                    ysItem = value.replace(/\*/gi, '');
                }
                
                ysDataWeb.push({
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

            // db save
            storeData(data, ysDataWeb);
            // response
            res.end(JSON.stringify(ysDataWeb));
        } else {
            res.end('-1');        
        }
    }
    
    function storeData(ysBackup, ysArray) {
        // save Level
        db.save('levels', { "_id" : lvlNum, level_id: lvlNum, name: "Level " + lvlNum });
        
        // insert/update you_says
        var dataRevMode = {};
        dataRevMode["data_" + revMod] = ysBackup;        
        db.update('you_says', { _id : lvlNum + "_" + youSay }, {
            $set: dataRevMode,
            $setOnInsert: { you_says_id: youSay, level_id: lvlNum, title: "", description: "", tags: "", rating: "" }
        }, { upsert: true });
        
        // Multiple insert yousay items
        db.remove('you_says_items', { ln: lvlNum, ys: youSay, rm : revMod }, function (err, result) { 
            db.insert('you_says_items', JSON.stringify(ysArray)); // using "save" doc parameter must be a single document            
        });
    }

    function requestWebData(callback) {
        request({
            //uri: "http://english2go.com:265/yousay/getYousay.aspx?type=FR&NativeLang=12&yousaylevel=4&TargetLang=10&youSayID=1&studentID=307648345", // test url
            uri: url,
            method: "POST",
            encoding: null,
            headers: {
                'cookie': req.session.cook
            }
        }, callback);
    }
};