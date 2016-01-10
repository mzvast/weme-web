$(document).ready(function() {
	// 多选框全选
// 	$("#checkAll").click(function(){
//     	$('input:checkbox').prop('checked', this.checked);
// });
	var downloadList = ko.observableArray();
	var downloadDetailList = ko.observableArray();

	//我发布的活动列表
	var ViewModel1 = function() {
		var self = this;
		self.showRefresh = ko.observable(true);
		self.list = ko.observableArray();
		self.currentPageIndex = ko.observable(1);
		self.token = getCookie("token");
		// Publish ActivityList itemSize to ViewModel2
		self.itemSize = ko.observable(0).publishOn("Publish_itemSizeOfActivityList");
		// Publish selectedActivityItem to ViewModel3 
		self.selectedItem = ko.observable().publishOn("Publish_selectedActivity");
		// Subscribe currentPageIndex change from ViewModel2 
		ko.postbox.subscribe("Publish_ActivityListPageNum",function(value) {
			self.currentPageIndex(value);
			self.fetchPublishedActivity();
			//console.log("self.currentPageIndex()="+self.currentPageIndex());
		},self);

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
			//console.log("正在获取已发布活动信息! page:"+self.currentPageIndex());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getpublishactivity",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"page": self.currentPageIndex()
					  }
					})
			.done(function(json) {
						var data = json.result;
				       //console.dir(data);			       
				       if (data.length==0) {
				       		//console.dir("no more data");
				       		//console.dir(data);
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		self.showRefresh(false);
				       		self.writeActivityList(data);
				       		self.selectedItem(self.list()[0]);
				       		self.itemSize(self.itemSize()||json.pages*10);//set itemSize
				       		//console.dir("self.itemSize()===="+self.itemSize());
				       		//console.dir(data);
							return;
				       }
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       //console.log(e);
	                		return;

					});
		};

		self.fetchPublishedActivity();//初始化的时候先运行一遍

	};
	//发布的活动的pignation
	var ViewModel2 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish currentPageIndex to ViewModel1
		self.currentPageIndex = ko.observable(1).publishOn("Publish_ActivityListPageNum");
		// Subscribe ActivityList itemSize
		ko.postbox.subscribe("Publish_itemSizeOfActivityList",function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			//console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
			//console.log("VM2 self.pageNumbers()="+self.pageNumbers());
		},self);

		self.hasNext=ko.computed(function() {
			//console.log("VM2 self.currentPageIndex()="+self.currentPageIndex());
			//console.log("VM2 self.lastPageIndex()="+self.lastPageIndex());
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
			}
		};

		self.nextPage = function() {
			self.currentPageIndex(self.currentPageIndex()+1);
			//console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

		self.previousPage = function() {
			self.currentPageIndex(self.currentPageIndex()-1);
			//console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

	};
	//报名用户列表
	var ViewModel3 = function() {
		var self = this;
		self.checkAll = function() {
			self.list().forEach(function(item) {
				item.isSelected(!item.isSelected());
			});
			self.getSignupSelected();
		};
		self.getSignupSelected = function() {
			self.list().forEach(function(item) {
				//console.log("id:"+item.id());
				//console.log("isSelected:"+item.isSelected());
			});
		};	
		self.checkedList = ko.observableArray();	
		self.makeCheckedList = function() {
			self.checkedList([]);
			self.list().forEach(function(obj) {
				if (obj.isSelected()==true) {
					self.checkedList.push(obj.id());					
				}
			});
		};

		self.setPassUser=function(data) {
			self.makeCheckedList();
		//console.log("正在设置通过用户!");
			$.ajax({
					  type: "POST",
					  url: "/api/post/setpassuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":data.id(),
					  	"userlist":self.checkedList()
					  },
					  success: function(json) {
					       //console.log(json.result);
					       self.fetchList(self.id());
					    },
					  error: function(e) {
					       //console.log(e);
	                		return;
	    				}
					});
		};		

		self.setNoPassUser=function(data) {
			self.makeCheckedList();
		//console.log("正在设置不通过用户!");
			$.ajax({
					  type: "POST",
					  url: "/api/post/deletepassuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":data.id(),
					  	"userlist":self.checkedList()
					  },
					  success: function(json) {
					       //console.log(json.result);
					       self.fetchList(self.id());
					    },
					  error: function(e) {
					       //console.log(e);
	                		return;
	    				}
					});
		};	

		self.displayCheckList = function() {
			self.makeCheckedList();
			//console.log('checked these people==>',self.checkedList());
		};
		self.currentDownloadNum = ko.observable();
		self.showDownload = ko.observable(false);
		self.showExport = ko.computed(function() {
			return !self.showDownload();
		});
		self.showRefresh = ko.observable(false);
		self.pages = ko.observable(1);
		// Publish SignupList itemSize to ViewModel4
		self.itemSize = ko.observable(0).publishOn("Publish_itemSizeOfSignupList");
		self.token = getCookie("token");
		self.list = ko.observableArray();
		self.id = ko.observable();
		// Publish_clickedSignupItem to ViewModel5
		self.clickedItem = ko.observable().publishOn("Publish_clickedSignupItem");
		self.currentPageIndex = ko.observable(1);
		// Subscribe selectedActivityItem from ViewModel1
		ko.postbox.subscribe("Publish_selectedActivity",function(data) {
			self.id(data.id());
			self.fetchList(self.id());
			self.showDownload(false);
		},self);		
		// Subscribe currentPageIndex from ViewModel4
		ko.postbox.subscribe("Publish_SignupListPageNum",function(value) {
			self.currentPageIndex(value);
			self.fetchList(self.id());
		},self);

		self.saveAs = function() {
			var ep=new ExcelPlus();
			ep.createFile(["名单","详细信息"])
			.selectSheet("名单")
			  .write({"content":[["id","姓名","性别","学校"]]});
			for (var i = 0; i < downloadList().length; i++) {
				var data = downloadList()[i];
				ep.write({  "cell":"A"+(i+2),"content":data['id']?data['id']:" " })
				  .write({  "cell":"B"+(i+2),"content":data['name']?data['name']:" " })
				  .write({  "cell":"C"+(i+2),"content":data['gender']?data['gender']:" " })
				  .write({  "cell":"D"+(i+2),"content":data['school']?data['school']:" " });
			}		  
			//console.log(downloadDetailList());
			ep.selectSheet("详细信息")
			  .write({"content":[["id","姓名","性别","电话","QQ","生日","家乡","学校","入学时间","学院","学历"]]});
			for (var i = 0; i < downloadDetailList().length; i++) {
				//console.log("i=="+i);
				var data = downloadDetailList()[i];
				ep.write({  "cell":"A"+(i+2),"content":data['id']?data['id']:" " })
				  .write({  "cell":"B"+(i+2),"content":data['name']?data['name']:" " })
				  .write({  "cell":"C"+(i+2),"content":data['gender']?data['gender']:" " })
				  .write({  "cell":"D"+(i+2),"content":data['phone']?data['phone']:" " })
				  .write({  "cell":"E"+(i+2),"content":data['qq']?data['qq']:" " })
				  .write({  "cell":"F"+(i+2),"content":data['birthday']?data['birthday']:" " })
				  .write({  "cell":"G"+(i+2),"content":data['hometown']?data['hometown']:" " })
				  .write({  "cell":"H"+(i+2),"content":data['school']?data['school']:" " })
				  .write({  "cell":"I"+(i+2),"content":data['enrollment']?data['enrollment']:" " })
				  .write({  "cell":"J"+(i+2),"content":data['department']?data['department']:" " })
				  .write({  "cell":"K"+(i+2),"content":data['degree']?data['degree']:" " });
			}			  
			  ep.saveAs("活动_"+self.id()+"_报名表"+".xlsx");
			  self.showDownload(false);
		};		

		self.downloadDetailList = function() {
			self.itemSize(downloadList().length);
			//console.log("正在下载详细信息辣");
			downloadDetailList.removeAll();
			//console.log("BEFORE downloadDetailList()==="+downloadDetailList());
			self.downloadDetailData(0);

		};
		self.download = function() {
			//console.log("开始下载辣");
			downloadList.removeAll();
			//console.log("BEFORE downloadList()==="+downloadList());
			self.downloadPageData(1);
			self.showDownload(true);
		};
		self.downloadDetailData = function(num) {
			if (num == downloadList().length) {
				return self.saveAs();
			}
			//console.log("num==="+num);
			self.currentDownloadNum(num+1);
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofilebyid",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"id":downloadList()[num]["id"]
					  }
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		//console.log("no data");
				       		return;
				       } 
				       else{
				       		//console.log("got data!");
				       		//console.dir(json);
				       		downloadDetailList.push(json);
				       		if (num < downloadList().length) {
				       			self.downloadDetailData(num+1);
				       			return;
				       		}
				       		//console.log(downloadDetailList());
							return;
				       }
					})
			.fail(function(e) {
					       //console.log(e);
	                		return;

					});
		};

		self.downloadPageData = function(num) {
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":self.id(),
					  	"page": num
					  }
					})
			.done(function(json) {
						var data = json.result;
				       if (data.length==0) {
				       		//console.log("no more download data");
				       		//console.dir(data);
				       		return;
				       } 
				       else{
				       		//console.log("got download data!");				       		
				       		//console.dir(data);
				       		data.forEach(function(obj) {
				       			downloadList.push(obj);				       			
				       		});
				       		if (num < self.pages) {
				       			self.downloadPageData(num+1);
				       		}
							//console.log("AFTER downloadList()===");
							//console.log(downloadList());
							self.downloadDetailList();
							return;
				       }
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       //console.log(e);
	                		return;

					})
			.always(function() {
				
				return;
			});
		};		


		self.showModal = function(data) {
			self.clickedItem(data);
			//console.log("cliked详情!");
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
			}
		};

		self.fetchList =function(activityId) {
			//console.log("正在获取报名信息! page:"+self.currentPageIndex());
			$.ajax({
					  type: "POST",
					  url: "/api/post/getactivityattentuser",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"activityid":activityId,
					  	"page": self.currentPageIndex()
					  }
					})
			.done(function(json) {
						var data = json.result;
				       //console.dir(data);			       
				       if (data.length==0) {
				       		//console.dir("no more data");
				       		self.writeList(data);
				       		//console.dir(data);
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		self.showRefresh(false);
				       		self.writeList(data);
				       		//console.dir(data);
				       		self.pages(json.pages);
				       		//console.dir("pages==="+self.pages());
				       		self.itemSize(self.itemSize()||json.pages*10);//set itemSize
				       		//console.dir("self.itemSize()==="+self.itemSize());
							return;
				       }
					})
			.fail(function(e) {
					  	self.showRefresh(true);
					       //console.log(e);
	                		return;
					});
		};

		self.fetchList(self.id());
	};

	//报名用户的pignation
	var ViewModel4 = function() {
		var self = this;
		self.itemSize = ko.observable();
		self.pageNumbers = ko.observableArray([1]);
		self.lastPageIndex = ko.computed(function() {
			return Math.ceil(self.itemSize()/10);
		});
		// Publish SignupList currentPageIndex to ViewModel3
		self.currentPageIndex = ko.observable(1).publishOn("Publish_SignupListPageNum");
		// Subscribe SignupList itemSize from ViewModel3
		ko.postbox.subscribe("Publish_itemSizeOfSignupList",function(value) {
			self.itemSize(value);
			self.makePageNumbers(self.lastPageIndex());
			//console.log("VM4 self.lastPageIndex()="+self.lastPageIndex());
			//console.log("VM4 self.pageNumbers()="+self.pageNumbers());
		},self);

		self.hasNext=ko.computed(function() {
			//console.log("VM4 self.currentPageIndex()="+self.currentPageIndex());
			//console.log("VM4 self.lastPageIndex()="+self.lastPageIndex());
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
			}
		};

		self.nextPage = function() {
			self.currentPageIndex(self.currentPageIndex()+1);
			//console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

		self.previousPage = function() {
			self.currentPageIndex(self.currentPageIndex()-1);
			//console.log("self.currentPageIndex()="+self.currentPageIndex());
		};

	};
	var ViewModel5 = function() {
		var self = this;
		self.token = getCookie("token");
		self.showProfile = ko.observable(false);
		self.showPicture = ko.observable(false);
		self.imgUrls = ko.observableArray();
		self.currentSignupId = ko.observable();
		self.currentActivity = ko.observable().subscribeTo("Publish_selectedActivity");
		self.currentProfile = ko.observable();
		// Subscribe Publish_clickedSignupItem from ViewModel3
		ko.postbox.subscribe("Publish_clickedSignupItem",function(data) {
			self.currentProfile("");
			self.currentSignupId(data.id());
			self.displayProfile();
			self.getProfileById();
			//console.log("showPicture=="+self.showPicture());
		},self);
		self.displayPicture = function() {
			self.showProfile(false);
			self.showPicture(true);
			self.makePicture();
		};
		self.displayProfile =function() {
			self.showProfile(true);
			self.showPicture(false);
		};
		self.getProfileById = function()  {
			//console.log("正在获取个人信息!");
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofilebyid",
					  dataType: "json",
					  data:{
					  	"token": self.token,
					  	"id":self.currentSignupId()
					  }
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		// self.writeList(data);
				       		//console.dir(json);
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		// self.writeList(data);
				       		//console.dir(json);
				       		self.currentProfile(new Profile(json));
				       		//console.dir(self.currentProfile());
							return;
				       }
					})
			.fail(function(e) {
					       //console.log(e);
	                		return;

					});
		};

		//用于测试照片存在与否
		self.testImageExist = function() {
			//console.log("url=="+"/api-img/"+26+"-"+37+"-"+1);
				  $.ajax({
				    type: "GET",
				    url: "/api-img/"+26+"-"+37+"-"+1,
				    success: function(img) {
				    	//console.log("IMAGE is avaliable!");
				    },
				    error: function(error, txtStatus) {
				      //console.log(txtStatus);
				      //console.log('error');
				    }
				  });
		};
		//粗糙实现，因为没有办法判断有几张以及是否存在照片
		self.makePicture = function() {
			self.imgUrls.removeAll();
			//console.log("正在获取生活照!");
			for (var i = 1; i <= 9; i++) {
			var url = "//218.244.147.240:80/picture/activitylifeimages/"+self.currentActivity().id()+"-"+self.currentSignupId()+"-"+i;
			// var url = "//218.244.147.240:80/picture/activitylifeimages/"+26+"-"+37+"-"+i;
				self.imgUrls.push(url);
			}
			//console.dir(self.imgUrls());
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