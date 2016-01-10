var ActivityLite = function(data) {//不是完整的信息
	var self = this;
	self.id=ko.observable(data.id);
	self.title=ko.observable(data.title);
	self.number=ko.observable(data.number);
	self.location=ko.observable(data.location);
	self.time=ko.observable(data.time);
	self.status=ko.observable(data.status);
};
var Signup = function(data) {
	var self = this;
	self.isSelected = ko.observable(false);
	self.id = ko.observable(data.id);
	self.name = ko.observable(data.name);
	self.school = ko.observable(data.school);
	self.gender = ko.observable(data.gender);
	self.flag = ko.observable(data.flag);
	self.imgUrlSmall = ko.computed(function() {
		return "//218.244.147.240:80/avatar/"+self.id()+"_thumbnail.jpg";
	});		
	self.flagStatus = ko.computed(function() {
		return self.flag()==1?"通过":"未通过";
	});
};
var Profile = function(data) {
	var self = this;
	self.birthday = ko.observable(data.birthday?data.birthday:"");
	self.degree = ko.observable(data.degree?data.degree:"");
	self.department = ko.observable(data.department?data.department:"");
	self.enrollment = ko.observable(data.enrollment?data.enrollment:"");
	self.gender = ko.observable(data.gender?data.gender:"");
	self.hobby = ko.observable(data.hobby?data.hobby:"");
	self.hometown = ko.observable(data.hometown?data.hometown:"");
	self.id = ko.observable(data.id?data.id:"");
	self.lookcount = ko.observable(data.lookcount?data.lookcount:"");
	self.name = ko.observable(data.name?data.name:"");
	self.phone = ko.observable(data.phone?data.phone:"");
	self.preference = ko.observable(data.preference?data.preference:"");
	self.qq = ko.observable(data.qq?data.qq:"");
	// self.reason = ko.observable(data.reason?data.reason:"");
	self.school = ko.observable(data.school?data.school:"");
	// self.state = ko.observable(data.state?data.state:"");
	self.username = ko.observable(data.username?data.username:"");
	self.wechat = ko.observable(data.wechat?data.wechat:"");
	self.phoneDisplay = ko.computed(function() {
		if(self.phone()==""){
			return "";
		}else
		{
			return self.phone().slice(0,3)+"****"+self.phone().slice(7,11);
		}
	});
	self.imgUrl = ko.computed(function() {
		return "//218.244.147.240:80/avatar/"+self.id();
	});
};