var loopRequests = function () {
    var self = this,
        mods = ['fr', 'sr', 'br'];

    self.hasStarted = ko.observable(false);
    self.lvlsMin = ko.observable(1);
    self.lvlsMax = ko.observable(9); // 9
    self.yous = ko.observable(37); // 37
    self.wait = ko.observable(1000);

    self.logResult = function (sts, stsText, resp, m, l, y, t) {
        var line = '', curTime = new Date().getTime() - t;
        line = 'md=' + m + ', ll=' + l + ', ys=' + y +
            ', time=' + curTime + 'ms, length=' + sts.length + ', status=' + stsText.toUpperCase();

        $('#ta').text($('#ta').text() + line + '\n');
    }

    self.request = function (m, l, y, t) {
        $.ajax({
            url: '/yousay_data/?rm=' + m + '&ln=' + l + '&ys=' + y,
            //url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http://www.ynet.co.il/Integration/StoryRss2.xml',
            success: function (s, st, r) {
                self.logResult(s, st, r, m, l, y, t)
            },
            error: function (s, st, r) {
                self.logResult(s, st, r, m, l, y, t)
            },
            type: 'get',
        });
    }

    self.runLoop = function (_m, _l, _y) {
        var y = (_y < self.yous()) ? parseInt(_y) + 1 : 1,
        	l = (_y >= self.yous() && _m >= (mods.length - 1)) ? parseInt(_l) + 1 : _l,
            m = (_y >= self.yous() && _m < (mods.length - 1)) ? parseInt(_m) + 1 : _m;

        // youSay is ends & mode is end
        if (_y >= self.yous() && _m >= (mods.length - 1)) {
            m = 0;
        }

        if (self.hasStarted()) {
            var t = new Date().getTime();
            self.request(mods[m], l, y, t);
            
            if(!(l >= self.lvlsMax() && y >= self.yous() && _m >= (mods.length - 1))){
                setTimeout(function () { self.runLoop(m, l, y); }, self.wait());
            }
        } else {
            self.hasStarted(false);
        }
    }

    self.start = function () {
        self.hasStarted(true);
        self.runLoop(0, self.lvlsMin(), 0);
    }

    self.stop = function () {
        self.hasStarted(false);
    }

    self.clear = function () {
        $('#ta').text('');
    }
}

ko.applyBindings(new loopRequests());
