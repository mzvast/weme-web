$(function() {

	var ViewModel = function() {
		var self = this;
		self.username = ko.observable();
		self.password = ko.observable();
		self.passhash = ko.computed(function() {
        	return md5(self.password());
    	});

	};

	ko.applyBindings(new ViewModel())
	
})