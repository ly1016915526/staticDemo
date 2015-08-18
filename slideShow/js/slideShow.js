if(typeof jQuery === "undefined"){
	throw new Error("slideShow's JavaScript requires jQuery");
}
;(function($){
	
	//引入css文件
	if($("head").length){
		$("head").append("<link href='./js/style.css' rel='stylesheet'/>")
	}else{
		$("body").append("<link href='./js/style.css' rel='stylesheet'/>");
	}
	function Slide(element, options){
		this.$element = element;
		this.defaults = {
			"cWidth":"550",//容器宽度
			"data" : [],		//数据,
			"itemWidth" : "550",
			"itemHeight" : "220",
			"animationName" : "transition-opacity", //transition-opacity,transition-left,transition-right,transition-top,transition-bottom,transition-zoom,transition-dezoom,transition-cornerzoom,transition-rotate
			"animateTime" : "5000"
		};
		this.settings = $.extend({},this.defaults,options);
		//当前num
		this.currentNum = 0;
		//切换长度
		this.totalLength = 0;
	}
	Slide.VERSION = 1.0;
	Slide.prototype.init = function(){
		var that = this;
		this.createHtml();
		this.autoSlide();
		//向前切换点击
		$(".prevSlide", this.$element).on("click",$.proxy(this.prevSlide,this));
		//向后切换点击
		$(".nextSlide", this.$element).on("click",$.proxy(this.nextSlide,this));
		//点击数字键翻页
		$(".slide-pager a", this.$element).on("click", function(){
			var index = $(this).index();
			that.gotoSlide(index);
		});
		return this;
	};
	Slide.prototype.createHtml = function(){
		//设置容器宽度
		this.$element.css({"width":this.settings.cWidth});
		var ul = "<ul id='demoSlider' class='slide-images'></ul>";
		var li = "";
		var settings = this.settings;
		$.each(this.settings.data, function(k,v){
			var alt = v.name ? v.name : "";
			li+='<li class="slide-image">'
				+'<img src="'+v.img+'" alt="'+alt+'" width="'+settings.itemWidth+'" height="'+settings.itemHeight+'"/>';
			v.name && (li+='<span>'+v.name+'</span>');
			li+='</li>';
		});
		$(ul).append(li).appendTo(this.$element);
		//添加过渡效果和设置宽高
		$(".slide-images", this.$element).addClass(this.settings.animationName).css({"width": this.settings.itemWidth,"height":this.settings.itemHeight});
		this.$element.find("li.slide-image").eq(0).addClass("current");
		var pageContanier = '<div class="options"><div>';
		var prevBtn = '<a class="prevSlide" href="javascript:;">Prev</a>';
		var nextBtn = '<a class="nextSlide" href="javascript:;">Next</a>';
		
		var pageStr = '<span class="slide-pager">';
		$.each(this.settings.data, function(k,v){
			pageStr += '<a href="javascript:;">'+(k+1)+'</a>';
		});
		pageStr += '</span>';
		$(pageContanier).append(prevBtn).append(pageStr).append(nextBtn).appendTo(this.$element);
		$(".slide-pager a",this.$element).eq(0).addClass("current");
		this.totalLength = $("li.slide-image", this.$element).length;
		return this;
	};
	//翻页
	Slide.prototype.gotoSlide = function(num){
		$(".slide-image", this.$element).removeClass("current").eq(num).addClass("current");
		$(".slide-pager a", this.$element).removeClass("current").eq(num).addClass("current");
		this.currentNum = num;
		this.setAnimation();
		return this;
	};
	//自动切换
	Slide.prototype.autoSlide = function(){
		var that = this;
		var timer = setInterval($.proxy(this.nextSlide,this),this.settings.animateTime);
		//鼠标移上 自动轮播停止
		this.$element.on("mouseenter", function(){
			clearInterval(timer);
		});
		//鼠标移出 自动轮播开始
		this.$element.on("mouseleave", function(){
			timer = setInterval($.proxy(that.nextSlide,that),that.settings.animateTime);
		});
		return this;
	};
	//向前翻页
	Slide.prototype.prevSlide = function(){
		var prevNum = this.currentNum - 1;
		prevNum<0 && (prevNum = this.totalLength-1);
		this.gotoSlide(prevNum);
	};
	//向后翻页
	Slide.prototype.nextSlide = function(){
		var nextNum = this.currentNum + 1;
		nextNum >= this.totalLength && (nextNum = 0);
		this.gotoSlide(nextNum);
	};
	//设置动画效果
	Slide.prototype.setAnimation = function(){
		var slideImage = $(".slide-image", this.$element);
		var curSlideImage = $(".slide-image.current",this.$element);
		var slideImg = slideImage.find("img");
		var curSlideImg = curSlideImage.find("img");
		switch(this.settings.animationName){
			case 'transition-opacity':
				curSlideImage.css({"width":this.settings.itemWidth + "px"}).siblings().css({"width": 0});
				break;
			case 'transition-left':
				slideImage.css({"left": -this.settings.itemWidth + "px"}).siblings(".current").css({"left":0});
				break;
			case 'transition-right':
				slideImage.css({"right": -this.settings.itemWidth + "px"}).siblings(".current").css({"right":0});
				break;
			case 'transition-top':
				slideImage.css({"top": -this.settings.itemHeight + "px"}).siblings(".current").css({"top":0});
				break;
			case 'transition-bottom':
				slideImage.css({"bottom": -this.settings.itemHeight + "px"}).siblings(".current").css({"bottom":0});
				break;
			case 'transition-cornerzoom':
				slideImg.css({"width": 0});
				curSlideImg.css({"width": this.settings.itemWidth});
				break;
			case 'transition-zoom':
				slideImg.css({"left": -this.settings.itemWidth/2,"top": -this.settings.itemHeight/2,"width": this.settings.itemWidth*2 + "px"});
				curSlideImg.css({"left": 0,"top": 0,"width": this.settings.itemWidth});
				break;
			case 'transition-dezoom':
				slideImg.css({"left": this.settings.itemWidth/2 + "px", "top": this.settings.itemHeight/2 + "px", "width": 0});
				curSlideImg.css({"left": 0, "top": 0, "width": this.settings.itemWidth});
				break;
			case 'transition-rotate':
				slideImg.css({"left": -this.settings.itemWidth + "px", "top": -this.settings.itemHeight + "px", "width": this.settings.itemWidth, "height": this.settings.itemHeight});
				curSlideImg.css({"left": 0, "top": 0});
				break;
			return this;
		}
	};
	
	$.fn.slideShow = function(options){
		var slide = new Slide(this, options);
		return this.each(function(){
			slide.init();
		});
	};
})(jQuery);