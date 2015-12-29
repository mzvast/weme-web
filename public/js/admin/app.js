initialUsers=[
	{
		name:'Tabby',
		sex:'male',
		school:'SEU'
	},
	{
		name:'Fucker',
		sex:'male',
		school:'SEU'
	},
	{
		name:'bitch',
		sex:'Female',
		school:'SEU'
	},	{
		name:'egg',
		sex:'Female',
		school:'SEU'
	},	{
		name:'dick',
		sex:'Female',
		school:'SEU'
	},	{
		name:'pig',
		sex:'Female',
		school:'SEU'
	},	{
		name:'peer',
		sex:'Female',
		school:'SEU'
	},	{
		name:'Linda',
		sex:'Female',
		school:'SEU'
	}
	
];
var ViewModel = function() {
	var self = this;
	this.userList = ko.observableArray([]);
	self.getProfile=function() {
		console.log("Button has been clicked!");
		$.ajax({
				  type: "POST",
				  url: "http://218.244.147.240:8080/getprofile",
				  dataType: "jsonp",
				  contentType: "json",
				  data: {
				    "token": "884d20eb7ceb8e83f8ab7cb89fa238c0"
				  },
				  jsonp: false,
				  jsonpCallback: "myJsonMethod",
				  success: function(json) {
				       console.log(json);
				    },
				  error: function(e) {
				       console.log(e);
    				}
				});
	};
	initialUsers.forEach(function(UserItem) {
		self.userList.push(new User(UserItem));
	});


};

var User = function(data) {
	this.name = ko.observable(data.name);
	this.sex = ko.observable(data.sex);
	this.school = ko.observable(data.school);        
};

ko.applyBindings(new ViewModel())