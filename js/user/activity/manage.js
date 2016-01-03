$(document).ready(function() {
	var ActivityLite = function(data) {//不是完整的信息
		var self = this;
		self.id=ko.observable(data.id);
		self.title=ko.observable(data.title);
		self.number=ko.observable(data.number);
		self.location=ko.observable(data.location);
		self.time=ko.observable(data.time);
		self.status=ko.observable(data.status);
	};
	var SignupUser = function(data) {
		var self = this;
		self.id = ko.observable(data.id);
		self.name = ko.observable(data.name);
		self.school = ko.observable(data.school);
		self.gender = ko.observable(data.gender);
		self.flag = ko.observable(data.flag);
		self.flagStatus = ko.computed(function() {
			return self.flag()==1?"通过":"未通过";
		});
	};

	var ViewModel = function() {
		var self = this;
		self.activityList = ko.observableArray();
		self.signupUserList = ko.observableArray();
		self.currentPublishedActivity = ko.observable();
		self.currentActivity = ko.observable();
		self.currentActivityPage = ko.observable(1);
		self.currentSignupUserListPage = ko.observable(1);
		self.token = "027706ea56487ce6af2ab2b0e65268fc";
		self.writeActivityList=function(data) {
			self.activityList([]);
			data.forEach(function(activityItem) {
				self.activityList.push(new ActivityLite(activityItem));
			});
		};		
		self.writeSignupUserList=function(data) {
			self.signupUserList([]);
			data.forEach(function(signupUserItem) {
				self.signupUserList.push(new SignupUser(signupUserItem));
			});
		};
		self.fetchPublishedActivity =function() {
			console.log("正在获取活动信息! page:"+self.currentActivityPage());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getpublishactivity",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"page": self.currentActivityPage()
					  },
					})
			.done(function(json) {
						var data = json.result
				       console.dir(data);			       
				       if (data.length==0) {
				       		console.dir("no more data");
				       		console.dir(data);
				       		return;
				       } 
				       else{
				       		console.dir("got data!");
				       		self.writeActivityList(data);
				       		self.currentActivity(self.activityList()[0]);
				       		console.dir(data);
							return;
				       };
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					})
		}();
		self.getSignupUserList = function(data) {
			console.log("activityid: "+data.id);
			self.fetchSignupUserList(data.id);
			self.currentActivity(data);
			console.dir(self.currentActivity());
			return;
		};
		self.fetchSignupUserList =function(activityId) {
			console.log("正在报名信息! page:"+self.currentSignupUserListPage());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":activityId,
					  	"page": self.currentSignupUserListPage()
					  },
					})
			.done(function(json) {
						var data = json.result
				       console.dir(data);			       
				       if (data.length==0) {
				       		console.dir("no more data");
				       		self.writeSignupUserList(data);
				       		console.dir(data);
				       		return;
				       } 
				       else{
				       		console.dir("got data!");
				       		self.writeSignupUserList(data);
				       		console.dir(data);
							return;
				       };
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					})
		};

	};
	ko.applyBindings(new ViewModel());
});