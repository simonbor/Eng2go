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

exports.mtnc = function (req, res) {
    if (!req.session.cook) {
        res.redirect('/login');
    } else {
        res.render('mtnc', { title: 'Maintenance' });
    }
};


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
        res.render('review', { title: 'Review', ll: req.query.ll }); // am - Admin Mode
    }
};
exports.auth = function (req, res) {
    if (req.method == 'POST') {
        var username = req.body.username;
        var password = req.body.password;
        var request = require("request");
        
        request({
            uri: "http://english2go.com:265/netMain.aspx?type=S", // the old one - uri: "http://english2go.com/studentZone/default.asp",
            method: "POST",
            form: {
                username: username,
                pwd: password
            }
        }, function (error, response, body) {
            if (error || response.headers.location.indexOf('english2go.com') > -1) {
                res.redirect('/login');
            } else {
                req.session.cook = response.headers['set-cookie'].toString();
                res.setHeader("set-cookie", response.headers['set-cookie'].toString());
                res.redirect('/review?ll=4');
            }
        });
    }
};

exports.contact = function (req, res) {
    if (!req.session.cook)
        res.redirect('/login');
        
    if (req.method == 'POST') {
        var nodemailer = require('nodemailer');
        // Mail send mechanism place here
        // The previous version see in the Source Safe history
        res.render('contact', { title: 'Contact', name: req.body.name });
    } else {
        res.render('contact', { title: 'Contact' });
    }
};
