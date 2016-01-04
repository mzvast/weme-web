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

	var ViewModel1 = function() {
		var self = this;
		self.itemSizeOfActivityList = ko.observable(0);
		self.itemSizeOfActivityList.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_itemSizeOfActivityList");
		});
		self.activityList = ko.observableArray();
		self.selectedActivity = ko.observable();
		self.selectedActivity.subscribe(function(data) {
			shouter.notifySubscribers(data,"Publish_selectedActivity");
		});

		self.currentActivityListPageNum = ko.observable(1);
		self.token = "027706ea56487ce6af2ab2b0e65268fc";

		shouter.subscribe(function(value) {
			self.currentActivityListPageNum(value);
			self.fetchPublishedActivity();
			console.log("self.currentActivityListPageNum()="+self.currentActivityListPageNum());
		},self,"Publish_ActivityListPageNum");

		self.getSignupList =function(data) {
			self.selectedActivity(data);
		};

		self.writeActivityList=function(data) {
			self.activityList([]);
			data.forEach(function(activityItem) {
				self.activityList.push(new ActivityLite(activityItem));
			});
		};	


		self.fetchPublishedActivity =function() {
			console.log("正在获取已发布活动信息! page:"+self.currentActivityListPageNum());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getpublishactivity",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"page": self.currentActivityListPageNum()
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
				       		self.selectedActivity(self.activityList()[0]);
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
		self.pageNumbers = ko.observableArray();
		self.currentActivityListPageNum = ko.observable(1);
		self.currentActivityListPageNum.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_ActivityListPageNum");
		});

		shouter.subscribe(function(value) {
			self.itemSize(value);
			console.log("VM2 self.itemSize()="+self.itemSize());
		},self,"Publish_itemSizeOfActivityList");

		self.nextPage = function() {
			self.currentActivityListPageNum(self.currentActivityListPageNum()+1);
			console.log("self.currentActivityListPageNum()="+self.currentActivityListPageNum());
		};

		self.previousPage = function() {
			self.currentActivityListPageNum(self.currentActivityListPageNum()-1);
			console.log("self.currentActivityListPageNum()="+self.currentActivityListPageNum());
		};

	};

	var ViewModel3 = function() {
		var self = this;
		self.itemSize = ko.observable(0);
		self.token = "027706ea56487ce6af2ab2b0e65268fc";
		self.list = ko.observableArray();
		self.id = ko.observable(3);

		shouter.subscribe(function(data) {
			self.id(data.id());
			self.fetchList(self.id());
		},self,"Publish_selectedActivity");
		self.currentPageNum = ko.observable(1);

		self.writeList=function(data) {
			self.list([]);
			data.forEach(function(signupItem) {
				self.list.push(new Signup(signupItem));
			});
		};

		// self.getList = function(data) {
		// 	console.log("activityid: "+data.id());
		// 	self.fetchList(data.id);
		// 	self.selectedActivity(data);
		// 	console.dir(self.selectedActivity());
		// 	return;
		// };

		self.fetchList =function(activityId) {
			console.log("正在获取报名信息! page:"+self.currentPageNum());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":activityId,
					  	"page": self.currentPageNum()
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

	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();
		self.ViewModel2 = new ViewModel2();
		self.ViewModel3 = new ViewModel3();
	})();

	ko.applyBindings(masterVM);
});