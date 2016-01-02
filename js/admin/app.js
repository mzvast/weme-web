$(document).ready(function() {
	
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
	self.userList = ko.observableArray([]);
	self.activityList = ko.observableArray([]);
	self.showRefresh = ko.observable(false);
	self.token =  getCookie("token");
	self.currentPage = ko.observable(1);
	self.lastPage = ko.observable(1);
	self.currentActivity = ko.observable();
	self.currentActivityNum = ko.observable(0);
	self.getProfile=function() {
		console.log("Button has been clicked!");
		$.ajax({
				  type: "POST",
				  url: "/api/post/getprofile",
				  dataType: "json",
				  data:{
				  	"token": self.token
				  },
				  success: function(json) {
				       console.log(json);
				       $.ajax(this);//automatic retry after fail
                		return;
				    },
				  error: function(e) {
				       console.log(e);
    				}
				});
	};
	self.setCurrentActivity=function(data) {
		var id = data.id();
		self.currentActivityNum((self.activityList().indexOf(data))) ;
		self.currentActivity(self.activityList()[self.currentActivityNum()]);
		console.log("hello: "+id);
		console.log("index: "+self.activityList().indexOf(data));
		console.log("currentActivityNum: "+self.currentActivityNum());
	};
	self.hasNext=ko.observable(function() {
		console.log(self.currentPage()+"/"+self.lastPage());
		return self.currentPage()!==self.lastPage();
	});
	self.detectLastPage=function() {
		console.log("正在探测活动信息! page:"+(self.lastPage()+1));
		$.ajax({
				  type: "POST",
				  url: "/api/post/getallactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"page": self.lastPage()+1
				  },
				})
		.done(function(json) {
					var data = json.result
			       console.dir(data.length);
			       if (data.length>0) {
			       		self.lastPage(self.lastPage()+1);
			       		console.log("last page is : "+self.lastPage());
			       		self.detectLastPage()
			       }
			       else{
			       		console.log("last page is : "+self.lastPage());
			       		return;
			       };
			  //      data.forEach(function(activityItem) {
					// self.activityList.push(new Activity(activityItem));
					// }); 
					// self.currentActivity(self.activityList()[self.currentActivityNum()])
					// self.showRefresh(data.length>1?false:true);//设置按钮
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});		
	};
	self.fetchPreviousActivityList=function() {
		console.log("正在获取活动信息! page:"+(self.currentPage()-1));
		$.ajax({
				  type: "POST",
				  url: "/api/post/getallactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"page": self.currentPage()-1
				  },
				})
		.done(function(json) {
					var data = json.result
			       console.dir(data.length);
			       if (data.length>0) {
			       		self.currentPage(self.currentPage()-1);
			       		self.currentActivityNum(0);
			       		self.updateActivityList();
			       };
			  //      data.forEach(function(activityItem) {
					// self.activityList.push(new Activity(activityItem));
					// }); 
					// self.currentActivity(self.activityList()[self.currentActivityNum()])
					// self.showRefresh(data.length>1?false:true);//设置按钮
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});
	};	
	self.fetchNextActivityList=function() {
		console.log("正在获取活动信息! page:"+(self.currentPage()+1));
		$.ajax({
				  type: "POST",
				  url: "/api/post/getallactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"page": self.currentPage()+1
				  },
				})
		.done(function(json) {
					var data = json.result
			       console.dir(data.length);
			       if (data.length>0) {
			       		self.currentPage(self.currentPage()+1);
			       		self.currentActivityNum(0);
			       		self.updateActivityList();
			       };
			  //      data.forEach(function(activityItem) {
					// self.activityList.push(new Activity(activityItem));
					// }); 
					// self.currentActivity(self.activityList()[self.currentActivityNum()])
					// self.showRefresh(data.length>1?false:true);//设置按钮
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});
	};

	self.updateActivityList=function() {
		console.log("正在获取活动信息! page:"+self.currentPage());
		$.ajax({
				  type: "POST",
				  url: "/api/post/getallactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"page": self.currentPage()
				  },
				})
		.done(function(json) {
					var data = json.result
			       console.dir(data);
			       self.activityList([]);
			       data.forEach(function(activityItem) {
					self.activityList.push(new Activity(activityItem));
					}); 
					self.currentActivity(self.activityList()[self.currentActivityNum()])
					self.showRefresh(data.length>1?false:true);//设置按钮
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});
	};
	self.setPassActivity=function(data) {
		console.log("正在设置审核通过!");
		$.ajax({
				  type: "POST",
				  url: "/api/post/setpassactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"activitylist":[data.id()]
				  },
				  success: function(json) {
				       console.dir(json.result);
				       self.updateActivityList();
				    },
				  error: function(e) {
				       console.log(e);
                		return;
    				}
				});
	};	

	self.setNoPassActivity=function(data) {
		console.log("正在设置审核否决!");
		$.ajax({
				  type: "POST",
				  url: "/api/post/setnopassactivity",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"activitylist":[data.id()]
				  },
				  success: function(json) {
				       console.dir(json.result);
				       self.updateActivityList();
				    },
				  error: function(e) {
				       console.log(e);
                		return;
    				}
				});
	};
	initialUsers.forEach(function(UserItem) {
		self.userList.push(new User(UserItem));
	});
		self.updateActivityList(); 
		self.detectLastPage();


};

var User = function(data) {
	this.birthday=ko.observable(data.birthday);
	this.degree=ko.observable(data.degree);
	this.department=ko.observable(data.department);
	this.enrollment=ko.observable(data.enrollment);
	this.gender=ko.observable(data.gender);
	this.hobby=ko.observable(data.hobby);
	this.hometown=ko.observable(data.hometown);
	this.id=ko.observable(data.id);
	this.lookcount=ko.observable(data.lookcount);
	this.name=ko.observable(data.name);
	this.phone=ko.observable(data.phone);
	this.preference=ko.observable(data.preference);
	this.qq=ko.observable(data.qq);
	this.reason=ko.observable(data.reason);
	this.school=ko.observable(data.school);
	this.state=ko.observable(data.state);
	this.token=ko.observable(data.token);
	this.username=ko.observable(data.username);
	this.wechat=ko.observable(data.wechat);   
};

var Activity = function (data) {
	this.advertise=ko.observable(data.advertise);
	this.author=ko.observable(data.author);
	this.authorid=ko.observable(data.authorid);
	this.detail=ko.observable(data.detail);
	this.gender=ko.observable(data.gender);
	this.id=ko.observable(data.id);
	this.imageurl=ko.observable(data.imageurl);
	this.location=ko.observable(data.location);
	this.number=ko.observable(data.number);
	this.remark=ko.observable(data.remark) ;
	this.school=ko.observable(data.school) ;
	this.signnumber=ko.observable(data.signnumber);
	this.state=ko.observable(data.state) ;
	this.time=ko.observable(data.time) ;
	this.title=ko.observable(data.title);
	this.whetherimage=ko.observable(data.whetherimage);
}
ko.options.deferUpdates = true;
ko.applyBindings(new ViewModel('deferred'))
})