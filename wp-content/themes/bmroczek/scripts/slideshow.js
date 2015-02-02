var Slideshow = {

    DEBUG: true,
    
    COLOR_INDEX: 0,

    init: function() {
        console.log("Slideshow.init()");
        // kill all debug
        if (!Slideshow.DEBUG) {
            console.log = function() {};
            console.warn = function() {};
            console.debug = function() {};
            console.info = function() {};
        };

        // size container
        Slideshow.sizeContainer();

		// and on resize.. 
		$(window).resize(function() {
			if(!navigator.userAgent.match(/iPad/i)) {
				Slideshow.resizeContainer();
			}
		});
 
		// scale viewport
		Slideshow.scaleViewport();

		// if ipad, add ipad styles
		if (navigator.userAgent.match(/iPad/i)) {
			Slideshow.addIPadstyles();     
		}

		// if iphone, add mobile styles 
		if(navigator.userAgent.match(/iPhone/i)) {
			$("body").attr("id", "mobile"); 
		}

		// on mobile film hide iframe on orientation change
		$(window).on("orientationchange", function(event) {
			if(navigator.userAgent.match(/iPhone/i)) {
				$("iframe").remove();	
				$(".thumbnail").show().css("opacity", 1).css("pointer-events", "inherit");
			}
		});

		// on click of post, show highlighted state
		$(".post").click(function(e) {
			Slideshow.showDetail(e);
		});

		// close pink state on button click
		$(".exit").click(function() {
			$(".overlay").fadeOut(100);
			$(".overlay").find("iframe").remove();
		});
	
		// fade in bio page
		$(".page-id-6 p").each(function(index) {
			$(this).fadeTo(300 , 1);
        });
		
		// fade in contact page
		$(".page-id-22 p").each(function(index) {
			$(this).fadeTo(300 , 1);
        });
		
		// fade in appointments page
		$(".page-id-20 p").each(function(index) {
			$(this).fadeTo(300 , 1);
        });

		// get video thumbnails
		Slideshow.getVideoThumbnails();

		// start rotation of background color
		Slideshow.rotateBackgroundColor();
		
		// add fastclick for mobile
		$(function() {
			FastClick.attach(document.body);
		});

		// scroll with arrows
        $(document).keydown(function(e) {

			var speedL = $("#container").scrollLeft() > 0 ? ($("#container").scrollLeft() * 5000)/$("#content").width() : 6000;
			var speedR = $("#container").scrollLeft() > 0 ? (($("#content").width() - $("#container").scrollLeft()) * 6000)/$("#content").width() : 5000;

			switch(e.which) {
        		case 39: // left
					$("#container").animate({scrollLeft: $("#content").width()}, speedR);
					break;

				case 37: // right
					$("#container").animate({scrollLeft: 0}, speedL);
					break;

				default: return; // exit this handler for other keys
			}

			e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    
		// stop scroll on keup
        $(document).keyup(function() {
            $("#container").stop(true);
        });
    },

    sizeContainer: function() {
        console.log("Slideshow.sizeContainer()");

        // get widths of all articles
        var totalWidth = 0;

		// size hompage 
        $(".home .post").each(function(index) {
            $(this).find("img").load(function() {
                
				// build size of container
				totalWidth += parseInt($(this).width(), 10) + 5;
			
				// fade in img
				$(this).fadeTo(600 , 1);
				
				if(!navigator.userAgent.match(/iPhone/i)) {
					// add hover states after loaded + if not iphone
					$(this).bind( "mouseenter mouseleave", function() {
						$(this).parent().parent().parent().toggleClass( "post-hover" );
					});
				}

            });
        });

		// wait until all of page is loaded before sizing container
		$(window).load(function() {
			$(".home #content").width(totalWidth);
			//$(".page-id-66 #content").width(totalWidth);
		});
    },
    
	resizeContainer: function() {
        console.log("Slideshow.resizeContainer()");

        // get widths of all articles
        var totalWidth = 0;

        $("body .post").each(function(index) {
		
			var img = $(this).find("img:not(.play)");

			var natImage = new Image();
			natImage.src = img.attr("src");

			var newWidth = (natImage.naturalWidth/natImage.naturalHeight) * img.height();
			img.width(newWidth);

			totalWidth += newWidth + 10;
			$("#content").width(totalWidth);
			$(this).fadeTo(600 , 1);
        });
    },

    center: function(e) {
		console.log("center");

        // get left offset
        var offset = $(e.target).offset().left - $(window).scrollLeft();

        // get target size
        var targetW = $(e.target).width();

        // get diff needed to center
        var diff = offset - $(window).width()/2 + targetW/2 ;

        // curr margin-left
        var marginL = parseInt($("#content").css("margin-left"), 10);

        $("#content").animate({
            marginLeft:  marginL - diff + "px"
        }, 500);

    },

	showPhoneDetail: function(target) {
		console.log("showPhoneDetail");

		film = target.parent().hasClass("category-video"),
		title = target.parent().parent().siblings("h1").text();
		
		// check if iframe already attached
		if($(target).attr("id") == "player1") return;	
	
		if(film) {

			// remove existing iframes and add any missing thumbnails		
			$("iframe").remove();	
			$(".thumbnail").show().css("opacity", 1).css("pointer-events", "inherit");
			id = target.siblings(".entry-content").find("p").text();

			var height = target.height();
			var width = target.width();

			var iframeHtml = "<iframe id='player1' src='//player.vimeo.com/video/" + id + "?api=1' width='" + width + "' height='" + height + "' frameborder='0'></iframe>"
			target.parent().append(iframeHtml);
			
			$("player1").css("opacity", "0");
			var iframe = document.getElementById('player1');

			// $f == Froogaloop
			var player = $f(iframe);
 			player.addEvent('ready', function(id){
				console.log("READY!");
				player.api("play");
				target.css("pointer-events", "none");

				$(target).animate({
            		opacity:  0
        		}, 300);
        		
				$("player1").animate({
            		opacity:  1
        		}, 300);

			});
		}
	},

	showDetail: function(e) {
		console.log("showDetail");

		var target = $(e.target),
			overlay = $(".overlay"),
			overlayImg = overlay.find(".main-img"),
			wrapperWidth = Math.ceil(target.width() * overlayImg.height()/target.height()),
			film = target.parent().hasClass("category-video"),
			title = target.parent().parent().siblings("h1").text();
			filmTitle = target.siblings("h1").text();
			title = "<h1 class='overlay-text first-line'>" + title.replace(/;/g, "</h1><h1 class='overlay-text'>") + "</h1>";
			filmTitle = "<h1 class='overlay-text first-line'>" + filmTitle.replace(/;/g, "</h1><h1 class='overlay-text'>") + "</h1>";
		
		// remove old text	
		overlay.find(".wrapper .overlay-text").remove();

		if(navigator.userAgent.match(/iPhone/i)) {
			Slideshow.showPhoneDetail(target);
			return;
		}

		// if iframe, then show that. otherwise show img
		if(film) {

			id = target.siblings(".entry-content").find("p").text();
		
			// hide caption .. not neccesary for films
			//$(".overlay-text").hide();

			// calc iframe dimensions based on 80% of screen size	
			var iframeWidth = $(".overlay").width() * (7/10);
		
			// vimeo uses 16 X 9 aspect ratio
			var iframeHeight = iframeWidth * (9/16);
		
			// make sure height isn't greater than window size
			if($(window).height() < iframeHeight + 100) {
				iframeHeight = $(window).height() - 100;
				iframeWidth = iframeHeight * (16/9);	
			} 

			// assign wrapper height accordingly
			$(".wrapper").height(iframeHeight);

			// build iframe
			var iframe = "<iframe src='//player.vimeo.com/video/" + id + "?title=0&amp;byline=0&amp;portrait=0;autoplay=1' width='" + iframeWidth + "' height='" + iframeHeight + "' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>"
		
			// add iframe and title to overlay
			overlay.find(".wrapper").prepend(iframe);	
			overlay.find(".wrapper").append(filmTitle);

		} else {
			
			// size differently for landscalpe and ipad
			if(target.height() < target.width() && navigator.userAgent.match(/ipad/i)) {	
				$(".overlay .wrapper .main-img").width("100%").height("auto");			
				$(".overlay .wrapper").width("80%").css("max-width", "80%").css("max-height", "85%");			
			} else if(navigator.userAgent.match(/ipad/i)) {
				$(".overlay .wrapper .main-img").height(550).width(target.width() * 550/target.height());			
				$(".overlay .wrapper").width(target.width() * 550/target.height());			
			} else {
				overlay.find(".wrapper").css("width", (wrapperWidth));		
			}

			overlay.find(".wrapper").append(title);
			overlayImg.attr("src", (target.attr("src")));		
		}


		overlay.fadeIn(300);	
	},

	getVideoThumbnails: function() {
		console.log("getVideoThumbnails");

		var totalWidth = 0;

		$(".page-id-66 .post").each(function() {
			var curPost = $(this),
				id = curPost.find(".entry-content p").text(),
				dataUrl = "http://vimeo.com/api/v2/video/" + id + ".json";

			id = id.trim();
			
			if($.isNumeric(id)) {
				
				$.getJSON(dataUrl, function(result) {
					// get thumbnail
					var src = result[0]["thumbnail_large"];
					
					// calc new width based on old aspect ratio
					var width = (parseInt(result[0]["width"], 10) / parseInt(result[0]["height"], 10)) * curPost.height();  
					
					// prepend thumbnail
					curPost.prepend('<img class="thumbnail" src=' + src +' />');
					
					// fade in post
					curPost.fadeTo(600 , 1);

					// add adjusted width to container
					totalWidth += width + 15;
					console.log(totalWidth);
					$("#content").width(totalWidth);

					// add hover states after loaded 
					if(!navigator.userAgent.match(/iPhone/i)) {
						$(curPost).bind( "mouseenter mouseleave", function() {
							$(".post").removeClass("post-hover");
							$(this).toggleClass( "post-hover" );
						});
					}

				});
			} else {
				$(this).hide();
			}
			
		});
	},

	scaleViewport: function() {
		console.log("scaleViewport");

		// only scale for ipad
		if (navigator.userAgent.match(/iPad/i)) {
			var viewportmeta = document.querySelector('meta[name="viewport"]');
			if (viewportmeta) {
				viewportmeta.content = 'width=device-width, minimum-scale=0.95, maximum-scale=0.95, initial-scale=0.95';
				document.body.addEventListener('gesturestart', function () {
					viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=0.95';
				}, false);
			}

		}

	},

	addIPadstyles: function() {
		console.log("addIPadStyles");
		$("#container").css("overflow-y","scroll").css("-webkit-overflow-scrolling", "touch");
		$("#content").css("overflow-y","scroll").css("-webkit-overflow-scrolling", "touch");
	},

	rotateBackgroundColor: function() {
		console.log("Slideshow.rotateBackgroundColor()");		

		var colors = [  "rgba(224,45,41, 0.3)", 
						"rgba(254,240,222,0.6)", 
						"rgba(142,199,109, 0.2)",
						"rgba(9,198,180,0.08)", 
						"rgba(53,178,226,0.1)", 
						"rgba(223,74,258,0.11)", 
					 ];

		Slideshow.COLOR_INDEX = Math.floor(Math.random() * (colors.length - 1)); 
		
		var color = colors[Slideshow.COLOR_INDEX];

		$("body").css("background-color", color);
		Slideshow.COLOR_INDEX = Slideshow.COLOR_INDEX <= (colors.length - 2) ? Slideshow.COLOR_INDEX + 1 : 0;
	
		setInterval(function() {
			console.log("change background color");
			console.log(colors[Slideshow.COLOR_INDEX]);
			
			var color = colors[Slideshow.COLOR_INDEX];
			
			$("body").animate({
				backgroundColor: color
			}, 4000);	

			Slideshow.COLOR_INDEX = Slideshow.COLOR_INDEX <= (colors.length - 2) ? Slideshow.COLOR_INDEX + 1 : 0;
		}, 8000);

	}

}



//Slideshow.init();
