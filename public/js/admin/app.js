initialCats=[
	{
		clickCount:0,
		name:'Tabby',
		imgSrc:'img/1413379559_412a540d29_z.jpg',
		imgAttribution:'',
		nicknames:[
    		'Tabtab',
    		'fuck',
    		'dog',
    		'doggie'   		
    	]
	},
	{
		clickCount:0,
		name:'Fucker',
		imgSrc:'img/22252709_010df3379e_z.jpg',
		imgAttribution:'',
		nicknames:[
    		'Tabtab',
    		'fuck',
    		'dog',
    		'doggie'   		
    	]
	},
	{
		clickCount:0,
		name:'Bitch',
		imgSrc:'img/4154543904_6e2428c421_z.jpg',
		imgAttribution:'',
		nicknames:[
    		'Tabtab',
    		'fuck',
    		'dog',
    		'doggie'   		
    	]
	},
	{
		clickCount:0,
		name:'BitchFucker',
		imgSrc:'img/434164568_fea0ad4013_z.jpg',
		imgAttribution:'',
		nicknames:[
    		'Tabtab',
    		'fuck',
    		'dog',
    		'doggie'   		
    	]
	},
	{
		clickCount:0,
		name:'FastFucker',
		imgSrc:'img/9648464288_2516b35537_z.jpg',
		imgAttribution:'',
		nicknames:[
    		'Tabtab',
    		'fuck',
    		'dog',
    		'doggie'   		
    	]
	}
];
var ViewModel = function() {
	var self = this;
	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem) {
		self.catList.push(new Cat(catItem));
	});

	this.currentCat = ko.observable(this.catList()[0]);	
	this.incementCounter = function() {
		self.currentCat().clickCount(self.currentCat().clickCount()+1);
	};
	this.setCat = function(clickedCat) {
		self.currentCat(clickedCat);
	};//The 1st param is what elem has been clicked

};

var Cat = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.imgAttribution = ko.observable(data.imgAttribution);;	
	this.level = ko.computed(function() {
        return this.clickCount()>100?"Teen":
        (this.clickCount()>10?"Infant":"Newborn");
    },this);	
    this.nicknames = ko.observableArray(data.nicknames);	
};
ko.applyBindings(new ViewModel())