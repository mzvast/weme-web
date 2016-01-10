$(document).ready(function() {
	var jumboHeight = $('.jumbotron').outerHeight();
	function parallax(){
	    var scrolled = $(window).scrollTop();
	    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
	}

	$(window).scroll(function(e){
	    parallax();
	});			
	var ViewModel1 = function() {
		var self = this;
		self.isEdu = ko.observable(false);
		self.token = getCookie("token");
		self.currentProfile = ko.observable();
		self.avaliableSex = ko.observableArray(['男','女']);
		self.chosenSex = ko.observableArray();
		self.avaliableSchool = ko.observableArray([
												'东南大学',
												'南京师范大学',
												'中国药科大学',
												'南京林业大学',
												'南京大学',
												'南京林业大学'
												]);
		self.chosenSchool = ko.observableArray();
		self.avaliableDegree = ko.observableArray([
													'本科',
													'硕士',
													'博士'
												]);
		self.chosenDegree = ko.observableArray();
		self.submitChange = function() {
			var data = {
					  	"token": self.token,
						"birthday":self.currentProfile().birthday(),
						"degree":encodeURI(self.currentProfile().degree()),
						// "degree":"Shuoshi",
						"department":self.currentProfile().department(),
						// "enrollment":self.currentProfile().enrollment(),
						// "gender":"av",
						// "gender":self.currentProfile().gender(),
						"hobby":self.currentProfile().hobby(),
						"hometown":self.currentProfile().hometown(),
						"name":self.currentProfile().name(),
						"phone":self.currentProfile().phone(),
						"preference":self.currentProfile().preference(),
						"qq":self.currentProfile().qq(),
						// "school":self.currentProfile().school(),
						// "username":self.currentProfile().username(),
						"wechat":self.currentProfile().wechat()
					  };
			console.log(data);
			$.ajax({
					  type: "POST",
					  url: "/api/post/editprofileinfo",
					  dataType: "json",
					  data:data
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		// self.writeList(data);
				       		//console.dir(json);
				       		console.log(json);
				       		console.log("信息修改失败");
				       		self.getProfileByToken();
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		// self.writeList(data);
				       		console.log(self.currentProfile());
				       		console.log("信息修改成功");
				       		self.getProfileByToken();
							return;
				       }
					})
			.fail(function(e) {
					       console.log(e);
	                		return;

					});
		};

		self.getProfileByToken = function()  {
			//console.log("正在获取个人信息!");
			self.currentProfile("");
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofile",
					  dataType: "json",
					  data:{
					  	"token": self.token
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
				       		console.dir(json);
				       		self.currentProfile(new Profile(json));
							return;
				       }
					})
			.fail(function(e) {
					       console.log(e);
	                		return;

					});
		};

		self.getProfileByToken();

	};

	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();//userProfile
	})();

	ko.applyBindings(masterVM);
});