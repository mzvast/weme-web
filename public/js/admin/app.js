initialUsers=[
	{
		birthday:"1991-03-04",
		degree:"硕士",
		department:"仪器仪表工程",
		enrollment:"2014",
		gender:"男",
		hobby:"",
		hometown:"呵呵",
		id:958,
		lookcount:"5",
		name:"王小阳",
		phone:"18667047301",
		preference:"",
		qq:"",
		reason:"",
		school:"东南大学",
		state:"successful",
		token:"884d20eb7ceb8e83f8ab7cb89fa238c0",
		username:"mzvast",
		wechat:""
	}	
];
var ViewModel = function() {
	var self = this;
	this.userList = ko.observableArray([]);
	self.getProfile=function() {
		console.log("Button has been clicked!");
		$.ajax({
				  type: "GET",
				  url: "/api/post",
				  dataType: "json",
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
	this.birthday=ko.observable(data.birthday)
	this.degree=ko.observable(data.degree)
	this.department=ko.observable(data.department)
	this.enrollment=ko.observable(data.enrollment)
	this.gender=ko.observable(data.gender)
	this.hobby=ko.observable(data.hobby)
	this.hometown=ko.observable(data.hometown)
	this.id=ko.observable(data.id)
	this.lookcount=ko.observable(data.lookcount)
	this.name=ko.observable(data.name)
	this.phone=ko.observable(data.phone)
	this.preference=ko.observable(data.preference)
	this.qq=ko.observable(data.qq)
	this.reason=ko.observable(data.reason)
	this.school=ko.observable(data.school)
	this.state=ko.observable(data.state)
	this.token=ko.observable(data.token)
	this.username=ko.observable(data.username)
	this.wechat=ko.observable(data.wechat)      
};

ko.applyBindings(new ViewModel())