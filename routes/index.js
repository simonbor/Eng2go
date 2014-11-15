/*  * GET home page.  */

// Authentication status check function - not in use
var auth = function (lastCookie){
    var request = require("request");
    request({
        uri: "http://english2go.com/studentZone/VocabulabTab.asp",
        method: "GET",
        asynch: false,
        headers: {
            'cookie': lastCookie
        }
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return false;
        }
        return true;
    });
}

exports.index = function (req, res) {
    if (!req.session.cook) {
        res.redirect('/login');
    } else {
        res.render('index', { title: 'About' });
    }
};
exports.login = function (req, res) {
    res.render('login', { title: 'Login' });
};
exports.review = function (req, res) {
    if (!req.session.cook) {
        res.redirect('/login');
    } else {
        res.render('review', { title: 'Review', am: req.query.am }); // am - Admin Mode
    }
};
exports.auth = function (req, res) {
    if (req.method == 'POST') {
        var username = req.body.username;
        var password = req.body.password;
        var request = require("request");
        
        request({
            uri: "http://english2go.com/studentZone/default.asp",
            method: "POST",
            form: {
                username: username,
                password: password,
            }
        }, function (error, response, body) {
            if (error || response.headers.location.indexOf('english2go.com') > -1) {
                res.redirect('/login');
            } else {
                req.session.cook = response.headers['set-cookie'].toString();
                res.setHeader("set-cookie", response.headers['set-cookie'].toString());
                res.redirect('/review');
            }
        });
    }
};

exports.getYousayData = function (req, res) {
    var request = require("request");
    
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
            res.contentType('text/html; charset=windows-1255');
            
            // Difficults to convert 'body' to json string before encoding hebrew problems
            // body  - is a buffer
            // toString() encode values by 'UTF8' encoding and it is broke hevrew data
            //var jsonRes = '[' + body.toString('').replace(/#/gi, '][') + ']';
            //var buffer = new Buffer(body.toString());
            
            res.end(body);
        }
    });
};

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
