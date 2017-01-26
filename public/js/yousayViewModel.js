
var yousayViewModel = function () {
    this.you_say_num = ko.observable(1);
    this.you_say_item_num = ko.observable(0);


    this.you_say_item_num_computed = ko.computed(function () {
        // this.you_say_item_num() == STARTED_ITEM_NUM (-1) in case of ERROR or after YouSay is started
        return this.you_say_item_num() == STARTED_ITEM_NUM ? '' : '(' + this.you_say_item_num() + '/' + ys_data.length + ')';
    }, this);

 };
    
var ysViewModel = new yousayViewModel();
ko.applyBindings(ysViewModel);

