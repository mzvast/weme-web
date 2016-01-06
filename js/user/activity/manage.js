$(document).ready(function() {
	var downloadList = ko.observableArray();
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
		self.imgUrlSmall = ko.computed(function() {
			return "//218.244.147.240:80/avatar/"+self.id()+"_thumbnail.jpg";
		});		
		self.flagStatus = ko.computed(function() {
			return self.flag()==1?"通过":"未通过";
		});
	};
	var Profile = function(data) {
		var self = this;
		self.birthday = ko.observable(data.birthday);
		self.degree = ko.observable(data.degree);
		self.department = ko.observable(data.department);
		self.enrollment = ko.observable(data.enrollment);
		self.gender = ko.observable(data.gender);
		self.hobby = ko.observable(data.hobby);
		self.hometown = ko.observable(data.hometown);
		self.id = ko.observable(data.id);
		self.lookcount = ko.observable(data.lookcount);
		self.name = ko.observable(data.name);
		self.phone = ko.observable(data.phone);
		self.preference = ko.observable(data.preference);
		self.qq = ko.observable(data.qq);
		self.reason = ko.observable(data.reason);
		self.school = ko.observable(data.school);
		self.state = ko.observable(data.state);
		self.username = ko.observable(data.username);
		self.wechat = ko.observable(data.wechat);
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
	var shouter = new ko.subscribable();
	//我发布的活动列表
	var ViewModel1 = function() {
		var self = this;
		self.showRefresh = ko.observable(true);
		self.itemSize = ko.observable(0);
		self.list = ko.observableArray();
		self.currentPageIndex = ko.observable(1);
		self.token = getCookie("token");
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
				       		self.showRefresh(false);
				       		self.writeActivityList(data);
				       		self.selectedItem(self.list()[0]);
				       		self.itemSize(self.itemSize()||json.pages*10);//set itemSize
				       		console.dir("self.itemSize()===="+self.itemSize());
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

		self.goToPage = function(data) {
			self.currentPageIndex(data);
		};

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
		self.showDownload = ko.observable(false);
		self.showExport = ko.computed(function() {
			return !self.showDownload();
		});
		self.showRefresh = ko.observable(false);
		self.pages = ko.observable(1);
		self.itemSize = ko.observable(0);
		// Publish SignupList itemSize to ViewModel4
		self.itemSize.subscribe(function(value) {
			shouter.notifySubscribers(value,"Publish_itemSizeOfSignupList");
		});
		self.token = getCookie("token");
		self.list = ko.observableArray();
		self.id = ko.observable();
		self.clickedItem = ko.observable();
		// Publish_clickedSignupItem to ViewModel5
		self.clickedItem.subscribe(function(data) {
			shouter.notifySubscribers(data.id(),"Publish_clickedSignupItem");
			console.log("cliked publish data.id()= "+data.id());
		});
		self.currentPageIndex = ko.observable(1);
		// Subscribe selectedActivityItem from ViewModel1
		shouter.subscribe(function(data) {
			self.id(data.id());
			self.fetchList(self.id());
			self.showDownload(false);
		},self,"Publish_selectedActivity");		
		// Subscribe currentPageIndex from ViewModel4
		shouter.subscribe(function(value) {
			self.currentPageIndex(value);
			self.fetchList(self.id());
		},self,"Publish_SignupListPageNum");

		self.saveAs = function() {
			var ep=new ExcelPlus();
			ep.createFile("Sheet1")
			  .write({"content":[["id","姓名","性别","学校"]]});
			for (var i = 0; i < downloadList().length; i++) {
				var data = downloadList()[i]
				ep.write({  "cell":"A"+(i+2),"content":data['id'] })
				  .write({  "cell":"B"+(i+2),"content":data['name'] })
				  .write({  "cell":"C"+(i+2),"content":data['gender'] })
				  .write({  "cell":"D"+(i+2),"content":data['school'] });
			};			  
			  ep.saveAs("活动_"+self.id()+"_报名表"+".xlsx");
			  self.showDownload(false);
		};		

		self.download = function() {
			console.log("开始下载辣");
			downloadList.removeAll();
			console.log("BEFORE downloadList()==="+downloadList());
			for (var i = 1; i <= self.pages(); i++) {
				var toSave;
				if (i==self.pages()) {
					toSave = true;
				} else{
					toSave = false;
				};
				self.downloadPageData(i,toSave);
			};
			self.showDownload(true);
		};
		self.downloadPageData = function(pageIndex,toSave) {
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":self.id(),
					  	"page": pageIndex
					  },
					})
			.done(function(json) {
						var data = json.result
				       if (data.length==0) {
				       		console.dir("no more download data");
				       		console.dir(data);
				       		return;
				       } 
				       else{
				       		console.dir("got download data!");				       		
				       		console.dir(data);
				       		data.forEach(function(obj) {
				       			downloadList.push(obj);				       			
				       		});
							console.log("AFTER downloadList()===");
							console.log(downloadList());
							if (toSave == true) {
								return self.saveAs();
							} else{
							 	return ;
							};
				       };
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       console.log(e);
	                		return;

					})
			.always(function() {
				
				return;
			})
		};

		self.showModal = function(data) {
			self.clickedItem(data);
			console.log("cliked详情!");
		};
		self.writeList=function(data) {
			self.list([]);
			if (data.length!==0) {
				data.forEach(function(signupItem) {
					self.list.push(new Signup(signupItem));
				});	
				return;			
			}else{
				return;
			};
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
				       		self.showRefresh(false);
				       		self.writeList(data);
				       		console.dir(data);
				       		self.pages(json.pages);
				       		console.dir("pages==="+self.pages());
				       		self.itemSize(self.itemSize()||json.pages*10);//set itemSize
				       		console.dir("self.itemSize()==="+self.itemSize());
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

		self.goToPage = function(data) {
			self.currentPageIndex(data);
		};

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
	var ViewModel5 = function() {
		var self = this;
		self.token = getCookie("token");
		self.currentId = ko.observable();
		self.currentProfile = ko.observable();
		// Subscribe Publish_clickedSignupItem from ViewModel3
		shouter.subscribe(function(id) {
			self.currentProfile("");
			self.currentId(id);
			self.getProfileById();
		},self,"Publish_clickedSignupItem");
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
					       console.log(e);
	                		return;

					})
		};
	};

	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();//ActivitList
		self.ViewModel2 = new ViewModel2();//ActivitList pignation
		self.ViewModel3 = new ViewModel3();//SignupList
		self.ViewModel4 = new ViewModel4();//SignupList pignation
		self.ViewModel5 = new ViewModel5();//Model
	})();

	ko.applyBindings(masterVM);
});