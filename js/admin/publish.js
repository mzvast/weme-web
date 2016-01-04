$(document).ready(function() {
var shouter = new ko.subscribable();
	
var ViewModel1 = function() {
	var self = this;
	self.itemSize = ko.observable(0);
	// Publish ActivityList itemSize to ViewModel2
	self.itemSize.subscribe(function(value) {
		shouter.notifySubscribers(value,"Publish_itemSizeOfActivityList");
	});	
	self.activityList = ko.observableArray([]);//.extend({ deferred: true });
	self.showRefresh = ko.observable(false);
	self.token =  getCookie("token");
	self.currentPage = ko.observable(1);
	//Subscribe currentPageIndex from ViewModel2
	shouter.subscribe(function(value) {
		self.currentPage(value);
		self.fetchCurrentActivityList();
	},self,"Publish_ActivityListPageNum");

	self.clickedItem = ko.observable();
	// Publish clickedItem id to ViewModel3 
	self.clickedItem.subscribe(function(data) {
		shouter.notifySubscribers(data.authorid(),"Publish_clickedItem");
		console.log("cliked data.id()= "+data.authorid());
	});
	self.currentActivity = ko.observable();
	self.currentActivityNum = ko.observable(0);

	self.showModal = function(data) {
		self.clickedItem(data);
		console.log("cliked详情!");
	};

	self.setCurrentActivity=function(data) {
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
			       		return;
			       } 
			       else{
				        self.writeActivityList(data);
						self.currentActivity(self.activityList()[self.currentActivityNum()])
						self.itemSize(self.itemSize()||json.pages*10);
						return;
			       };
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

	self.fetchCurrentActivityList();

};

	var ViewModel2 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.currentPageIndex = ko.observable(1);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish ActivityList currentPageIndex to ViewModel1
		self.currentPageIndex.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_ActivityListPageNum");
		});
		// Subscribe ActivityList itemSize from ViewModel1
		shouter.subscribe(function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
			console.log("VM2 self.pageNumbers()="+self.pageNumbers());
		},self,"Publish_itemSizeOfActivityList");

		self.goToPage = function(data) {
			self.currentPageIndex(data);
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
			for (var i = 1; i <= lastPageIndex; i++) {
				self.pageNumbers.push(i);
			};
		};

		self.nextPage = function() {
			self.currentPageIndex(self.currentPageIndex()+1);
			console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

		self.previousPage = function() {
			self.currentPageIndex(self.currentPageIndex()-1);
			console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

	};

	var ViewModel3 = function() {
		var self = this;
		self.token = getCookie("token");
		self.currentId = ko.observable();
		self.currentProfile = ko.observable();
		// Subscribe Publish_clickedItem from ViewModel1
		shouter.subscribe(function(id) {
			self.currentId(id);
			self.getProfileById();
			console.log("self.currentId()==="+self.currentId());
		},self,"Publish_clickedItem");

		self.getProfileById = function()  {
			console.log("正在获取个人信息!");
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofilebyid",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"id":self.currentId(),
					  },
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
				       };
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					})
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
	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();//ActivitList
		self.ViewModel2 = new ViewModel2();//ActivitList pignation
		self.ViewModel3 = new ViewModel3();//Profile detail
	})();

ko.applyBindings(masterVM)
})