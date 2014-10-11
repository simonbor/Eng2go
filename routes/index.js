﻿
/*
 * GET home page.
 */
/*
exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};
exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};
exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
}; */

exports.getYousayData = function (req, res) {
    var request = require("request");
    
    if (!req.session.cook) {
        request({
            uri: "http://english2go.com/studentZone/default.asp",
            method: "POST",
            form: {
                username: 'il4736gg',
                password: 'afs25'
            }
        }, function (error, response, body) {
            if (error) {
                return console.error('Authentication failed: ', error);
            }
            req.session.cook = response.headers['set-cookie'].toString();
            requestYousayData();
        });
    } else {
        requestYousayData();
    }
    
    function requestYousayData(){
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
                res.contentType('text/html'); // 'text/html; charset=windows-1255'

                // Difficults to convert 'body' to json string before encoding hebrew problems
                // body  - is a buffer
                // toString() encode values by 'UTF8' encoding and it is broke hevrew data
                //var jsonRes = '[' + body.toString('').replace(/#/gi, '][') + ']';
                //var buffer = new Buffer(body.toString());
                
                res.end(body);
            }
        });
    }
};

