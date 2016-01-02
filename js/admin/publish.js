$(document).ready(function() {
	
var ViewModel = function() {
	var self = this;
	self.activityList = ko.observableArray([]).extend({ deferred: true });
	self.showRefresh = ko.observable(false);
	self.token =  getCookie("token");
	self.currentPage = ko.observable(1);
	self.lastPage = ko.observable(1);
	self.currentActivity = ko.observable();
	self.currentActivityNum = ko.observable(0);
	self.hasNext=ko.observable(true);
	self.hasPrevious=ko.observable(false);
	self.setCurrentActivity=function(data) {
		var id = data.id();
		self.currentActivityNum((self.activityList().indexOf(data))) ;
		self.currentActivity(self.activityList()[self.currentActivityNum()]);
		console.log("hello: "+id);
		console.log("index: "+self.activityList().indexOf(data));
		console.log("currentActivityNum: "+self.currentActivityNum());
	};

//探测下一页，每次只探测下一页，原本设计反复回掉
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
			       if (data.length!==0) {
			       		self.lastPage(self.lastPage()+1);
			       		 return;
			       }
			       else{
			       		console.log("last page is : "+self.lastPage());
			       		return;
			       };
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				})
		.always(function() {
			self.setHasNext();
			self.setHasPrecious();
		});		
	};

	self.setHasNext=function() {
		self.hasNext(self.currentPage()!==self.lastPage());
		console.log("hasNext: "+self.hasNext());
		return;
	};
	self.setHasPrecious=function() {
		self.hasPrevious(self.currentPage()!==1);
		console.log("hasPrevious: "+self.hasPrevious());
		return;
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
			       		self.writeActivityList(data);
			       		return;
			       };
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
			       		self.writeActivityList(data);
			       		return;
			       };
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});
	};
	self.writeActivityList=function(data) {
		self.activityList([]);
		data.forEach(function(activityItem) {
			self.activityList.push(new Activity(activityItem));
		});
		self.detectLastPage();
	};
	self.fetchCurrentActivityList=function() {
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
			       if (data.length==0) {
			       		self.showRefresh(true);
			       		return;
			       } 
			       else{
				        self.writeActivityList(data);
						self.currentActivity(self.activityList()[self.currentActivityNum()])
						self.showRefresh(false);
						return;
			       };
				})
		.fail(function(e) {
				  	self.showRefresh(true);
				       console.log(e);
                		return;

				});
	}();
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
				       self.fetchCurrentActivityList();
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
				       self.fetchCurrentActivityList();
				    },
				  error: function(e) {
				       console.log(e);
                		return;
    				}
				});
	};


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
ko.applyBindings(new ViewModel())
})