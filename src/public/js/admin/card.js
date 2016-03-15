/*global getCookie*/
$(document).ready(function() {
	
var ViewModel1 = function() {
	var self = this;
	// Publish ActivityList itemSize to ViewModel2
	self.itemSize = ko.observable(0).publishOn("Publish_itemSizeOfActivityList");
	

	self.activityList = ko.observableArray([]);//.extend({ deferred: true });
	self.showRefresh = ko.observable(false);
	self.token =  getCookie("token");
	self.currentPage = ko.observable(1);
	//Subscribe currentPageIndex from ViewModel2
	ko.postbox.subscribe("Publish_ActivityListPageNum",function(value) {
		self.currentPage(value);
		self.fetchCurrentActivityList();
	},self);

	// Publish clickedItem id to ViewModel3 
	self.clickedItem = ko.observable().publishOn("Publish_clickedItem");
	
	self.currentActivity = ko.observable();
	self.currentActivityNum = ko.observable(0);

	self.showModal = function(data) {
		self.clickedItem(data);
		console.log("cliked详情!");
		console.log("data==",data);
	};

	self.setCurrentActivity=function(data) {
		self.clickedItem(data);
		var id = data.id();
		self.currentActivityNum((self.activityList().indexOf(data))) ;
		self.currentActivity(self.activityList()[self.currentActivityNum()]);
		console.log("hello: "+id);
		console.log("index: "+self.activityList().indexOf(data));
		console.log("currentActivityNum: "+self.currentActivityNum());
	};

	self.writeActivityList=function(data) {
		self.activityList([]);
		data.forEach(function(activityItem) {
			self.activityList.push(new Activity(activityItem));
		});
	};
	self.fetchCurrentActivityList=function() {
		console.log("正在获取活动信息! page:"+self.currentPage());
		$.ajax({
				  type: "POST",
				  url: "/api/post/getallusercard",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"page": self.currentPage()
				  }
				})
		.done(function(json) {
					var data = json.result;
			       console.dir(data);			       
			       if (data.length==0) {
			       		return;
			       } 
			       else{
				        self.writeActivityList(data);
						self.currentActivity(self.activityList()[self.currentActivityNum()]);
						self.itemSize(self.itemSize()||json.pages*10);
						self.setCurrentActivity(self.activityList()[0]);
						console.log("pages",json.pages);
						return;
			       }
				})
		.fail(function(e) {
				       console.log(e);
                		return;

				});
	};
	self.setPassActivity=function(data) {
		console.log("正在设置审核通过!");
		$.ajax({
				  type: "POST",
				  url: "/api/post/setpassusercard",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"usercardlist":[data.id()]
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
				  url: "/api/post/setnopassusercard",
				  dataType: "json",
				  data:{
				  	"token": self.token,
				  	"usercardlist":[data.id()]
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

	self.fetchCurrentActivityList();

};

	var ViewModel2 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish ActivityList currentPageIndex to ViewModel1
		self.currentPageIndex = ko.observable(1).publishOn("Publish_ActivityListPageNum");
		// Subscribe ActivityList itemSize from ViewModel1
		ko.postbox.subscribe("Publish_itemSizeOfActivityList",function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
			console.log("VM2 self.pageNumbers()="+self.pageNumbers());
		},self);		

		self.goToPage = function(data) {
			self.currentPageIndex(data);
			self.makePageNumbers(self.lastPageIndex());
		};
		self.gotoLastPage = function() {
			self.currentPageIndex(self.lastPageIndex());
			self.makePageNumbers(self.lastPageIndex());
		};		
		self.gotoFirstPage = function() {
			self.currentPageIndex(1);
			self.makePageNumbers(self.lastPageIndex());
		};
		self.hasNext=ko.computed(function() {
			console.log("VM2 self.currentPageIndex()="+self.currentPageIndex());
			console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
			return self.currentPageIndex()!==self.lastPageIndex();
		});

		self.hasPrecious=ko.computed(function() {
			return self.currentPageIndex()>1;
		});

		self.makePageNumbers =function(lastPageIndex) {
			self.pageNumbers.removeAll();
			if (lastPageIndex>5&&self.currentPageIndex()>2) {
				for (var i = self.currentPageIndex()-2,j=0; i <= lastPageIndex&&j<5; i++,j++) {
					self.pageNumbers.push(i);
				}
			}else{
				for (var i = 1,j=0; i <= lastPageIndex&&j<5; i++,j++) {
					self.pageNumbers.push(i);
				}
			}
		};

		self.nextPage = function() {
			self.currentPageIndex(self.currentPageIndex()+1);
			self.makePageNumbers(self.lastPageIndex());
			console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

		self.previousPage = function() {
			self.currentPageIndex(self.currentPageIndex()-1);
			self.makePageNumbers(self.lastPageIndex());
			console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

	};

	var ViewModel3 = function() {
		var self = this;
		self.token = getCookie("token");
		self.currentId = ko.observable();
		self.currentProfile = ko.observable();
		// Subscribe Publish_clickedItem from ViewModel1
		ko.postbox.subscribe("Publish_clickedItem",function(data) {
			self.currentId(data.userid());
			self.getProfileById();
			console.log("self.currentId()==="+self.currentId());
		},self);

		self.getProfileById = function()  {
			console.log("正在获取个人信息!");
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofilebyid",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"id":self.currentId()
					  }
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		console.dir("no data");
				       		// self.writeList(data);
				       		console.dir(json);
				       		return;
				       } 
				       else{
				       		console.dir("got data!");
				       		// self.writeList(data);
				       		console.dir(json);
				       		self.currentProfile(new Profile(json));
				       		console.dir(self.currentProfile());
							return;
				       }
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					});
		};
	};


var Profile = function(data) {
	this.birthday = ko.observable(data.birthday);
	this.degree = ko.observable(data.degree);
	this.department = ko.observable(data.department);
	this.enrollment = ko.observable(data.enrollment);
	this.gender = ko.observable(data.gender);
	this.hobby = ko.observable(data.hobby);
	this.hometown = ko.observable(data.hometown);
	this.id = ko.observable(data.id);
	this.lookcount = ko.observable(data.lookcount);
	this.name = ko.observable(data.name);
	this.phone = ko.observable(data.phone);
	this.preference = ko.observable(data.preference);
	this.qq = ko.observable(data.qq);
	this.reason = ko.observable(data.reason);
	this.school = ko.observable(data.school);
	this.state = ko.observable(data.state);
	this.username = ko.observable(data.username);
	this.wechat = ko.observable(data.wechat);
};

var Activity = function (data) {
	this.avatarurl = ko.observable(data.avatarurl);
	this.cardflag = ko.observable(data.cardflag);
	this.disable = ko.observable(data.disable);
	this.gender = ko.observable(data.gender);
	this.id = ko.observable(data.id);
	this.name = ko.observable(data.name);
	this.userid = ko.observable(data.userid);
	this.voiceurl = ko.observable(data.voiceurl);
};
	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();//ActivitList
		self.ViewModel2 = new ViewModel2();//ActivitList pignation
		self.ViewModel3 = new ViewModel3();//Profile detail
	})();

ko.applyBindings(masterVM);
});