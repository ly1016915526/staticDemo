$(function(){
	$(".slide-images").each(function(){
		var slider = $(this);
		var slides = $(".slide-image", slider);
		var sliderPages = $(".slide-pager");
		var currentSlideNum = 0;
		slides.removeClass("current");
		slides.eq(currentSlideNum).addClass("current");
		sliderPages.each(function(){
			var pages = $("a", this);
			pages.removeClass("current");
			pages.eq(currentSlideNum).addClass("current");
		});
		var gotoSlide = function(num){
			slides.eq(currentSlideNum).removeClass("current");
			slides.eq(num).addClass("current");
			sliderPages.each(function(){
				var pages = $("a", this);
				pages.eq(currentSlideNum).removeClass("current");
				pages.eq(num).addClass("current");
			});
			currentSlideNum = num;
		};
		var nextSlide = function(){
			var nextSlideNum = currentSlideNum+1;
			(nextSlideNum >= slides.length) && (nextSlideNum = 0);
			gotoSlide(nextSlideNum);
		};
		var prevSlide = function(){
			var prevSlideNum = currentSlideNum-1;
			(prevSlideNum <0) && (prevSlideNum = slides.length-1);
			gotoSlide(prevSlideNum);
		};
		//transition effects
		var setTransitionEffect = function(transitionEffect){
			slider.attr("class", "slide-images " + transitionEffect);
		};
		$("#transitionEffect").on("change", function(){
			setTransitionEffect($(this).val());
		});
		$(".prevSlide").on("click", prevSlide);
		$(".nextSlide").on("click", nextSlide);
		$(".slide-pager a").each(function(i){
			if(i>slides.length){
				return false;
			}
			$(this).on("click", function(){
				gotoSlide(i);
			});
		});
		
		//auto slide next
		var lastHumanNav = 0;
		$(".prevSlide,.nextSlide,.slide-pager a").on("click", function(){
			lastHumanNav = new Date().getTime();
		});
		setInterval(function(){
			var now = new Date().getTime();
			if(now-lastHumanNav > 5000){
				nextSlide();
			}
			nextSlide();
		},5000);
	});
});