var ViewModel = function() {
	var self = this;
	self.username = ko.observable();
	self.password = ko.observable();
	self.doLogin=function() {
		console.log(md5(self.password));
	};
};

ko.applyBindings(new ViewModel())