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
	var Signup = function(data) {
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
	var shouter = new ko.subscribable();
	//我发布的活动列表
	var ViewModel1 = function() {
		var self = this;
		self.itemSize = ko.observable(0);
		self.list = ko.observableArray();
		self.currentPageIndex = ko.observable(1);
		self.token = "027706ea56487ce6af2ab2b0e65268fc";
		// Publish ActivityList itemSize to ViewModel2
		self.itemSize.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_itemSizeOfActivityList");
		});
		self.selectedItem = ko.observable();
		// Publish selectedActivityItem to ViewModel3 
		self.selectedItem.subscribe(function(data) {
			shouter.notifySubscribers(data,"Publish_selectedActivity");
		});
		// Subscribe currentPageIndex change from ViewModel2 
		shouter.subscribe(function(value) {
			self.currentPageIndex(value);
			self.fetchPublishedActivity();
			console.log("self.currentPageIndex()="+self.currentPageIndex());
		},self,"Publish_ActivityListPageNum");

		self.getSignupList =function(data) {
			self.selectedItem(data);
		};

		self.writeActivityList=function(data) {
			self.list([]);
			data.forEach(function(activityItem) {
				self.list.push(new ActivityLite(activityItem));
			});
		};	


		self.fetchPublishedActivity =function() {
			console.log("正在获取已发布活动信息! page:"+self.currentPageIndex());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getpublishactivity",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"page": self.currentPageIndex()
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
				       		self.selectedItem(self.list()[0]);
				       		// self.itemSize(19);//TODO:set itemSize
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

		self.fetchPublishedActivity();//初始化的时候先运行一遍


	};
	//发布的活动的pignation
	var ViewModel2 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.currentPageIndex = ko.observable(1);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish currentPageIndex to ViewModel1
		self.currentPageIndex.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_ActivityListPageNum");
		});
		// Subscribe ActivityList itemSize
		shouter.subscribe(function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
			console.log("VM2 self.pageNumbers()="+self.pageNumbers());
		},self,"Publish_itemSizeOfActivityList");

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
	//报名用户列表
	var ViewModel3 = function() {
		var self = this;
		self.itemSize = ko.observable(0);
		// Publish SignupList itemSize to ViewModel4
		self.itemSize.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_itemSizeOfSignupList");
		});
		self.token = "027706ea56487ce6af2ab2b0e65268fc";
		self.list = ko.observableArray();
		self.id = ko.observable(3);
		self.currentPageIndex = ko.observable(1);
		// Subscribe selectedActivityItem from ViewModel1
		shouter.subscribe(function(data) {
			self.id(data.id());
			self.fetchList(self.id());
		},self,"Publish_selectedActivity");		
		// Subscribe currentPageIndex from ViewModel4
		shouter.subscribe(function(value) {
			self.currentPageIndex(value);
			self.fetchList(self.id());
		},self,"Publish_SignupListPageNum");


		self.writeList=function(data) {
			self.list([]);
			data.forEach(function(signupItem) {
				self.list.push(new Signup(signupItem));
			});
		};

		self.fetchList =function(activityId) {
			console.log("正在获取报名信息! page:"+self.currentPageIndex());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":activityId,
					  	"page": self.currentPageIndex()
					  },
					})
			.done(function(json) {
						var data = json.result
				       console.dir(data);			       
				       if (data.length==0) {
				       		console.dir("no more data");
				       		self.writeList(data);
				       		console.dir(data);
				       		return;
				       } 
				       else{
				       		console.dir("got data!");
				       		self.writeList(data);
				       		console.dir(data);
				       		// self.itemSize(19);//TODO:set itemSize
							return;
				       };
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					})
		};

		self.fetchList(self.id());
	};

	//报名用户的pignation
	var ViewModel4 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.currentPageIndex = ko.observable(1);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish SignupList currentPageIndex to ViewModel3
		self.currentPageIndex.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_SignupListPageNum");
		});
		// Subscribe SignupList itemSize from ViewModel3
		shouter.subscribe(function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			console.log("VM4 self.lastPageIndex()="+self.lastPageIndex());
			console.log("VM4 self.pageNumbers()="+self.pageNumbers());
		},self,"Publish_itemSizeOfSignupList");

		self.hasNext=ko.computed(function() {
			console.log("VM4 self.currentPageIndex()="+self.currentPageIndex());
			console.log("VM4 self.lastPageIndex()="+self.lastPageIndex());
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

	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();
		self.ViewModel2 = new ViewModel2();
		self.ViewModel3 = new ViewModel3();
		self.ViewModel4 = new ViewModel4();
	})();

	ko.applyBindings(masterVM);
});